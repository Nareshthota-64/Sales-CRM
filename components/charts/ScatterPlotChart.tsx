import React, { useState } from 'react';

interface ScatterData {
  name: string;
  conversionRate: number;
  closedARR: number;
  leads: number;
}

interface ScatterPlotChartProps {
  data: ScatterData[];
}

const ScatterPlotChart: React.FC<ScatterPlotChartProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<{ visible: boolean; content: React.ReactNode; x: number; y: number } | null>(null);

  const width = 600;
  const height = 288;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };

  const xMax = Math.max(...data.map(d => d.conversionRate)) * 1.1;
  const yMax = Math.max(...data.map(d => d.closedARR)) * 1.1;
  const sizeMax = Math.max(...data.map(d => d.leads));

  const xScale = (val: number) => padding.left + (val / xMax) * (width - padding.left - padding.right);
  const yScale = (val: number) => height - padding.bottom - (val / yMax) * (height - padding.top - padding.bottom);
  const sizeScale = (val: number) => 5 + (val / sizeMax) * 15;

  const avgX = data.reduce((sum, d) => sum + d.conversionRate, 0) / data.length;
  const avgY = data.reduce((sum, d) => sum + d.closedARR, 0) / data.length;
  
  const handleMouseOver = (e: React.MouseEvent, d: ScatterData) => {
    const content = (
        <div>
            <div className="font-bold text-white">{d.name}</div>
            <div className="text-xs text-slate-300">Conv. Rate: {d.conversionRate}%</div>
            <div className="text-xs text-slate-300">Closed ARR: ${d.closedARR}k</div>
            <div className="text-xs text-slate-300">Leads: {d.leads}</div>
        </div>
    );
    setTooltip({ visible: true, content, x: xScale(d.conversionRate), y: yScale(d.closedARR) });
  };

  const handleMouseOut = () => setTooltip(null);

  const quadrantStyles = [
    { bg: 'bg-red-50', label: 'Needs Coaching' },
    { bg: 'bg-yellow-50', label: 'Volume Players' },
    { bg: 'bg-blue-50', label: 'Efficient Closers' },
    { bg: 'bg-green-50', label: 'Top Stars' },
  ];

  return (
    <div className="relative w-full h-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Quadrant Backgrounds */}
        <rect x={padding.left} y={padding.top} width={xScale(avgX) - padding.left} height={yScale(avgY) - padding.top} className={quadrantStyles[1].bg} />
        <rect x={xScale(avgX)} y={padding.top} width={width - padding.right - xScale(avgX)} height={yScale(avgY) - padding.top} className={quadrantStyles[3].bg} />
        <rect x={padding.left} y={yScale(avgY)} width={xScale(avgX) - padding.left} height={height - padding.bottom - yScale(avgY)} className={quadrantStyles[0].bg} />
        <rect x={xScale(avgX)} y={yScale(avgY)} width={width - padding.right - xScale(avgX)} height={height - padding.bottom - yScale(avgY)} className={quadrantStyles[2].bg} />

        {/* Axes */}
        <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} className="stroke-slate-300" />
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} className="stroke-slate-300" />
        
        {/* Average Lines */}
        <line x1={xScale(avgX)} y1={padding.top} x2={xScale(avgX)} y2={height - padding.bottom} className="stroke-slate-400 stroke-dasharray-2" />
        <line x1={padding.left} y1={yScale(avgY)} x2={width - padding.right} y2={yScale(avgY)} className="stroke-slate-400 stroke-dasharray-2" />
        
        {/* Axis Labels */}
        <text x={(width - padding.left - padding.right) / 2 + padding.left} y={height - 5} textAnchor="middle" className="text-xs fill-slate-500 font-semibold">Conversion Rate (%)</text>
        <text x={padding.left - 35} y={(height - padding.top - padding.bottom) / 2 + padding.top} transform={`rotate(-90 ${padding.left - 35},${(height - padding.top - padding.bottom) / 2 + padding.top})`} textAnchor="middle" className="text-xs fill-slate-500 font-semibold">Closed ARR (k)</text>

        {/* Quadrant Labels */}
        <text x={xScale(avgX) + 10} y={padding.top + 15} className="text-xs font-bold fill-green-600">{quadrantStyles[3].label}</text>
        <text x={xScale(avgX) - 10} y={padding.top + 15} textAnchor="end" className="text-xs font-bold fill-yellow-600">{quadrantStyles[1].label}</text>
        <text x={xScale(avgX) + 10} y={height - padding.bottom - 10} className="text-xs font-bold fill-blue-600">{quadrantStyles[2].label}</text>
        <text x={xScale(avgX) - 10} y={height - padding.bottom - 10} textAnchor="end" className="text-xs font-bold fill-red-600">{quadrantStyles[0].label}</text>


        {/* Data Points */}
        {data.map((d, i) => (
          <circle
            key={d.name}
            cx={xScale(d.conversionRate)}
            cy={yScale(d.closedARR)}
            r={sizeScale(d.leads)}
            className="fill-indigo-500 opacity-70 hover:opacity-100 transition-opacity cursor-pointer bubble"
            onMouseOver={(e) => handleMouseOver(e, d)}
            onMouseOut={handleMouseOut}
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </svg>
      {tooltip?.visible && (
          <div
              className="absolute bg-slate-800 text-white text-xs p-2 rounded-md pointer-events-none shadow-lg"
              style={{
                  left: `${tooltip.x + 10}px`,
                  top: `${tooltip.y + 10}px`,
              }}
          >
              {tooltip.content}
          </div>
      )}
      <style>{`
        .bubble {
            animation: bubble-in 0.5s ease-out forwards;
            transform: scale(0);
        }
        @keyframes bubble-in {
            to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ScatterPlotChart;
