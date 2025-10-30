import React, { useState } from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface BarChartProps {
  data: ChartData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<{ visible: boolean; content: string; x: number; y: number }>({
    visible: false,
    content: '',
    x: 0,
    y: 0,
  });

  const chartHeight = 288;
  const chartWidth = 600; // Assuming a fixed width for simplicity
  const barPadding = 15;
  const barWidth = (chartWidth / data.length) - barPadding;
  const maxValue = Math.max(...data.map(d => d.value));

  const handleMouseOver = (e: React.MouseEvent, item: ChartData) => {
    const rect = (e.target as SVGRectElement).getBoundingClientRect();
    setTooltip({
      visible: true,
      content: `$${item.value.toLocaleString()}`,
      x: rect.left + window.scrollX + rect.width / 2,
      y: rect.top + window.scrollY - 10,
    });
  };

  const handleMouseOut = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  return (
    <div className="relative w-full h-full">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <g className="chart-bars">
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * (chartHeight - 30); // Leave space for labels
            const x = index * (barWidth + barPadding);
            const y = chartHeight - barHeight - 20; // Position from bottom

            return (
              <g key={item.label}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  className="fill-indigo-300 hover:fill-indigo-500 transition-colors duration-200"
                  rx="4"
                  ry="4"
                  onMouseOver={(e) => handleMouseOver(e, item)}
                  onMouseOut={handleMouseOut}
                  style={{
                    animation: `bar-up 0.5s ${index * 0.05}s ease-out backwards`,
                    transformOrigin: `bottom`,
                  }}
                />
                <text x={x + barWidth / 2} y={chartHeight - 5} textAnchor="middle" className="text-xs font-semibold fill-slate-500">
                  {item.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      {tooltip.visible && (
        <div
          className="absolute bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded-md pointer-events-none transition-opacity duration-200"
          style={{
            transform: 'translate(-50%, -100%)',
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          {tooltip.content}
        </div>
      )}
      <style>{`
        @keyframes bar-up {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};

export default BarChart;
