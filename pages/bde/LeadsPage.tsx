import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlusIcon from '../../components/icons/PlusIcon';
import SearchIcon from '../../components/icons/SearchIcon';
import FilterIcon from '../../components/icons/FilterIcon';
import ZapIcon from '../../components/icons/ZapIcon';
import FireIcon from '../../components/icons/FireIcon';
import TrendingUpIcon from '../../components/icons/TrendingUpIcon';
import ClockIcon from '../../components/icons/ClockIcon';
import FileDownIcon from '../../components/icons/FileDownIcon';
import MoreVerticalIcon from '../../components/icons/MoreVerticalIcon';
import EditIcon from '../../components/icons/EditIcon';
import UserPlusIcon from '../../components/icons/UserPlusIcon';
import StickyNoteIcon from '../../components/icons/StickyNoteIcon';
import TrashIcon from '../../components/icons/TrashIcon';

// Types
type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Unqualified' | 'Converted';
type AIScore = 'Hot' | 'Warm' | 'Cold';
type LeadSource = 'Webinar' | 'Cold Call' | 'Referral' | 'Website' | 'Advertisement';

interface Lead {
  id: string;
  name: string;
  company: string;
  companyLogo: string;
  status: LeadStatus;
  aiScore: AIScore;
  source: LeadSource;
  lastContact: string;
  assignedTo: string;
}

// Mock Data
const leadsData: Lead[] = [
  { id: 'lead-1', name: 'John Doe', company: 'Innovatech', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600', status: 'Qualified', aiScore: 'Hot', source: 'Webinar', lastContact: '2 hours ago', assignedTo: '1' },
  { id: 'lead-2', name: 'Jane Smith', company: 'Solutions Inc.', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=red&shade=500', status: 'New', aiScore: 'Hot', source: 'Referral', lastContact: '1 day ago', assignedTo: '2' },
  { id: 'lead-3', name: 'Sam Wilson', company: 'DataCorp', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=green&shade=500', status: 'Contacted', aiScore: 'Warm', source: 'Website', lastContact: '3 days ago', assignedTo: '1' },
  { id: 'lead-4', name: 'Patricia Williams', company: 'FutureGadget', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=yellow&shade=500', status: 'New', aiScore: 'Cold', source: 'Cold Call', lastContact: '1 week ago', assignedTo: '3' },
  { id: 'lead-5', name: 'Michael Brown', company: 'Synergy LLC', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500', status: 'Unqualified', aiScore: 'Cold', source: 'Advertisement', lastContact: '2 weeks ago', assignedTo: '2' },
  { id: 'lead-6', name: 'Linda Davis', company: 'Quantum Leap', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500', status: 'Converted', aiScore: 'Hot', source: 'Referral', lastContact: '1 month ago', assignedTo: '1' },
  { id: 'lead-7', name: 'James Miller', company: 'NextGen AI', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=pink&shade=500', status: 'Contacted', aiScore: 'Warm', source: 'Webinar', lastContact: '5 days ago', assignedTo: '3' },
];

const assigneeAvatars: { [key: string]: string } = {
  '1': 'https://i.pravatar.cc/150?img=1', '2': 'https://i.pravatar.cc/150?img=2',
  '3': 'https://i.pravatar.cc/150?img=3', '4': 'https://i.pravatar.cc/150?img=4',
};

// Style Mappings
const statusStyles: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-800',
  Contacted: 'bg-yellow-100 text-yellow-800',
  Qualified: 'bg-indigo-100 text-indigo-800',
  Unqualified: 'bg-slate-100 text-slate-800',
  Converted: 'bg-green-100 text-green-800',
};

const aiScoreStyles: Record<AIScore, string> = {
  Hot: 'bg-red-500',
  Warm: 'bg-yellow-500',
  Cold: 'bg-blue-500',
};

const allStatuses = ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'];
const allSources = ['Webinar', 'Cold Call', 'Referral', 'Website', 'Advertisement'];

// Components
const KpiCard: React.FC<{ title: string; value: string; change: string; icon: React.ReactNode; color: string, delay: number }> = ({ title, value, change, icon, color, delay }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-500 font-medium">{title}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                {icon}
            </div>
        </div>
        <p className={`text-sm font-semibold mt-4 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{change}</p>
    </div>
);

const ActionMenuItem: React.FC<{ icon: React.ReactNode; label: string; onClick: (e: React.MouseEvent) => void; className?: string; }> = ({ icon, label, onClick, className }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left text-slate-700 hover:bg-slate-100 transition-colors ${className}`}>
        {icon}
        <span>{label}</span>
    </button>
);


const LeadsPage: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>(leadsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');
    const [sourceFilter, setSourceFilter] = useState<LeadSource | 'All'>('All');
    const [isAiSortActive, setIsAiSortActive] = useState(false);
    const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
    const navigate = useNavigate();
    const actionMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setOpenActionMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredAndSortedLeads = useMemo(() => {
        let filtered = leads.filter(lead =>
            (lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || lead.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === 'All' || lead.status === statusFilter) &&
            (sourceFilter === 'All' || lead.source === sourceFilter)
        );

        if (isAiSortActive) {
            const scoreOrder: Record<AIScore, number> = { Hot: 1, Warm: 2, Cold: 3 };
            filtered.sort((a, b) => scoreOrder[a.aiScore] - scoreOrder[b.aiScore]);
        }
        
        return filtered;
    }, [leads, searchTerm, statusFilter, sourceFilter, isAiSortActive]);

    return (
        <div className="space-y-8">
            <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800">Lead Management</h1>
                    <p className="text-slate-500 mt-1">Harness AI to discover, qualify, and convert your next big opportunity.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 py-2 px-4 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
                        <FileDownIcon className="w-4 h-4" />
                        Import Leads
                    </button>
                    <button
                        onClick={() => navigate('/bde/leads/new')}
                        className="flex items-center gap-2 py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add New Lead
                    </button>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="New Leads" value="42" change="+15% this week" icon={<ZapIcon className="w-5 h-5 text-indigo-600" />} color="bg-indigo-100" delay={100} />
                <KpiCard title="Hot Leads (AI)" value="12" change="+3 since yesterday" icon={<FireIcon className="w-5 h-5 text-red-600" />} color="bg-red-100" delay={200} />
                <KpiCard title="Conversion Rate" value="24.5%" change="-1.2% this month" icon={<TrendingUpIcon className="w-5 h-5 text-green-600" />} color="bg-green-100" delay={300} />
                <KpiCard title="Avg. Response" value="3.2h" change="+0.5h from last week" icon={<ClockIcon className="w-5 h-5 text-yellow-600" />} color="bg-yellow-100" delay={400} />
            </section>

            <main className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '500ms' }}>
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="text" placeholder="Search leads..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 bg-slate-50 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <select onChange={e => setStatusFilter(e.target.value as any)} value={statusFilter} className="bg-slate-50 border-none rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500">
                            <option value="All">All Statuses</option>
                            {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select onChange={e => setSourceFilter(e.target.value as any)} value={sourceFilter} className="bg-slate-50 border-none rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500">
                             <option value="All">All Sources</option>
                            {allSources.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                     <button onClick={() => setIsAiSortActive(!isAiSortActive)} className={`flex items-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${isAiSortActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        <ZapIcon className={`w-5 h-5 transition-colors ${isAiSortActive ? 'text-yellow-300' : 'text-indigo-500'}`} />
                        AI Smart Sort
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Lead Name</th>
                                <th className="px-4 py-3">AI Score</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Source</th>
                                <th className="px-4 py-3">Last Contact</th>
                                <th className="px-4 py-3">Assigned To</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedLeads.map((lead, index) => (
                                <tr 
                                    key={lead.id} 
                                    onClick={() => navigate(`/bde/leads/${lead.id}`)}
                                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer animate-fade-in" 
                                    style={{ animationDelay: `${index * 30}ms`}}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={lead.companyLogo} alt={lead.company} className="w-8 h-8"/>
                                            <div>
                                                <p className="font-bold text-slate-800">{lead.name}</p>
                                                <p className="text-slate-500">{lead.company}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${aiScoreStyles[lead.aiScore]}`}></span>
                                            <span className="font-semibold text-slate-700">{lead.aiScore}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[lead.status]}`}>{lead.status}</span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-600">{lead.source}</td>
                                    <td className="px-4 py-3 text-slate-500">{lead.lastContact}</td>
                                    <td className="px-4 py-3">
                                        <img src={assigneeAvatars[lead.assignedTo]} alt="assignee" className="w-8 h-8 rounded-full border-2 border-white shadow-sm"/>
                                    </td>
                                    <td className="px-4 py-3 text-right relative">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenActionMenu(openActionMenu === lead.id ? null : lead.id);
                                            }}
                                            className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors"
                                        >
                                            <MoreVerticalIcon className="w-5 h-5" />
                                        </button>
                                        {openActionMenu === lead.id && (
                                            <div ref={actionMenuRef} className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-10 animate-fade-in" style={{ animationDuration: '0.15s'}}>
                                                <div className="p-1">
                                                     <ActionMenuItem icon={<EditIcon className="w-4 h-4" />} label="Change Status" onClick={(e) => e.stopPropagation()} />
                                                     <ActionMenuItem icon={<UserPlusIcon className="w-4 h-4" />} label="Re-assign" onClick={(e) => e.stopPropagation()} />
                                                     <ActionMenuItem icon={<StickyNoteIcon className="w-4 h-4" />} label="Log Interaction" onClick={(e) => e.stopPropagation()} />
                                                     <hr className="my-1 border-slate-100" />
                                                     <ActionMenuItem icon={<TrashIcon className="w-4 h-4" />} label="Delete Lead" onClick={(e) => e.stopPropagation()} className="!text-red-600 hover:!bg-red-50" />
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default LeadsPage;