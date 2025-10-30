import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import PlusIcon from '../../components/icons/PlusIcon';
import NewspaperIcon from '../../components/icons/NewspaperIcon';
import SparklesIcon from '../../components/icons/SparklesIcon';

const competitorsData = [
  {
    name: 'SalesSphere',
    logo: 'https://tailwindui.com/img/logos/mark.svg?color=red&shade=500',
    threat: 'High',
    strengths: ['Strong brand recognition', 'Large feature set'],
    weaknesses: ['Complex UI', 'High price point', 'Slow innovation'],
    news: 'SalesSphere announces acquisition of DataViz Inc.',
  },
  {
    name: 'Connectify',
    logo: 'https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500',
    threat: 'Medium',
    strengths: ['Excellent user experience', 'Strong SMB foothold'],
    weaknesses: ['Lacks enterprise features', 'Smaller support team'],
    news: 'Connectify raises $50M in Series C funding.',
  },
  {
    name: 'LeadGen Pro',
    logo: 'https://tailwindui.com/img/logos/mark.svg?color=green&shade=500',
    threat: 'Low',
    strengths: ['Niche focus on lead generation', 'Aggressive pricing'],
    weaknesses: ['No CRM capabilities', 'Poor integration options'],
    news: 'LeadGen Pro launches new prospecting tool.',
  },
];

const threatStyles = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800',
};

const CompetitorIntelligencePage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompetitor, setSelectedCompetitor] = useState(null);

    const openBattlecard = (competitor) => {
        setSelectedCompetitor(competitor);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800">Competitor Intelligence</h1>
                    <p className="text-slate-500 mt-1">Stay ahead of the market with AI-driven competitive insights.</p>
                </div>
                <Button leftIcon={<PlusIcon className="w-4 h-4" />}>
                    Add Competitor
                </Button>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {competitorsData.map((comp, index) => (
                    <div key={comp.name} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: `${100 + index * 100}ms` }}>
                        <div>
                            <div className="flex items-start justify-between">
                                <img src={comp.logo} alt={comp.name} className="h-10 w-10" />
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${threatStyles[comp.threat]}`}>
                                    {comp.threat} Threat
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-800 mt-4 text-lg">{comp.name}</h3>
                            <div className="mt-4 space-y-3 text-sm">
                                <div>
                                    <h4 className="font-semibold text-slate-600 mb-1">Strengths</h4>
                                    <ul className="list-disc list-inside text-slate-500">
                                        {comp.strengths.map(s => <li key={s}>{s}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-600 mb-1">Weaknesses</h4>
                                    <ul className="list-disc list-inside text-slate-500">
                                        {comp.weaknesses.map(w => <li key={w}>{w}</li>)}
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-3">
                                <NewspaperIcon className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-slate-500">{comp.news}</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Button variant="secondary" className="w-full" onClick={() => openBattlecard(comp)}>
                                View AI Battlecard
                            </Button>
                        </div>
                    </div>
                ))}
            </main>

            {selectedCompetitor && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <div className="p-2 max-w-2xl w-full">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={selectedCompetitor.logo} alt={selectedCompetitor.name} className="h-10 w-10" />
                            <h2 className="text-2xl font-bold text-slate-800">AI Battlecard: {selectedCompetitor.name}</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <AIBattlecardSection title="Differentiating Elevator Pitch">
                                Position us as the more intuitive and agile solution. Say: "While {selectedCompetitor.name} offers a broad platform, we focus on delivering a streamlined and powerful user experience that gets your team to value faster, without the complexity and high cost."
                            </AIBattlecardSection>
                            <AIBattlecardSection title="Objection Handling">
                                If they say "{selectedCompetitor.name} has more features," respond with: "That's a great point. Many of our customers switched from {selectedCompetitor.name} because they found they were paying for bloated features they never used. We focus on perfecting the tools you need most for core sales activities."
                            </AIBattlecardSection>
                             <AIBattlecardSection title="Key Winning Themes">
                                <ul className="list-disc list-inside space-y-1">
                                    <li><span className="font-semibold">Ease of Use:</span> Highlight our intuitive UI vs. their complex system.</li>
                                    <li><span className="font-semibold">Faster Time-to-Value:</span> Emphasize our quick onboarding and implementation.</li>
                                    <li><span className="font-semibold">Predictable Pricing:</span> Contrast our clear pricing with their notorious up-charges and hidden fees.</li>
                                </ul>
                            </AIBattlecardSection>
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-200 text-right">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

const AIBattlecardSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-indigo-50/70 border-l-4 border-indigo-300 p-4 rounded-r-lg">
        <h4 className="font-bold text-indigo-800 flex items-center gap-2 mb-2">
            <SparklesIcon className="w-5 h-5" />
            {title}
        </h4>
        <div className="text-sm text-indigo-900">{children}</div>
    </div>
);

export default CompetitorIntelligencePage;