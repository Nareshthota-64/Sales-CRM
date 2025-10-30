import React, { useMemo } from 'react';

interface ForecastData {
  name: string;
  actual: number | null;
  predicted: number | null;
  lowerBound?: number;
  upperBound?: number;
}

interface ForecastChartProps {
  data: ForecastData[];
}

const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  const width = 600;
  const height = 288;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };

  const { xScale, yScale, actualPath, predictedPath, confidenceAreaPath } = useMemo(() => {
    const allValues = data.flatMap(d => [d.actual, d.predicted, d.lowerBound, d.upperBound]).filter(v => v != null) as number[];
    const yMax = Math.max(...allValues) * 1.1;

    const xScale = (index: number) => padding.left + index * ((width - padding.left - padding.right) / (data.length - 1));
    const yScale = (value: number) => height - padding.bottom - (value / yMax) * (height - padding.top - padding.bottom);

    const actualData = data.filter(d => d.actual !== null);
    const actualPath = actualData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(data.indexOf(d))} ${yScale(d.actual!)}`).join(' ');

    const predictedData = data.filter(d => d.predicted !== null);
    // Find the last actual point to connect the predicted line smoothly
    const lastActualIndex = data.indexOf(actualData[actualData.length - 1]);
    const predictedPath = [
        `M ${xScale(lastActualIndex)} ${yScale(data[lastActualIndex].actual!)}`,
        ...predictedData.map((d, i) => `L ${xScale(data.indexOf(d))} ${yScale(d.predicted!)}`)
    ].join(' ');

    const confidenceData = data.filter(d => d.lowerBound != null && d.upperBound != null);
    const upperLine = confidenceData.map((d, i) => `L ${xScale(data.indexOf(d))} ${yScale(d.upperBound!)}`).join(' ');
    const lowerLine = [...confidenceData].reverse().map((d, i) => `L ${xScale(data.indexOf(d))} ${yScale(d.lowerBound!)}`).join(' ');
    
    const firstConfidencePoint = confidenceData[0];
    const confidenceAreaPath = `M ${xScale(data.indexOf(firstConfidencePoint))} ${yScale(firstConfidencePoint.lowerBound!)} ${upperLine} ${lowerLine} Z`;

    return { xScale, yScale, actualPath, predictedPath, confidenceAreaPath };
  }, [data]);

  return (
    <div className="w-full h-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Y-Axis Labels */}
        <text x={padding.left - 10} y={padding.top} textAnchor="end" className="text-xs fill-slate-500 font-semibold">${(Math.max(...data.map(d => d.actual || 0, d => d.predicted || 0)) / 1000).toFixed(0)}k</text>
        <text x={padding.left - 10} y={height - padding.bottom} textAnchor="end" className="text-xs fill-slate-500 font-semibold">$0</text>
        
        {/* Confidence Area */}
        <path d={confidenceAreaPath} fill="url(#confidenceGradient)" className="confidence-area" />

        {/* Lines */}
        <path d={actualPath} fill="none" stroke="#10B981" strokeWidth="2.5" className="line-path" />
        <path d={predictedPath} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeDasharray="5 5" className="line-path" style={{ animationDelay: '0.5s' }} />

        {/* Data Points */}
        {data.map((d, i) => (
          <g key={i}>
            {d.actual !== null && <circle cx={xScale(i)} cy={yScale(d.actual)} r="4" fill="#10B981" />}
            <text x={xScale(i)} y={height - 10} textAnchor="middle" className="text-xs fill-slate-500 font-semibold">{d.name}</text>
          </g>
        ))}

        <defs>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#A5B4FC" stopOpacity="0" />
            </linearGradient>
        </defs>
      </svg>
      <style>{`
        .line-path {
            stroke-dasharray: 2000;
            stroke-dashoffset: 2000;
            animation: draw-line 1.5s ease-out forwards;
        }
        .confidence-area {
            opacity: 0;
            animation: fade-in 1s 1s ease-out forwards;
        }
        @keyframes draw-line { to { stroke-dashoffset: 0; } }
        @keyframes fade-in { to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default ForecastChart;