'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { ScatterPlotTooltip } from './scatter-plot-tooltip';

interface ScatterPoint {
  x: number;
  y: number;
  name: string;
  priorityScore: number;
}

interface ScatterPlotProps {
  data: ScatterPoint[];
}

export function ScatterPlot({ data }: ScatterPlotProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold font-display text-gray-900 mb-1">
        Urgency × Impact
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        Task distribution across urgency and impact axes
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <ResponsiveContainer width="100%" height={340}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            >
              <Label
                value="Urgency Score"
                offset={-10}
                position="insideBottom"
                style={{ fontSize: 12, fill: '#6b7280' }}
              />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            >
              <Label
                value="Impact Score"
                angle={-90}
                position="insideLeft"
                offset={10}
                style={{ fontSize: 12, fill: '#6b7280' }}
              />
            </YAxis>
            <ReferenceLine
              x={5}
              stroke="#e2e8f0"
              strokeWidth={1.5}
              strokeDasharray="5 5"
            />
            <ReferenceLine
              y={5}
              stroke="#e2e8f0"
              strokeWidth={1.5}
              strokeDasharray="5 5"
            />
            <Tooltip
              content={<ScatterPlotTooltip />}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Scatter data={data} fill="#0e7490" fillOpacity={0.8} r={10} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
