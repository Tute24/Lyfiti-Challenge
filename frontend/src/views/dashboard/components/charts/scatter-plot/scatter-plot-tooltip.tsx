interface ScatterPoint {
  x: number;
  y: number;
  name: string;
  priorityScore: number;
}

export interface ScatterTooltipProps {
  active?: boolean;
  payload?: { payload: ScatterPoint }[];
}

export function ScatterPlotTooltip({ active, payload }: ScatterTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-md px-4 py-3 text-sm max-w-64">
      <p className="font-semibold text-gray-900 mb-1 wrap-break-word">
        {d.name}
      </p>
      <p className="text-gray-500">
        Urgency: <span className="font-medium text-gray-800">{d.x}</span>
      </p>
      <p className="text-gray-500">
        Impact: <span className="font-medium text-gray-800">{d.y}</span>
      </p>
      <p className="text-gray-500">
        Priority:{' '}
        <span className="font-medium text-cyan-700">{d.priorityScore}</span>
      </p>
    </div>
  );
}
