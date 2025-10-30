import React, { useState, useMemo } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import SearchIcon from '../../components/icons/SearchIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import MoreHorizontalIcon from '../../components/icons/MoreHorizontalIcon';
import UsersIcon from '../../components/icons/UsersIcon';
import UserCheckIcon from '../../components/icons/UserCheckIcon';
import AwardIcon from '../../components/icons/AwardIcon';
import TrendingDownIcon from '../../components/icons/TrendingDownIcon';
import ChevronUpIcon from '../../components/icons/ChevronUpIcon';
import MailIcon from '../../components/icons/MailIcon';
import UserIcon from '../../components/icons/UserIcon';

// Types
type UserStatus = 'Active' | 'Inactive';
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'BDE' | 'Admin';
  status: UserStatus;
  leads: number;
  conversionRate: number;
  closedARR: number;
}

// Mock Data
const usersData: User[] = [
  { id: 'usr-1', name: 'Amélie Laurent', email: 'amelie@example.com', avatar: 'https://i.pravatar.cc/150?img=1', role: 'BDE', status: 'Active', leads: 125, conversionRate: 22, closedARR: 120500 },
  { id: 'usr-2', name: 'Benoît Dubois', email: 'benoit@example.com', avatar: 'https://i.pravatar.cc/150?img=2', role: 'BDE', status: 'Active', leads: 98, conversionRate: 18, closedARR: 85000 },
  { id: 'usr-3', name: 'Chloé Martin', email: 'chloe@example.com', avatar: 'https://i.pravatar.cc/150?img=3', role: 'BDE', status: 'Active', leads: 150, conversionRate: 25, closedARR: 152000 },
  { id: 'usr-4', name: 'David Garcia', email: 'david@example.com', avatar: 'https://i.pravatar.cc/150?img=4', role: 'BDE', status: 'Inactive', leads: 45, conversionRate: 15, closedARR: 35000 },
  { id: 'usr-5', name: 'Elise Moreau', email: 'elise@example.com', avatar: 'https://i.pravatar.cc/150?img=5', role: 'BDE', status: 'Active', leads: 82, conversionRate: 12, closedARR: 62000 },
  { id: 'usr-6', name: 'François Lambert', email: 'francois@example.com', avatar: 'https://i.pravatar.cc/150?img=6', role: 'Admin', status: 'Active', leads: 0, conversionRate: 0, closedARR: 0 },
];

const statusStyles: Record<UserStatus, string> = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-slate-100 text-slate-800',
};

// Components
const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; delay: number; data?: React.ReactNode; }> = ({ title, value, icon, color, delay, data }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
        <div className="flex justify-between items-center">
            <p className="text-slate-500 font-medium">{title}</p>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
        </div>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
        {data && <div className="mt-4">{data}</div>}
    </div>
);

const MasterUsersPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<UserStatus | 'All'>('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof User | null; direction: 'asc' | 'desc' }>({ key: 'closedARR', direction: 'desc' });
    const [isInviteModalOpen, setInviteModalOpen] = useState(false);

    const topPerformer = useMemo(() => usersData.reduce((prev, current) => (prev.closedARR > current.closedARR) ? prev : current), [usersData]);
    const needsCoaching = useMemo(() => usersData.filter(u => u.role === 'BDE').reduce((prev, current) => (prev.conversionRate < current.conversionRate) ? prev : current), [usersData]);

    const filteredAndSortedUsers = useMemo(() => {
        let filtered = usersData.filter(user =>
            (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === 'All' || user.status === statusFilter)
        );

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key!] < b[sortConfig.key!]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key!] > b[sortConfig.key!]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [searchTerm, statusFilter, sortConfig]);

    const requestSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof User) => {
        if (sortConfig.key !== key) return null;
        return <ChevronUpIcon className={`w-4 h-4 ml-1 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />;
    };

    return (
        <div className="space-y-8">
            <header className="animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">User Management</h1>
                <p className="text-slate-500 mt-1">Administer your team and monitor their performance.</p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Users" value={usersData.length.toString()} icon={<UsersIcon className="w-5 h-5 text-blue-600" />} color="bg-blue-100" delay={100} />
                <KpiCard title="Active Users" value={usersData.filter(u => u.status === 'Active').length.toString()} icon={<UserCheckIcon className="w-5 h-5 text-green-600" />} color="bg-green-100" delay={200} />
                <KpiCard 
                    title="Top Performer" 
                    value={topPerformer.name.split(' ')[0]} 
                    icon={<AwardIcon className="w-5 h-5 text-yellow-600" />} 
                    color="bg-yellow-100" 
                    delay={300}
                    data={<p className="text-sm font-semibold text-slate-600">${topPerformer.closedARR.toLocaleString()} Closed ARR</p>}
                />
                 <KpiCard 
                    title="Needs Coaching" 
                    value={needsCoaching.name.split(' ')[0]} 
                    icon={<TrendingDownIcon className="w-5 h-5 text-red-600" />} 
                    color="bg-red-100" 
                    delay={400}
                    data={<p className="text-sm font-semibold text-slate-600">{needsCoaching.conversionRate}% Conversion Rate</p>}
                />
            </section>

            <main className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '500ms' }}>
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="text" placeholder="Search user..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 bg-slate-50 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <select onChange={e => setStatusFilter(e.target.value as any)} value={statusFilter} className="bg-slate-50 border-none rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500">
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <Button onClick={() => setInviteModalOpen(true)} leftIcon={<PlusIcon className="w-4 h-4" />}>Invite User</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('name')}>User</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 cursor-pointer flex items-center" onClick={() => requestSort('leads')}>Leads {getSortIndicator('leads')}</th>
                                <th className="px-4 py-3 cursor-pointer flex items-center" onClick={() => requestSort('conversionRate')}>Conv. Rate {getSortIndicator('conversionRate')}</th>
                                <th className="px-4 py-3 cursor-pointer flex items-center" onClick={() => requestSort('closedARR')}>Closed ARR {getSortIndicator('closedARR')}</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedUsers.map((user, index) => (
                                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors animate-fade-in" style={{ animationDelay: `${index * 30}ms`}}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full"/>
                                            <div>
                                                <p className="font-bold text-slate-800">{user.name}</p>
                                                <p className="text-slate-500 text-xs">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-600">{user.role}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[user.status]}`}>{user.status}</span>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">{user.leads}</td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">{user.conversionRate}%</td>
                                    <td className="px-4 py-3 font-bold text-indigo-600">${user.closedARR.toLocaleString()}</td>
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
            
            <Modal isOpen={isInviteModalOpen} onClose={() => setInviteModalOpen(false)}>
                <div className="p-2">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Invite New User</h2>
                    <p className="text-slate-500 mb-6">Enter the details below to send an invitation.</p>
                    <form className="space-y-5">
                        <Input label="Full Name" id="invite-name" type="text" placeholder="John Doe" icon={<UserIcon className="w-5 h-5 text-gray-400" />} />
                        <Input label="Email Address" id="invite-email" type="email" placeholder="john.doe@company.com" icon={<MailIcon className="w-5 h-5 text-gray-400" />} />
                        <div>
                             <label htmlFor="role" className="block text-sm font-medium text-gray-500 mb-2">Role</label>
                             <select id="role" className="w-full py-4 px-6 bg-gray-100/60 rounded-full text-gray-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all duration-300">
                                <option>Business Development Executive (BDE)</option>
                                <option>Admin</option>
                             </select>
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <Button type="button" variant="secondary" onClick={() => setInviteModalOpen(false)}>Cancel</Button>
                            <Button type="submit" onClick={(e) => { e.preventDefault(); setInviteModalOpen(false); }}>Send Invite</Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default MasterUsersPage;