import React from 'react';
import ForecastChart from '../../components/charts/ForecastChart';
import Button from '../../components/ui/Button';
import ArrowUpIcon from '../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../components/icons/ArrowDownIcon';

// Mock Data
const forecastChartData = [
  { name: 'Q3 \'23', actual: 480, predicted: null },
  { name: 'Q4 \'23', actual: 510, predicted: null },
  { name: 'Q1 \'24', actual: 550, predicted: null },
  { name: 'Q2 \'24', actual: 580, predicted: 580, lowerBound: 580, upperBound: 580 },
  { name: 'Q3 \'24', actual: null, predicted: 620, lowerBound: 590, upperBound: 650 },
  { name: 'Q4 \'24', actual: null, predicted: 670, lowerBound: 630, upperBound: 710 },
  { name: 'Q1 \'25', actual: null, predicted: 710, lowerBound: 660, upperBound: 760 },
];

const kpiData = [
    { title: "Predicted Q3 Revenue", value: "$620k", subtitle: "vs. $580k in Q2 '24" },
    { title: "Likely-to-Close Pipeline", value: "$1.2M", subtitle: "Deals with >75% win probability" },
    { title: "Forecast Accuracy (Q2)", value: "97.5%", subtitle: "Predicted $595k vs. Actual $580k" },
];

const forecastDrivers = {
    positive: ["Increased webinar lead velocity", "Strong market demand in SaaS vertical", "Reduced sales cycle duration"],
    negative: ["Potential economic slowdown", "Increased competitor activity", "Lower-than-average pipeline coverage"]
};

const dealPredictions = [
    { name: 'Innovatech Enterprise License', value: 50000, probability: 92, owner: 'Amélie' },
    { name: 'Solutions Inc. Platform Deal', value: 75000, probability: 85, owner: 'David' },
    { name: 'NextGen AI Expansion', value: 35000, probability: 78, owner: 'David' },
    { name: 'Synergy Consulting Retainer', value: 10000, probability: 65, owner: 'Benoît' },
];

// Reusable Components
const KpiCard: React.FC<{ title: string; value: string; subtitle: string }> = ({ title, value, subtitle }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
        <p className="text-slate-500 font-medium">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
        <p className="text-sm text-slate-500 mt-2">{subtitle}</p>
    </div>
);

const DriverList: React.FC<{ title: string; items: string[]; type: 'positive' | 'negative' }> = ({ title, items, type }) => (
    <div className={type === 'positive' ? 'bg-green-50/70 p-4 rounded-lg' : 'bg-red-50/70 p-4 rounded-lg'}>
        <h4 className={`font-bold mb-2 flex items-center gap-2 ${type === 'positive' ? 'text-green-800' : 'text-red-800'}`}>
            {type === 'positive' ? <ArrowUpIcon className="w-5 h-5" /> : <ArrowDownIcon className="w-5 h-5" />}
            {title}
        </h4>
        <ul className="space-y-1 list-disc list-inside text-sm text-slate-700">
            {items.map(item => <li key={item}>{item}</li>)}
        </ul>
    </div>
);

const PredictiveAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Predictive Analytics</h1>
          <p className="text-slate-500 mt-1">AI-powered forecasting to anticipate future revenue and market trends.</p>
        </div>
        <Button variant="secondary">Adjust Forecast Model</Button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
        {kpiData.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h3 className="text-xl font-bold text-slate-800 mb-4">Quarterly Revenue Forecast (in thousands)</h3>
          <div className="flex gap-4 text-sm mb-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-sm" /><span>Actual Revenue</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-500 rounded-sm" /><span>Predicted Revenue</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-100 rounded-sm" /><span>Confidence Interval</span></div>
          </div>
          <div className="h-72">
            <ForecastChart data={forecastChartData} />
          </div>
        </main>

        <aside className="bg-white p-6 rounded-2xl shadow-sm space-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <h3 className="text-xl font-bold text-slate-800">Key Forecast Drivers</h3>
          <DriverList title="Positive Influences" items={forecastDrivers.positive} type="positive" />
          <DriverList title="Negative Influences" items={forecastDrivers.negative} type="negative" />
        </aside>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '400ms' }}>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Deal-Level Predictions</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                        <th className="px-4 py-3">Deal Name</th>
                        <th className="px-4 py-3">Value</th>
                        <th className="px-4 py-3">AI Win Probability</th>
                        <th className="px-4 py-3">Owner</th>
                    </tr>
                </thead>
                <tbody>
                    {dealPredictions.map((deal) => {
                        const probabilityColor = deal.probability > 80 ? 'text-green-600' : deal.probability > 60 ? 'text-yellow-600' : 'text-red-600';
                        return (
                             <tr key={deal.name} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-bold text-slate-800">{deal.name}</td>
                                <td className="px-4 py-3 font-semibold text-slate-700">${deal.value.toLocaleString()}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                                            <div className={`${probabilityColor.replace('text-', 'bg-')} h-2.5 rounded-full`} style={{ width: `${deal.probability}%` }}></div>
                                        </div>
                                        <span className={`font-bold ${probabilityColor}`}>{deal.probability}%</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-600">{deal.owner}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsPage;