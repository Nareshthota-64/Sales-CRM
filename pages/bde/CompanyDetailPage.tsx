import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import ChevronRightIcon from '../../components/icons/ChevronRightIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import StickyNoteIcon from '../../components/icons/StickyNoteIcon';
import ShieldCheckIcon from '../../components/icons/ShieldCheckIcon';
import ShieldAlertIcon from '../../components/icons/ShieldAlertIcon';
import DollarSignIcon from '../../components/icons/DollarSignIcon';
import CalendarIcon from '../../components/icons/CalendarIcon';
import SparklesIcon from '../../components/icons/SparklesIcon';
import PhoneIcon from '../../components/icons/PhoneIcon';
import MailIcon from '../../components/icons/MailIcon';
import HandshakeIcon from '../../components/icons/HandshakeIcon';

// Types & Data (Re-using from CompaniesPage for consistency)
type AccountHealth = 'Healthy' | 'Needs Attention' | 'At Risk';

const companiesData = [
  { id: 'comp-1', name: 'Innovatech', logo: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600', description: 'Leading provider of enterprise SaaS solutions, specializing in cloud-based analytics and business intelligence.', health: 'Healthy', arr: 50000, conversionDate: 'Aug 15, 2023' },
  { id: 'comp-2', name: 'Quantum Leap', logo: 'https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500', description: 'Pioneering quantum computing technologies.', health: 'Healthy', arr: 120000, conversionDate: 'Jun 20, 2023' },
  { id: 'comp-3', name: 'DataCorp', logo: 'https://tailwindui.com/img/logos/mark.svg?color=green&shade=500', description: 'Big data and analytics platform.', health: 'Needs Attention', arr: 20000, conversionDate: 'Oct 05, 2023' },
];

const healthStyles: Record<AccountHealth, { icon: React.ReactNode; text: string; bg: string; }> = {
  Healthy: { icon: <ShieldCheckIcon className="w-5 h-5 text-green-700" />, text: 'text-green-700', bg: 'bg-green-100' },
  'Needs Attention': { icon: <ShieldAlertIcon className="w-5 h-5 text-yellow-700" />, text: 'text-yellow-700', bg: 'bg-yellow-100' },
  'At Risk': { icon: <ShieldAlertIcon className="w-5 h-5 text-red-700" />, text: 'text-red-700', bg: 'bg-red-100' },
};

const deals = [
    { name: 'Initial Enterprise License', stage: 'Closed Won', amount: 50000, closeDate: '2023-08-15' },
    { name: 'Analytics Pro Add-on', stage: 'In Progress', amount: 15000, closeDate: '2024-03-20' },
];

const contacts = [
    { name: 'John Doe', title: 'VP of Engineering', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Sarah Jenkins', title: 'Project Manager', avatar: 'https://i.pravatar.cc/150?img=3' },
];

const activities = [
    { type: 'note', content: 'Customer is very happy with the platform. Potential for upsell next quarter.', author: 'Amélie Laurent', time: '3 days ago', icon: <StickyNoteIcon className="w-5 h-5 text-yellow-600" /> },
    { type: 'call', content: 'Q4 check-in call. Discussed roadmap and upcoming features.', author: 'Amélie Laurent', time: '1 week ago', icon: <PhoneIcon className="w-5 h-5 text-blue-600" /> },
    { type: 'email', content: 'Sent over contract renewal documents for review.', author: 'System', time: '2 weeks ago', icon: <MailIcon className="w-5 h-5 text-slate-500" /> },
];

const aiInsights = [
    { title: 'Upsell Opportunity', content: 'Usage of the analytics module has tripled in the last 30 days. Propose an upgrade to the Premium Analytics Suite.', type: 'positive' },
    { title: 'Expansion Signal', content: 'Company just posted a new job for "Head of Marketing". This is a great opportunity to introduce our marketing automation tools.', type: 'positive' },
    { title: 'Retention Alert', content: 'No admin-level logins detected in the past 14 days. Suggest a proactive check-in to ensure they are getting value.', type: 'negative' },
];

// Sub-components
const MetricCard: React.FC<{ icon: React.ReactNode; label: string; value: string | React.ReactNode; delay: number }> = ({ icon, label, value, delay }) => (
    <div className="flex items-center gap-4 bg-slate-50/70 p-4 rounded-xl animate-fade-in" style={{ animationDelay: `${delay}ms`}}>
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0 shadow-sm">{icon}</div>
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <div className="font-semibold text-slate-800">{value}</div>
        </div>
    </div>
);


const CompanyDetailPage: React.FC = () => {
    const { companyId } = useParams<{ companyId: string }>();
    const navigate = useNavigate();
    const company = companiesData.find(c => c.id === companyId) || companiesData[0]; // Default to first for demo

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
                <div>
                    <div className="flex items-center text-sm text-slate-500 font-medium gap-1 mb-2">
                        <Link to="/bde/companies" className="hover:text-slate-800">My Companies</Link>
                        <ChevronRightIcon className="w-4 h-4" />
                        <span className="text-slate-800 font-semibold">{company.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <img src={company.logo} alt={`${company.name} logo`} className="w-12 h-12" />
                        <h1 className="text-4xl font-bold text-slate-800">{company.name}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => navigate(`/deal-room/${company.id}`)} leftIcon={<HandshakeIcon className="w-4 h-4"/>}>Open Deal Room</Button>
                    <Button leftIcon={<PlusIcon className="w-4 h-4"/>}>Create New Deal</Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {/* Left Column */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">About {company.name}</h3>
                        <p className="text-sm text-slate-600 border-l-4 border-indigo-200 pl-4">{company.description}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Company Vitals</h3>
                        <MetricCard icon={<DollarSignIcon className="w-5 h-5" />} label="Current ARR" value={`$${company.arr.toLocaleString()}`} delay={250} />
                        <MetricCard 
                            icon={healthStyles[company.health].icon} 
                            label="Account Health" 
                            value={<span className={`font-bold ${healthStyles[company.health].text}`}>{company.health}</span>} 
                            delay={300} 
                        />
                        <MetricCard icon={<CalendarIcon className="w-5 h-5" />} label="Converted On" value={company.conversionDate} delay={350} />
                    </div>
                     <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '400ms' }}>
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Key Contacts</h3>
                        <div className="space-y-3">
                            {contacts.map(contact => (
                                <div key={contact.name} className="flex items-center gap-3">
                                    <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{contact.name}</p>
                                        <p className="text-xs text-slate-500">{contact.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Center Column */}
                <main className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Deal History</h3>
                        <div className="space-y-2">
                           {deals.map(deal => (
                                <div key={deal.name} className="grid grid-cols-4 gap-4 items-center p-3 bg-slate-50 rounded-lg">
                                    <p className="col-span-2 font-semibold text-slate-700">{deal.name}</p>
                                    <p className="text-sm text-slate-600">{deal.stage}</p>
                                    <p className="text-sm font-semibold text-slate-800 text-right">${deal.amount.toLocaleString()}</p>
                                </div>
                           ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '400ms' }}>
                        <h3 className="text-lg font-bold text-slate-800 mb-6">Activity Timeline</h3>
                         <div className="relative pl-6">
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                            {activities.map((item, index) => (
                                <div key={index} className="relative mb-8">
                                    <div className="absolute -left-[35px] top-0 w-8 h-8 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    <div className="p-4 rounded-lg">
                                        <p className="text-sm text-slate-700">{item.content}</p>
                                        <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                                            <span>by {item.author}</span>
                                            <span>{item.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
                
                {/* AI Insights Column - Spans all rows on small screens */}
                <aside className="lg:col-span-3 xl:col-span-1">
                    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 rounded-2xl shadow-sm sticky top-8 animate-fade-in" style={{ animationDelay: '500ms' }}>
                         <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-indigo-500" />
                            AI Growth Insights
                        </h3>
                        <div className="space-y-4">
                            {aiInsights.map(insight => (
                                <div key={insight.title} className={`p-4 rounded-lg ${insight.type === 'positive' ? 'bg-green-100/70' : 'bg-red-100/70'}`}>
                                    <p className={`font-semibold text-sm ${insight.type === 'positive' ? 'text-green-800' : 'text-red-800'}`}>{insight.title}</p>
                                    <p className={`text-xs mt-1 ${insight.type === 'positive' ? 'text-green-700' : 'text-red-700'}`}>{insight.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CompanyDetailPage;