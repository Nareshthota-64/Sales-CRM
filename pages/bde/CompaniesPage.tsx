import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PlusIcon from '../../components/icons/PlusIcon';
import SearchIcon from '../../components/icons/SearchIcon';
import ShieldCheckIcon from '../../components/icons/ShieldCheckIcon';
import ShieldAlertIcon from '../../components/icons/ShieldAlertIcon';
import DollarSignIcon from '../../components/icons/DollarSignIcon';

// Types
type AccountHealth = 'Healthy' | 'Needs Attention' | 'At Risk';

interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  health: AccountHealth;
  arr: number;
  conversionDate: string;
  lastActivity: string;
}

// Mock Data
const companiesData: Company[] = [
  { id: 'comp-1', name: 'Innovatech', logo: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600', description: 'Leading provider of enterprise SaaS solutions.', health: 'Healthy', arr: 50000, conversionDate: '2023-08-15', lastActivity: 'QBR scheduled for next week.' },
  { id: 'comp-2', name: 'Quantum Leap', logo: 'https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500', description: 'Pioneering quantum computing technologies.', health: 'Healthy', arr: 120000, conversionDate: '2023-06-20', lastActivity: 'Contract renewal signed.' },
  { id: 'comp-3', name: 'DataCorp', logo: 'https://tailwindui.com/img/logos/mark.svg?color=green&shade=500', description: 'Big data and analytics platform.', health: 'Needs Attention', arr: 20000, conversionDate: '2023-10-05', lastActivity: 'Low product usage last month.' },
  { id: 'comp-4', name: 'Synergy LLC', logo: 'https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500', description: 'Cloud consulting and integration services.', health: 'At Risk', arr: 10000, conversionDate: '2023-11-01', lastActivity: 'Support ticket escalated.' },
  { id: 'comp-5', name: 'NextGen AI', logo: 'https://tailwindui.com/img/logos/mark.svg?color=pink&shade=500', description: 'AI-driven automation tools.', health: 'Healthy', arr: 35000, conversionDate: '2023-09-12', lastActivity: 'Positive feedback on new feature.' },
  { id: 'comp-6', name: 'Solutions Inc.', logo: 'https://tailwindui.com/img/logos/mark.svg?color=red&shade=500', description: 'Custom software development agency.', health: 'Needs Attention', arr: 75000, conversionDate: '2023-07-22', lastActivity: 'Pending invoice for 30+ days.' },
];

// Style Mappings
const healthStyles: Record<AccountHealth, { icon: React.ReactNode; text: string; bg: string; }> = {
  Healthy: { icon: <ShieldCheckIcon className="w-4 h-4 text-green-700" />, text: 'text-green-700', bg: 'bg-green-100' },
  'Needs Attention': { icon: <ShieldAlertIcon className="w-4 h-4 text-yellow-700" />, text: 'text-yellow-700', bg: 'bg-yellow-100' },
  'At Risk': { icon: <ShieldAlertIcon className="w-4 h-4 text-red-700" />, text: 'text-red-700', bg: 'bg-red-100' },
};
const allHealths: AccountHealth[] = ['Healthy', 'Needs Attention', 'At Risk'];

// Components
const CompanyCard: React.FC<{ company: Company; index: number }> = ({ company, index }) => {
    const navigate = useNavigate();
    const healthStyle = healthStyles[company.health];

    return (
        <div 
            onClick={() => navigate(`/bde/companies/${company.id}`)}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <img src={company.logo} alt={`${company.name} logo`} className="w-12 h-12" />
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">{company.name}</h3>
                        <p className="text-sm text-slate-500 line-clamp-1">{company.description}</p>
                    </div>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${healthStyle.bg} ${healthStyle.text}`}>
                    {healthStyle.icon}
                    {company.health}
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <DollarSignIcon className="w-5 h-5 text-slate-400" />
                    <div>
                        <p className="text-sm text-slate-500">ARR</p>
                        <p className="font-semibold text-slate-800">${company.arr.toLocaleString()}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-500">Last Activity</p>
                    <p className="font-medium text-slate-700 text-sm">{company.lastActivity}</p>
                </div>
            </div>
        </div>
    );
};

const CompaniesPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [healthFilter, setHealthFilter] = useState<AccountHealth | 'All'>('All');

    const filteredCompanies = useMemo(() => {
        return companiesData.filter(company =>
            (company.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (healthFilter === 'All' || company.health === healthFilter)
        );
    }, [searchTerm, healthFilter]);

    return (
        <div className="space-y-8">
            <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800">My Companies</h1>
                    <p className="text-slate-500 mt-1">A portfolio of your converted leads and their current status.</p>
                </div>
                <button
                    onClick={() => navigate('/bde/leads/new')}
                    className="flex items-center gap-2 py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add New Lead
                </button>
            </header>

            <div className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="Search companies..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 bg-slate-50 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                 <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-600">Health:</span>
                    <select onChange={e => setHealthFilter(e.target.value as any)} value={healthFilter} className="bg-slate-50 border-none rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500">
                        <option value="All">All</option>
                        {allHealths.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
            </div>

            <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCompanies.map((company, index) => (
                    <CompanyCard key={company.id} company={company} index={index + 2} />
                ))}
                 {filteredCompanies.length === 0 && (
                    <div className="lg:col-span-2 text-center py-16">
                        <p className="font-semibold text-slate-600">No companies match your criteria.</p>
                        <p className="text-slate-500">Try adjusting your search or filters.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CompaniesPage;
