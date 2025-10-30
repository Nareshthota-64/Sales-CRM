import React from 'react';
import GaugeChart from '../../components/charts/GaugeChart';
import BotIcon from '../../components/icons/BotIcon';
import LightbulbIcon from '../../components/icons/LightbulbIcon';
import CheckCheckIcon from '../../components/icons/CheckCheckIcon';
import ZapIcon from '../../components/icons/ZapIcon';

const performanceData = [
    { value: 92, label: 'Lead Score Accuracy', color: 'green' },
    { value: 85, label: 'Conversion Prediction', color: 'indigo' },
    { value: 78, label: 'Email Generation Efficacy', color: 'yellow' },
];

const featureImportance = [
    { feature: 'Website Activity', importance: 88, color: 'bg-indigo-500' },
    { feature: 'Company Size', importance: 82, color: 'bg-indigo-400' },
    { feature: 'Job Title Match', importance: 75, color: 'bg-indigo-400' },
    { feature: 'Email Engagement', importance: 68, color: 'bg-indigo-300' },
    { feature: 'Industry Vertical', importance: 61, color: 'bg-indigo-300' },
    { feature: 'Past Interactions', importance: 55, color: 'bg-indigo-200' },
];

const aiActionFeed = [
    { icon: <ZapIcon className="w-5 h-5 text-green-600" />, text: 'Identified 5 new "Hot" leads based on recent market signals.', time: '2m ago' },
    { icon: <LightbulbIcon className="w-5 h-5 text-yellow-600" />, text: 'Suggested a new email template for the SaaS industry, increasing open rates by 12%.', time: '1h ago' },
    { icon: <CheckCheckIcon className="w-5 h-5 text-blue-600" />, text: 'Auto-qualified 28 inbound leads from the marketing campaign.', time: '4h ago' },
    { icon: <BotIcon className="w-5 h-5 text-slate-500" />, text: 'Model re-trained with Q2 data. Accuracy improved by 2.1%.', time: '1d ago' },
];

const InsightCard: React.FC<{ children: React.ReactNode; title: string; className?: string; delay: number }> = ({ children, title, className, delay }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm animate-fade-in ${className}`} style={{ animationDelay: `${delay}ms`}}>
        <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
        {children}
    </div>
);

const AiInsightsPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <header className="animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">AI Insights</h1>
                <p className="text-slate-500 mt-1">Understand how the BDE AI is performing and driving results.</p>
            </header>

            <InsightCard title="AI Model Performance" delay={100}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {performanceData.map(item => <GaugeChart key={item.label} {...item} />)}
                </div>
            </InsightCard>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <InsightCard title="Lead Score Feature Importance" className="lg:col-span-2" delay={200}>
                    <div className="space-y-3">
                        {featureImportance.map(item => (
                            <div key={item.feature} className="flex items-center gap-4">
                                <p className="w-40 text-sm font-semibold text-slate-600 text-right">{item.feature}</p>
                                <div className="flex-1 bg-slate-100 rounded-full h-6">
                                    <div 
                                        className={`${item.color} h-6 rounded-full flex items-center justify-end px-2 text-white text-xs font-bold`}
                                        style={{ width: `${item.importance}%`, animation: 'bar-grow 1s ease-out forwards' }}
                                    >
                                        {item.importance}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </InsightCard>

                <InsightCard title="AI-Driven Action Feed" delay={300}>
                    <div className="space-y-4">
                        {aiActionFeed.map((item, index) => (
                            <div key={index} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                                <div className="mt-1">{item.icon}</div>
                                <div>
                                    <p className="text-sm text-slate-700">{item.text}</p>
                                    <p className="text-xs text-slate-400">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </InsightCard>
            </div>
            <style>{`
                @keyframes bar-grow {
                    from { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default AiInsightsPage;