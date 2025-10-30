import React from 'react';

interface BarLineData {
  name: string;
  monthly: number;
  cumulative: number;
}

interface BarLineChartProps {
  data: BarLineData[];
}

const BarLineChart: React.FC<BarLineChartProps> = ({ data }) => {
  const width = 600;
  const height = 288;
  const padding = { top: 20, right: 40, bottom: 30, left: 40 };

  const yMaxBar = Math.max(...data.map(d => d.monthly)) * 1.1;
  const yMaxLine = Math.max(...data.map(d => d.cumulative)) * 1.1;

  const xScale = (index: number) => padding.left + index * ((width - padding.left - padding.right) / (data.length));
  const yScaleBar = (val: number) => height - padding.bottom - (val / yMaxBar) * (height - padding.top - padding.bottom);
  const yScaleLine = (val: number) => height - padding.bottom - (val / yMaxLine) * (height - padding.top - padding.bottom);

  const barWidth = ((width - padding.left - padding.right) / data.length) * 0.6;
  
  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i) + barWidth / 2} ${yScaleLine(d.cumulative)}`)
    .join(' ');

  return (
    <div className="w-full h-full relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Y-axis for Bars */}
        <text x={padding.left-10} y={padding.top} textAnchor="end" className="text-xs fill-slate-500 font-semibold">${(yMaxBar / 1000).toFixed(0)}k</text>
        <text x={padding.left-10} y={height - padding.bottom} textAnchor="end" className="text-xs fill-slate-500 font-semibold">$0</text>
        
        {/* Y-axis for Line */}
        <text x={width - padding.right + 10} y={padding.top} className="text-xs fill-slate-500 font-semibold">${(yMaxLine / 1000).toFixed(0)}k</text>
        <text x={width - padding.right + 10} y={height - padding.bottom} className="text-xs fill-slate-500 font-semibold">$0</text>

        {/* Bars and Labels */}
        {data.map((d, i) => (
          <g key={d.name}>
            <rect
              x={xScale(i)}
              y={yScaleBar(d.monthly)}
              width={barWidth}
              height={height - padding.bottom - yScaleBar(d.monthly)}
              className="fill-indigo-200 bar-rect"
              rx="2"
              style={{ animationDelay: `${i * 100}ms` }}
            />
            <text x={xScale(i) + barWidth / 2} y={height - 15} textAnchor="middle" className="text-xs fill-slate-500 font-semibold">
              {d.name}
            </text>
          </g>
        ))}

        {/* Line */}
        <path d={linePath} fill="none" stroke="#4F46E5" strokeWidth="2.5" className="line-path" />
        
      </svg>
      <style>{`
        .bar-rect {
          animation: bar-up 0.5s ease-out forwards;
          transform-origin: bottom;
          transform: scaleY(0);
        }
        .line-path {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: draw-line 1.5s 0.5s ease-out forwards;
        }
        @keyframes bar-up { to { transform: scaleY(1); } }
        @keyframes draw-line { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
};

export default BarLineChart;
