'use client';

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Task } from '../../types/task';

interface TasksTableProps {
  tasks: Task[];
}

type SortKey = 'priorityScore' | 'impactScore' | 'urgencyScore';
type SortDir = 'asc' | 'desc' | null;

const CATEGORIES = ['all', 'bug', 'incident', 'feature', 'operational'];

const CATEGORY_COLORS: Record<string, string> = {
  bug: 'bg-red-100 text-red-700',
  incident: 'bg-orange-100 text-orange-700',
  feature: 'bg-cyan-100 text-cyan-700',
  operational: 'bg-gray-100 text-gray-700',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

function ScoreCell({ value }: { value: number }) {
  const color =
    value >= 8
      ? 'text-red-600 font-semibold'
      : value >= 5
        ? 'text-orange-500 font-semibold'
        : 'text-green-600 font-semibold';
  return <span className={color}>{value}</span>;
}

function SortIcon({
  column,
  sortKey,
  sortDir,
}: {
  column: SortKey;
  sortKey: SortKey | null;
  sortDir: SortDir;
}) {
  if (sortKey !== column)
    return <ChevronsUpDown size={14} className="text-gray-400" />;
  if (sortDir === 'asc')
    return <ChevronUp size={14} className="text-cyan-700" />;
  return <ChevronDown size={14} className="text-cyan-700" />;
}

export function TasksTable({ tasks }: TasksTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dayFilter, setDayFilter] = useState('all');

  const uniqueDays = useMemo(() => {
    const days = tasks.map((t) => formatDate(t.createdAt));
    return ['all', ...Array.from(new Set(days))];
  }, [tasks]);

  function handleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('desc');
    } else if (sortDir === 'desc') {
      setSortDir('asc');
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  }

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchCategory =
        categoryFilter === 'all' || t.category === categoryFilter;
      const matchDay =
        dayFilter === 'all' || formatDate(t.createdAt) === dayFilter;
      return matchCategory && matchDay;
    });
  }, [tasks, categoryFilter, dayFilter]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortDir === 'asc' ? diff : -diff;
    });
  }, [filtered, sortKey, sortDir]);

  const thBase =
    'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap';
  const thSortable = `${thBase} cursor-pointer select-none hover:text-cyan-700 transition-colors`;

  return (
    <section>
      <h2 className="text-lg font-semibold font-display text-gray-900 mb-4">
        Tasks
      </h2>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center px-5 py-4 border-b border-gray-100">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 outline-none focus:border-cyan-700 focus:ring-1 focus:ring-cyan-700 transition-colors bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'all'
                    ? 'All categories'
                    : c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Day</label>
            <select
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 outline-none focus:border-cyan-700 focus:ring-1 focus:ring-cyan-700 transition-colors bg-white"
            >
              {uniqueDays.map((d) => (
                <option key={d} value={d}>
                  {d === 'all' ? 'All days' : d}
                </option>
              ))}
            </select>
          </div>

          <span className="ml-auto text-xs text-gray-400 self-end pb-1">
            {sorted.length} task{sorted.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-180">
            <thead className="bg-gray-50">
              <tr>
                <th className={thBase}>Title</th>
                <th className={thBase}>Description</th>
                <th className={thBase}>Category</th>
                <th
                  className={thSortable}
                  onClick={() => handleSort('urgencyScore')}
                >
                  <span className="flex items-center gap-1">
                    Urgency
                    <SortIcon
                      column="urgencyScore"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </span>
                </th>
                <th
                  className={thSortable}
                  onClick={() => handleSort('impactScore')}
                >
                  <span className="flex items-center gap-1">
                    Impact
                    <SortIcon
                      column="impactScore"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </span>
                </th>
                <th
                  className={thSortable}
                  onClick={() => handleSort('priorityScore')}
                >
                  <span className="flex items-center gap-1">
                    Priority
                    <SortIcon
                      column="priorityScore"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </span>
                </th>
                <th className={thBase}>Created at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-gray-400"
                  >
                    No tasks found.
                  </td>
                </tr>
              ) : (
                sorted.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium max-w-40 truncate">
                      {task.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-50 truncate">
                      {task.description}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[task.category] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {task.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <ScoreCell value={task.urgencyScore} />
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <ScoreCell value={task.impactScore} />
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <ScoreCell value={task.priorityScore} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">
                      {formatDate(task.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
