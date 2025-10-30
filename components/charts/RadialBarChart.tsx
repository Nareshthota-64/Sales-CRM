import React from 'react';

interface RadialData {
  name: string;
  value: number;
  color: string;
}

interface RadialBarChartProps {
  data: RadialData[];
}

const RadialBarChart: React.FC<RadialBarChartProps> = ({ data }) => {
  const size = 288;
  const strokeWidth = 20;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  
  const total = data.reduce((acc, item) => acc + item.value, 0);
  let accumulatedPercentage = 0;

  return (
    <div className="w-full h-full flex items-center justify-around">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const offset = (accumulatedPercentage / 100) * circumference;
            accumulatedPercentage += percentage;
            
            return (
              <circle
                key={item.name}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                className="radial-bar"
                style={{
                  strokeDashoffset: circumference - (percentage / 100) * circumference + offset,
                  animationDelay: `${index * 150}ms`,
                }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-800">{total}%</span>
            <span className="text-slate-500 font-medium">of Leads</span>
        </div>
      </div>
      <div className="space-y-3">
        {data.map(item => (
            <div key={item.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="font-semibold text-slate-700">{item.name}</span>
                <span className="text-slate-500">{item.value}%</span>
            </div>
        ))}
      </div>
      <style>{`
        .radial-bar {
            transition: stroke-dashoffset 1s ease-out;
            animation: radial-draw 1s ease-out forwards;
        }
        @keyframes radial-draw {
            from { stroke-dashoffset: ${circumference}; }
            to { /* handled by inline style */ }
        }
      `}</style>
    </div>
  );
};

export default RadialBarChart;
