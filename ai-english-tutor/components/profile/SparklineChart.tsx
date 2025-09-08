
import React from 'react';

interface SparklineChartProps {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}

const SparklineChart: React.FC<SparklineChartProps> = ({ values, width = 320, height = 60, color = '#0d9488' }) => {
  if (!values || values.length < 2) {
    return (
        <div style={{ height }} className="flex items-center justify-center text-sm text-slate-500">
            Not enough data yet.
        </div>
    );
  }

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1 || 1)) * (width - 8) + 4;
      const y = height - 4 - ((v - min) / range) * (height - 8);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="bg-white p-2 rounded-lg">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SparklineChart;
