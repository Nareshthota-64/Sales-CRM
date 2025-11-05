import React, { useState, useMemo, useEffect } from 'react';
import DollarSignIcon from '../../components/icons/DollarSignIcon';
import LandmarkIcon from '../../components/icons/LandmarkIcon';
import AlertTriangleIcon from '../../components/icons/AlertTriangleIcon';

type PipelineStage = 'Qualification' | 'Needs Analysis' | 'Proposal' | 'Negotiation' | 'Closed Won';

interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  owner: { name: string; avatar: string; };
  stage: PipelineStage;
  closeDate: string;
  lastActivity: Date;
}

const initialDeals: Deal[] = [
  { id: 'deal-1', name: 'Innovatech Enterprise License', company: 'Innovatech', value: 50000, owner: { name: 'Amélie', avatar: 'https://i.pravatar.cc/150?img=1' }, stage: 'Negotiation', closeDate: '2024-07-30', lastActivity: new Date('2024-07-14') },
  { id: 'deal-2', name: 'Solutions Inc. Platform Deal', company: 'Solutions Inc.', value: 75000, owner: { name: 'David', avatar: 'https://i.pravatar.cc/150?img=4' }, stage: 'Proposal', closeDate: '2024-08-15', lastActivity: new Date('2024-07-10') },
  { id: 'deal-3', name: 'DataCorp Analytics Suite', company: 'DataCorp', value: 20000, owner: { name: 'Chloé', avatar: 'https://i.pravatar.cc/150?img=3' }, stage: 'Qualification', closeDate: '2024-08-20', lastActivity: new Date('2024-06-25') }, // Stalled
  { id: 'deal-4', name: 'NextGen AI Expansion', company: 'NextGen AI', value: 35000, owner: { name: 'David', avatar: 'https://i.pravatar.cc/150?img=4' }, stage: 'Needs Analysis', closeDate: '2024-09-01', lastActivity: new Date('2024-07-15') },
  { id: 'deal-5', name: 'Quantum Leap Q3 Project', company: 'Quantum Leap', value: 120000, owner: { name: 'Amélie', avatar: 'https://i.pravatar.cc/150?img=1' }, stage: 'Closed Won', closeDate: '2024-07-05', lastActivity: new Date('2024-07-05') },
  { id: 'deal-6', name: 'Synergy Consulting Retainer', company: 'Synergy LLC', value: 10000, owner: { name: 'Benoît', avatar: 'https://i.pravatar.cc/150?img=2' }, stage: 'Proposal', closeDate: '2024-07-28', lastActivity: new Date('2024-07-12') },
];

const STAGES: PipelineStage[] = ['Qualification', 'Needs Analysis', 'Proposal', 'Negotiation', 'Closed Won'];
const STALLED_THRESHOLD_DAYS = 14;

// Helper to format currency
const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}k`;

const DealCard: React.FC<{ deal: Deal; isStalled: boolean; onDragStart: (e: React.DragEvent, id: string) => void }> = ({ deal, isStalled, onDragStart }) => (
    <div 
        draggable 
        onDragStart={(e) => onDragStart(e, deal.id)}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-grab active:cursor-grabbing"
    >
        <div className="flex justify-between items-start">
            <p className="font-bold text-slate-800 text-sm">{deal.name}</p>
            {isStalled && (
                <div className="group relative">
                    <AlertTriangleIcon className="w-5 h-5 text-yellow-500" />
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-slate-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Stalled! No activity in {STALLED_THRESHOLD_DAYS}+ days.
                    </span>
                </div>
            )}
        </div>
        <p className="text-xs text-slate-500">{deal.company}</p>
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
            <span className="text-sm font-bold text-indigo-600">{formatCurrency(deal.value)}</span>
            <img src={deal.owner.avatar} alt={deal.owner.name} className="w-7 h-7 rounded-full border-2 border-white" />
        </div>
    </div>
);

const PipelineColumn: React.FC<{ stage: PipelineStage; deals: Deal[]; onDragOver: (e: React.DragEvent) => void; onDrop: (e: React.DragEvent, stage: PipelineStage) => void; onDragStart: (e: React.DragEvent, id: string) => void; }> = ({ stage, deals, onDragOver, onDrop, onDragStart }) => {
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const today = new Date();

    return (
        <div 
            className="bg-slate-50/70 rounded-xl p-4 w-72 flex-shrink-0"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, stage)}
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 text-sm">{stage}</h3>
                <span className="text-xs font-semibold text-slate-500">{deals.length} deals</span>
            </div>
            <div className="text-lg font-bold text-slate-800 mb-4">{formatCurrency(totalValue)}</div>
            <div className="space-y-4 h-[calc(100vh-22rem)] overflow-y-auto pr-2">
                {deals.map(deal => (
                    <DealCard 
                        key={deal.id} 
                        deal={deal} 
                        isStalled={(today.getTime() - deal.lastActivity.getTime()) / (1000 * 3600 * 24) > STALLED_THRESHOLD_DAYS}
                        onDragStart={onDragStart}
                    />
                ))}
            </div>
        </div>
    );
};

const PipelinePage: React.FC = () => {
    const [deals, setDeals] = useState<Deal[]>(initialDeals);

    const pipelineValue = useMemo(() => deals.filter(d => d.stage !== 'Closed Won').reduce((sum, d) => sum + d.value, 0), [deals]);
    const winRate = useMemo(() => {
        const closed = deals.filter(d => d.stage === 'Closed Won').length;
        return closed > 0 ? ((closed / deals.length) * 100).toFixed(1) : '0.0';
    }, [deals]);
    
    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData("dealId", id);
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
        e.preventDefault();
        const dealId = e.dataTransfer.getData("dealId");
        setDeals(prevDeals =>
            prevDeals.map(deal =>
                deal.id === dealId ? { ...deal, stage: targetStage, lastActivity: new Date() } : deal
            )
        );
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <header className="animate-fade-in mb-6">
                <h1 className="text-4xl font-bold text-slate-800">Sales Pipeline</h1>
                <p className="text-slate-500 mt-1">Visualize your sales process and identify bottlenecks.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-fade-in" style={{ animationDelay: '100ms'}}>
                <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100"><LandmarkIcon className="w-5 h-5 text-indigo-600"/></div>
                    <div>
                        <p className="text-sm text-slate-500">Pipeline Value</p>
                        <p className="text-xl font-bold text-slate-800">{formatCurrency(pipelineValue)}</p>
                    </div>
                </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100"><DollarSignIcon className="w-5 h-5 text-green-600"/></div>
                    <div>
                        <p className="text-sm text-slate-500">Overall Win Rate</p>
                        <p className="text-xl font-bold text-slate-800">{winRate}%</p>
                    </div>
                </div>
            </div>
            
            <main className="flex-1 flex gap-6 overflow-x-auto pb-4 animate-fade-in" style={{ animationDelay: '200ms'}}>
                {STAGES.map(stage => (
                    <PipelineColumn 
                        key={stage} 
                        stage={stage} 
                        deals={deals.filter(d => d.stage === stage)}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragStart={handleDragStart}
                    />
                ))}
            </main>
        </div>
    );
};




export default PipelinePage;