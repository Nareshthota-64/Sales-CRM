import React from 'react';

interface RadarData {
  label: string;
  individual: number;
  average: number;
}

interface RadarChartProps {
  data: RadarData[];
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const size = 288;
  const center = size / 2;
  const numAxes = data.length;
  const angleSlice = (Math.PI * 2) / numAxes;

  const getPoint = (value: number, index: number): { x: number; y: number } => {
    const angle = angleSlice * index - Math.PI / 2;
    const radius = (value / 100) * (center * 0.8);
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const axisPoints = data.map((_, i) => getPoint(100, i));
  const individualPoints = data.map((d, i) => getPoint(d.individual, i));
  const averagePoints = data.map((d, i) => getPoint(d.average, i));

  const individualPath = individualPoints.map(p => `${p.x},${p.y}`).join(' ');
  const averagePath = averagePoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox={`0 0 ${size} ${size}`}>
        {/* Grid lines */}
        {[25, 50, 75, 100].map(val => (
          <circle
            key={val}
            cx={center}
            cy={center}
            r={(val / 100) * (center * 0.8)}
            className="fill-none stroke-slate-200"
            strokeWidth="1"
          />
        ))}

        {/* Axes and Labels */}
        {axisPoints.map((point, i) => (
          <g key={i}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} className="stroke-slate-200" />
            <text
              x={point.x + (point.x - center) * 0.1}
              y={point.y + (point.y - center) * 0.1}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] fill-slate-500 font-semibold"
            >
              {data[i].label}
            </text>
          </g>
        ))}

        {/* Data Polygons */}
        <polygon points={averagePath} className="fill-slate-300/50 stroke-slate-400 stroke-2 radar-polygon" />
        <polygon points={individualPath} className="fill-indigo-400/50 stroke-indigo-600 stroke-2 radar-polygon" style={{ animationDelay: '0.2s' }} />
      </svg>
      <style>{`
        .radar-polygon {
          animation: radar-in 0.8s ease-out forwards;
          transform-origin: ${center}px ${center}px;
          transform: scale(0);
        }
        @keyframes radar-in {
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default RadarChart;