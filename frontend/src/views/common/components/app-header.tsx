import Link from 'next/link';
import { House } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="w-full bg-white border-b border-cyan-400 h-17.5 flex items-center px-8">
      <div className="w-full flex items-center justify-between">
        <Link
          href="/"
          className="text-cyan-700 hover:text-cyan-800 transition-colors"
        >
          <House size={42} />
        </Link>

        <Link
          href="/create-task"
          className="text-cyan-700 hover:text-cyan-800 font-bold font-display transition-colors hover:underline"
        >
          Create Task
        </Link>

        <Link
          href="/logs-history"
          className="text-cyan-700 hover:text-cyan-800 font-bold font-display transition-colors hover:underline"
        >
          See AI History
        </Link>
      </div>
    </header>
  );
}
