import { ScoreTaskDto } from '@/dtos/tasks/score-task-dto';
import { TaskScoringProvider } from '../task-scoring-provider';
import openai from '@/lib/ai';

export class OpenAiTaskScoringProvider implements TaskScoringProvider {
  async scoreTask(data: ScoreTaskDto) {
    const systemPrompt = `
You are an AI-Priority Middleware responsible for intelligently prioritizing operational tasks inside a technology company.

Your role is to analyze a task based on business and operational impact.

When analyzing a task, consider:

- Revenue impact
- User impact
- System stability
- Operational urgency
- Risk escalation potential

This analysis is hypothetical and should be based on the information provided in the task's title and description. Assume a typical company context.

You must return a structured JSON object containing:

- urgency_score (integer from 1 to 10)
- impact_score (integer from 1 to 10)
- priority_score (integer from 1 to 10, based on a balanced evaluation of urgency and impact)
- category (one of: "bug", "incident", "feature", "operational")
- reasoning (short explanation focused on business context, max 20 words)

Scoring Guidelines:

- 1-3 → Low priority (minor inconvenience, no business risk)
- 4-6 → Medium priority (affects limited users or internal workflow)
- 7-8 → High priority (significant operational or revenue impact)
- 9-10 → Critical (system outage, revenue blocking, major customer impact)

Priority score must reflect a balanced evaluation of urgency and impact.

Respond ONLY with valid JSON.
Do not include markdown.
Do not include explanations outside the JSON structure.
`;

    const userInput = `Title: ${data.title}\nDescription: ${data.description}`;
    const model = 'gpt-4o-mini';

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'task_priority',
          schema: {
            type: 'object',
            properties: {
              urgency_score: { type: 'number' },
              impact_score: { type: 'number' },
              priority_score: { type: 'number' },
              category: { type: 'string' },
              reasoning: { type: 'string' },
            },
            required: [
              'urgency_score',
              'impact_score',
              'priority_score',
              'category',
              'reasoning',
            ],
          },
        },
      },
    });

    return { ...response, systemPrompt, model, userInput };
  }
}
