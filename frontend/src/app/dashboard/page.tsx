import { DashboardView } from '@/views/dashboard/components/dashboard-view';
import { Task } from '@/views/dashboard/types/task';

async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${process.env.API_URL}/tasks`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Failed to fetch tasks:', res.status, res.statusText);
    alert('Something went wrong, please try again.');
    return [];
  }

  const data: { tasks: Task[] } = await res.json();
  return data.tasks;
}

export default async function DashboardPage() {
  const tasks = await getTasks();

  return <DashboardView tasks={tasks} />;
}
