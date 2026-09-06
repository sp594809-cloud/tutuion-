import React from 'react';

export const BarChart = ({ labels = [], values = [] }: { labels: string[]; values: number[] }) => {
  const max = Math.max(...values, 100);
  const width = Math.max(600, labels.length * 80);
  const height = 300;
  const barWidth = Math.floor(width / labels.length) - 12;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ border: '1px solid #eee', background: '#fff' }}>
      <g transform={`translate(0,0)` }>
        {values.map((v, i) => {
          const x = 12 + i * (barWidth + 12);
          const h = (v / max) * (height - 60);
          const y = height - 40 - h;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={h} fill="#1f4a43" rx={4} />
              <text x={x + barWidth / 2} y={y - 6} fontSize={12} textAnchor="middle">{v}</text>
              <text x={x + barWidth / 2} y={height - 18} fontSize={12} textAnchor="middle">{labels[i]}</text>
            </g>
          );
        })}
        <line x1={0} x2={width} y1={height - 40} y2={height - 40} stroke="#ccc" />
      </g>
    </svg>
  );
};
