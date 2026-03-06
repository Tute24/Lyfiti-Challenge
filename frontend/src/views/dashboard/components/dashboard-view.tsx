import { Task } from '../types/task';
import { TasksTable } from './tables/tasks-table';
import { ScatterPlot } from './charts/scatter-plot/scatter-plot';
import { CategoryBarChart } from './charts/category-bar-chart/category-bar-chart';

interface DashboardViewProps {
  tasks: Task[];
}

const ALL_CATEGORIES = ['bug', 'incident', 'feature', 'operational'];

export function DashboardView({ tasks }: DashboardViewProps) {
  const scatterData = tasks.map((t) => ({
    x: t.urgencyScore,
    y: t.impactScore,
    name: t.title,
    priorityScore: t.priorityScore,
  }));

  const categoryData = ALL_CATEGORIES.map((cat) => ({
    category: cat,
    count: tasks.filter((t) => t.category === cat).length,
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Overview of all prioritized tasks and AI scoring insights
        </p>
      </div>

      <div className="flex flex-col gap-10">
        <TasksTable tasks={tasks} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ScatterPlot data={scatterData} />
          <CategoryBarChart data={categoryData} />
        </div>
      </div>
    </main>
  );
}
