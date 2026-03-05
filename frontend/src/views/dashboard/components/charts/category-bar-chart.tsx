'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface CategoryBarChartProps {
  data: { category: string; count: number }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  bug: '#dc2626',
  incident: '#f59e0b',
  feature: '#0e7490',
  operational: '#6b7280',
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; payload: { category: string } }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { value, payload: inner } = payload[0];
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-md px-4 py-3 text-sm">
      <p className="font-semibold text-gray-900 capitalize mb-1">
        {inner.category}
      </p>
      <p className="text-gray-500">
        Tasks: <span className="font-medium text-gray-800">{value}</span>
      </p>
    </div>
  );
}

export function CategoryBarChart({ data }: CategoryBarChartProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold font-display text-gray-900 mb-4">
        Tasks by Category
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        Total number of tasks per category
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, bottom: 5, left: 0 }}
            barSize={40}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 13, fill: '#6b7280' }}
              tickFormatter={(v: string) =>
                v.charAt(0).toUpperCase() + v.slice(1)
              }
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLORS[entry.category] ?? '#9ca3af'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {data.map((entry) => (
            <div key={entry.category} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: CATEGORY_COLORS[entry.category] ?? '#9ca3af',
                }}
              />
              <span className="text-xs text-gray-500 capitalize">
                {entry.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
