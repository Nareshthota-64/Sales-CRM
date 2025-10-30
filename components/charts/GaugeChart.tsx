import React, { useState, useEffect } from 'react';

interface GaugeChartProps {
  value: number;
  label: string;
  color: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, label, color }) => {
  const [offset, setOffset] = useState(0);
  const size = 180;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((100 - value) / 100) * circumference;
    setOffset(progressOffset);
  }, [value, circumference, offset]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size / 2 }}>
        <svg className="w-full h-full" viewBox={`0 0 ${size} ${size / 2}`}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={`var(--color-${color}-300)`} />
              <stop offset="100%" stopColor={`var(--color-${color}-500)`} />
            </linearGradient>
          </defs>
          <circle
            className="text-slate-200"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{ strokeDasharray: circumference, strokeDashoffset: 0 }}
          />
          <circle
            stroke={`url(#gradient-${color})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transform: 'rotate(180deg)',
              transformOrigin: '50% 50%',
              transition: 'stroke-dashoffset 1.5s ease-out',
            }}
          />
        </svg>
        <div className="absolute bottom-0 w-full text-center">
          <span className={`text-4xl font-bold text-${color}-600`}>{value}%</span>
        </div>
      </div>
      <p className="font-semibold text-slate-600">{label}</p>
      <style>{`:root { --color-green-300: #6EE7B7; --color-green-500: #10B981; --color-indigo-300: #A5B4FC; --color-indigo-500: #6366F1; --color-yellow-300: #FCD34D; --color-yellow-500: #F59E0B; }`}</style>
    </div>
  );
};

export default GaugeChart;