export interface Task {
  id: string;
  title: string;
  description: string;
  urgencyScore: number;
  impactScore: number;
  priorityScore: number;
  category: string;
  createdAt: string;
}
