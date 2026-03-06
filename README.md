# Lyfiti Challenge — AI-Priority Middleware

MVP de um sistema de priorização inteligente de tarefas, desenvolvido como parte do processo seletivo da Lyfiti.

O sistema recebe uma tarefa via API (título + descrição), a processa através de uma LLM (OpenAI GPT-4o-mini), que atua como um **middleware de prioridade**, classificando urgência, impacto, prioridade e categoria com base no contexto operacional e de negócio da tarefa. Os resultados são exibidos em um dashboard funcional e intuitivo.

> **Live demo:** [https://lyfiti-challenge.vercel.app/](https://lyfiti-challenge.vercel.app/)
>
> ⚠️ A API está hospedada no Render no plano free — pode haver um **cold start** de alguns segundos no primeiro carregamento dos dados.

---

## Índice

- [Escopo da aplicação](#escopo-da-aplicação)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Arquitetura e decisões técnicas](#arquitetura-e-decisões-técnicas)
- [Modelos de dados](#modelos-de-dados)
- [Endpoints da API](#endpoints-da-api)
- [Frontend](#frontend)
- [Deploy](#deploy)
- [Como rodar localmente](#como-rodar-localmente)
- [Uso de IA no desenvolvimento](#uso-de-ia-no-desenvolvimento)

---

## Escopo da aplicação

O sistema funciona como um **middleware de prioridade inteligente**. Ao cadastrar uma tarefa com título e descrição, o scoring provider envia o contexto para o GPT-4o-mini, que analisa e retorna:

- **Urgency Score** (1–10): o quão urgente é a resolução
- **Impact Score** (1–10): o impacto no negócio/usuários
- **Priority Score** (1–10): avaliação balanceada entre urgência e impacto
- **Category**: `bug`, `incident`, `feature` ou `operational`
- **Reasoning**: breve justificativa com foco no contexto de negócio

Todas as chamadas à LLM são registradas em logs (`AiLog`), incluindo o model usado, o system prompt, o input do usuário, a resposta bruta, a resposta parseada e o status da operação.

A aplicação **não possui autenticação** — não era o escopo do desafio, portanto todas as rotas são públicas.

---

## Tecnologias utilizadas

### API
| Tecnologia | Motivo da escolha |
|---|---|
| **Node.js + Express 5** | Leveza, familiaridade e ecossistema maduro para APIs REST |
| **TypeScript** | Tipagem estática, manutenibilidade e melhor DX |
| **Prisma 6.3** | ORM type-safe com migrations, interface elegante com PostgreSQL, praticidade para colocar projetos em produção de forma rápida |
| **PostgreSQL** | Banco relacional robusto, ideal para dados estruturados |
| **OpenAI SDK** | Integração com GPT-4o-mini para classificação inteligente das tasks |
| **Zod** | Validação e parsing de schemas em runtime |
| **Docker (multi-stage)** | Imagem de produção leve, sem tooling de build no runtime |

### Frontend
| Tecnologia | Motivo da escolha |
|---|---|
| **Next.js (App Router)** | SSR nativo, roteamento elegante e excelente DX |
| **TypeScript** | Consistência com o back e segurança de tipos |
| **Tailwind CSS v4** | Velocidade de estilização e design system utilitário |
| **Recharts** | Biblioteca de charts declarativa e customizável para React |
| **react-hook-form + Zod** | Formulários performáticos com validação type-safe |
| **Axios** | Cliente HTTP com interceptors, timeout e tipagem integrada ao client de API |
| **Lucide React** | Ícones leves e consistentes |

---

## Arquitetura e decisões técnicas

### Backend — SOLID e separação de responsabilidades

Mesmo tratando-se de um projeto pequeno e de processo seletivo, optei por aplicar os **princípios SOLID** no backend. A razão é simples: boas práticas não são exclusividade de projetos grandes — elas constroem o hábito e tornam qualquer codebase mais fácil de manter, testar e evoluir.

A estrutura segue um padrão de camadas bem definido:

```
Controller → Service → Repository → Database
                ↕
        ScoringProvider (LLM)
```

- **Controllers**: recebem a requisição HTTP, validam o body com Zod e delegam para o service
- **Services**: contêm a lógica de negócio — orquestram o scoring provider e os repositórios
- **Repositories**: abstraem o acesso ao banco. Cada repositório possui uma **interface** (`TasksRepository`, `AiLogsRepository`) e uma implementação concreta com Prisma (`PrismaTasksRepository`, `PrismaAiLogsRepository`). Isso respeita o **Dependency Inversion Principle** e facilita a troca de ORM ou banco sem impactar o restante do sistema
- **Providers**: o `TaskScoringProvider` é uma interface implementada pelo `OpenAiTaskScoringProvider`. Isso permite, no futuro, trocar a OpenAI por Anthropic ou qualquer outra LLM sem alterar o service

### Frontend — organização inspirada em Vibe Coding com Next.js

O frontend foi desenvolvido com uma abordagem próxima ao **vibe coding com Next.js** — utilizando o GitHub Copilot de forma intensiva para geração e refinamento de código — mas sem abrir mão de organização. As telas são divididas em **views**, cada uma com seus componentes, tipos e lógica de API isolados.

O fetch dos dados do dashboard utiliza **Server-Side Rendering (SSR)**, executando a requisição à API diretamente no servidor durante o render da página. Isso garante:
- Dados sempre frescos ao carregar a página
- Melhor performance percebida pelo usuário
- Sem flash de loading no carregamento inicial

---

## Modelos de dados

### Task
```prisma
model Task {
  id            String   @id @default(uuid())
  title         String
  description   String
  urgencyScore  Int
  impactScore   Int
  priorityScore Int
  category      String
  reasoning     String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  aiLogs        AiLog[]
}
```

### AiLog
```prisma
model AiLog {
  id             String   @id @default(uuid())
  taskId         String?
  task           Task?
  model          String
  systemPrompt   String
  userInput      String
  rawResponse    String
  parsedResponse Json?
  status         String   // SUCCESS | EMPTY_RESPONSE | INVALID_FORMAT | API_ERROR
  createdAt      DateTime @default(now())
}
```

---

## Endpoints da API

Base URL (produção): `https://lyfiti-challenge.onrender.com`

> Para explorar os endpoints diretamente, use o **Insomnia** ou **Postman** apontando para a base URL acima.

---

### `POST /tasks`
Cria uma nova task. Internamente, o scoring provider envia o título e a descrição para o GPT-4o-mini, que retorna os scores, a categoria e o reasoning. Tudo é persistido no banco, e a chamada à LLM é registrada como um `AiLog`.

---

### `GET /tasks`
Retorna todas as tasks cadastradas, ordenadas da mais recente para a mais antiga.

---

### `GET /ai-logs`
Retorna o histórico completo de chamadas à LLM, incluindo o system prompt usado, o input enviado, a resposta bruta, a resposta parseada e o status da operação.

---

## Frontend

O dashboard exibe as tasks cadastradas com:

- **Tabela interativa**: filtros por categoria e por dia, ordenação por urgência, impacto e prioridade, badges de categoria com cores distintas e score colorido por faixa (verde/laranja/vermelho)
- **Scatter Plot (Urgência × Impacto)**: visualiza a distribuição das tasks em quadrantes de prioridade, com tooltip customizado no hover
- **Bar Chart por categoria**: total de tasks agrupadas por categoria (`bug`, `incident`, `feature`, `operational`)

Com a evolução da aplicação, novos recursos poderiam ser adicionados naturalmente:
- Filtros por mês ou intervalo de datas
- Gráfico de colunas agrupadas com incidentes por dia/categoria
- `GET /tasks/:id` para busca granular por task
- Query params para filtros na API (`?category=bug&from=2026-03-01`)
- Autenticação e controle de acesso por equipe

---

## Deploy

| Serviço | Plataforma |
|---|---|
| **Banco de dados** | [Supabase](https://supabase.com) (PostgreSQL gerenciado) |
| **API** | [Render](https://render.com) — deploy via Docker (imagem multi-stage) |
| **Frontend** | [Vercel](https://vercel.com) — deploy automático via Next.js |

A API é containerizada com um **Dockerfile multi-stage**: o stage `builder` compila o TypeScript e gera o Prisma client; o stage `runner` parte de uma imagem limpa do Node e contém apenas as dependências de produção e o código compilado — resultando em uma imagem menor e mais rápida para o runtime.

---

## Como rodar localmente

### Pré-requisitos
- Node.js 22+
- Docker e Docker Compose
- Uma chave de API da OpenAI

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/lyfiti-challenge.git
cd lyfiti-challenge
```

### 2. Configure as variáveis de ambiente

**API** — copie e preencha:
```bash
cd api
cp .env.example .env
```

```env
PORT=3333
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5433/${POSTGRES_DB}
DIRECT_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5433/${POSTGRES_DB}
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
OPENAI_API_KEY=sua-chave-aqui
```

**Frontend** — copie e preencha:
```bash
cd ../frontend
cp .env.example .env
```

```env
API_URL=http://localhost:3333
NEXT_PUBLIC_API_URL=http://localhost:3333
```

> **Por que duas variáveis apontando para o mesmo lugar?**
> O Next.js só expõe variáveis com o prefixo `NEXT_PUBLIC_` ao bundle do browser — variáveis sem esse prefixo existem exclusivamente no servidor, o que evita vazar URLs internas ou dados sensíveis para o cliente.
>
> Neste projeto ambas apontam para o mesmo endereço por se tratar de uma API pública simples. Em uma aplicação real e robusta, elas poderiam (e deveriam) ser diferentes:
> - `NEXT_PUBLIC_API_URL` → URL pública, acessível pelo browser (ex: `https://api.meusite.com`)
> - `API_URL` → URL interna, acessível apenas no servidor (ex: `http://api-service:3333` dentro de uma VPC/rede privada)
>
> Isso permite que chamadas SSR usem a rota de rede privada — mais rápida e sem tráfego externo — enquanto as chamadas client-side usam a rota pública.

### 3. Suba o banco com Docker Compose
```bash
cd api
docker-compose up -d
```

### 4. Execute as migrations
```bash
npx prisma migrate deploy
```

### 5. Inicie a API
```bash
npm run dev
```

### 6. Inicie o frontend (em outro terminal)
```bash
cd frontend
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

---

## Uso de IA no desenvolvimento

Este projeto foi desenvolvido com uso intensivo de IA — principalmente o **Claude Sonnet 4.6 via GitHub Copilot Pro** — para geração de código, sugestões inline, refinamentos de arquitetura e debugging.

O uso de IA foi intencional e faz parte do escopo do desafio. Entretanto, o objetivo sempre foi **orquestrar e validar** o que era gerado, não apenas aceitar sugestões cegamente. Isso se reflete em decisões como:

- Aplicação de SOLID mesmo em um projeto pequeno
- Separação clara de responsabilidades entre camadas
- Registro de logs de IA com tratamento de múltiplos status de erro
- SSR no dashboard para performance real, não apenas aparente
- Prisma `select` explícito para não vazar dados desnecessários na response

Pretendo em breve migrar para o **Claude Code Integrado ao VSCode** ou **Cursor** para aprofundar ainda mais o fluxo de vibe coding estruturado — ambos estão no meu radar e planejo testar os dois.

