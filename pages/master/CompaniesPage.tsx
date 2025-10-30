import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import SearchIcon from '../../components/icons/SearchIcon';
import BuildingsIcon from '../../components/icons/BuildingsIcon';
import DollarSignIcon from '../../components/icons/DollarSignIcon';
import ShieldCheckIcon from '../../components/icons/ShieldCheckIcon';
import ShieldAlertIcon from '../../components/icons/ShieldAlertIcon';
import TrendingDownIcon from '../../components/icons/TrendingDownIcon';
import MoreHorizontalIcon from '../../components/icons/MoreHorizontalIcon';

// Types
type AccountHealth = 'Healthy' | 'Needs Attention' | 'At Risk';
interface Company {
  id: string;
  name: string;
  logo: string;
  health: AccountHealth;
  arr: number;
  owner: { name: string; avatar: string; };
  activeDeals: number;
  lastActivity: string;
}

// Mock Data
const companiesData: Company[] = [
  { id: 'comp-1', name: 'Innovatech', logo: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600', health: 'Healthy', arr: 50000, owner: { name: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1' }, activeDeals: 2, lastActivity: '2 days ago' },
  { id: 'comp-2', name: 'Quantum Leap', logo: 'https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500', health: 'Healthy', arr: 120000, owner: { name: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1' }, activeDeals: 1, lastActivity: '5 days ago' },
  { id: 'comp-3', name: 'DataCorp', logo: 'https://tailwindui.com/img/logos/mark.svg?color=green&shade=500', health: 'Needs Attention', arr: 20000, owner: { name: 'Chloé Martin', avatar: 'https://i.pravatar.cc/150?img=3' }, activeDeals: 0, lastActivity: '14 days ago' },
  { id: 'comp-4', name: 'Synergy LLC', logo: 'https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500', health: 'At Risk', arr: 10000, owner: { name: 'Benoît Dubois', avatar: 'https://i.pravatar.cc/150?img=2' }, activeDeals: 1, lastActivity: '1 month ago' },
  { id: 'comp-5', name: 'NextGen AI', logo: 'https://tailwindui.com/img/logos/mark.svg?color=pink&shade=500', health: 'Healthy', arr: 35000, owner: { name: 'David Garcia', avatar: 'https://i.pravatar.cc/150?img=4' }, activeDeals: 3, lastActivity: '1 day ago' },
  { id: 'comp-6', name: 'Solutions Inc.', logo: 'https://tailwindui.com/img/logos/mark.svg?color=red&shade=500', health: 'Needs Attention', arr: 75000, owner: { name: 'David Garcia', avatar: 'https://i.pravatar.cc/150?img=4' }, activeDeals: 2, lastActivity: '7 days ago' },
];

const healthStyles: Record<AccountHealth, { icon: React.ReactNode; text: string; bg: string; }> = {
  Healthy: { icon: <ShieldCheckIcon className="w-4 h-4 text-green-700" />, text: 'text-green-700', bg: 'bg-green-100' },
  'Needs Attention': { icon: <ShieldAlertIcon className="w-4 h-4 text-yellow-700" />, text: 'text-yellow-700', bg: 'bg-yellow-100' },
  'At Risk': { icon: <ShieldAlertIcon className="w-4 h-4 text-red-700" />, text: 'text-red-700', bg: 'bg-red-100' },
};
const allHealths: AccountHealth[] = ['Healthy', 'Needs Attention', 'At Risk'];

// Components
const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string, delay: number }> = ({ title, value, icon, color, delay }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
        <div className="flex justify-between items-center">
            <p className="text-slate-500 font-medium">{title}</p>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
        </div>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
);

const MasterCompaniesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [healthFilter, setHealthFilter] = useState<AccountHealth | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Company | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = companiesData.filter(company =>
      (company.name.toLowerCase().includes(searchTerm.toLowerCase()) || company.owner.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (healthFilter === 'All' || company.health === healthFilter)
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, healthFilter, sortConfig]);
  
  const requestSort = (key: keyof Company) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-8">
      <header className="animate-fade-in">
        <h1 className="text-4xl font-bold text-slate-800">Company Management</h1>
        <p className="text-slate-500 mt-1">Holistic view of all company relationships and revenue streams.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title="Total Companies" value={companiesData.length.toString()} icon={<BuildingsIcon className="w-5 h-5 text-blue-600" />} color="bg-blue-100" delay={100} />
          <KpiCard title="Combined ARR" value={`$${(companiesData.reduce((acc, c) => acc + c.arr, 0) / 1000000).toFixed(1)}M`} icon={<DollarSignIcon className="w-5 h-5 text-green-600" />} color="bg-green-100" delay={200} />
          <KpiCard title="Accounts 'At Risk'" value={companiesData.filter(c => c.health === 'At Risk').length.toString()} icon={<TrendingDownIcon className="w-5 h-5 text-red-600" />} color="bg-red-100" delay={300} />
          <KpiCard title="Healthy Accounts" value={companiesData.filter(c => c.health === 'Healthy').length.toString()} icon={<ShieldCheckIcon className="w-5 h-5 text-indigo-600" />} color="bg-indigo-100" delay={400} />
      </section>

      <main className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '500ms' }}>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search company or owner..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-72 bg-slate-50 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-600">Health Status:</span>
            <select onChange={e => setHealthFilter(e.target.value as any)} value={healthFilter} className="bg-slate-50 border-none rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500">
              <option value="All">All Statuses</option>
              {allHealths.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('name')}>Company</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('health')}>Health</th>
                <th className="px-4 py-3 cursor-pointer text-right" onClick={() => requestSort('arr')}>Total ARR</th>
                <th className="px-4 py-3">BDE Owner</th>
                <th className="px-4 py-3 text-center cursor-pointer" onClick={() => requestSort('activeDeals')}>Active Deals</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('lastActivity')}>Last Activity</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCompanies.map((company, index) => (
                <tr key={company.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors animate-fade-in" style={{ animationDelay: `${index * 30}ms`}}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={company.logo} alt={company.name} className="w-8 h-8"/>
                      <span className="font-bold text-slate-800">{company.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${healthStyles[company.health].bg} ${healthStyles[company.health].text}`}>
                        {healthStyles[company.health].icon}
                        {company.health}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700 text-right">${company.arr.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={company.owner.avatar} alt={company.owner.name} className="w-7 h-7 rounded-full"/>
                      <span className="font-medium text-slate-600">{company.owner.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-700">{company.activeDeals}</td>
                  <td className="px-4 py-3 text-slate-500">{company.lastActivity}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
                      <MoreHorizontalIcon className="w-5 h-5" />
                    </button>
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

export default MasterCompaniesPage;
