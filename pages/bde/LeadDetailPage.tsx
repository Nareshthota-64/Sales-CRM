import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import ChevronRightIcon from '../../components/icons/ChevronRightIcon';
import ArrowRightLeftIcon from '../../components/icons/ArrowRightLeftIcon';
import DollarSignIcon from '../../components/icons/DollarSignIcon';
import TargetIcon from '../../components/icons/TargetIcon';
import UserPlusIcon from '../../components/icons/UserPlusIcon';
import ChevronDownIcon from '../../components/icons/ChevronDownIcon';
import StickyNoteIcon from '../../components/icons/StickyNoteIcon';
import PhoneIcon from '../../components/icons/PhoneIcon';
import VideoIcon from '../../components/icons/VideoIcon';
import MailIcon from '../../components/icons/MailIcon';
import PlusIcon from '../../components/icons/PlusIcon';


// Re-using data and types from LeadsPage for consistency
type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Unqualified' | 'Converted';
const allStatuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'];
const leadsData = [
  { id: 'lead-1', name: 'John Doe', email: 'john.doe@innovatech.com', company: 'Innovatech', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600', status: 'Qualified', value: 50000, source: 'Webinar', assignedTo: '1', assignedToName: 'Amélie Laurent' },
  { id: 'lead-2', name: 'Jane Smith', email: 'jane.s@solutions.com', company: 'Solutions Inc.', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=red&shade=500', status: 'New', value: 75000, source: 'Referral', assignedTo: '2', assignedToName: 'Benoît Dubois' },
  { id: 'lead-3', name: 'Sam Wilson', email: 'sam.wilson@datacorp.co', company: 'DataCorp', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=green&shade=500', status: 'Contacted', value: 20000, source: 'Website', assignedTo: '1', assignedToName: 'Amélie Laurent' },
  { id: 'lead-4', name: 'Patricia Williams', email: 'pat.w@futuregadget.io', company: 'FutureGadget', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=yellow&shade=500', status: 'New', value: 5000, source: 'Cold Call', assignedTo: '3', assignedToName: 'Chloé Martin' },
  { id: 'lead-5', name: 'Michael Brown', email: 'm.brown@synergy.llc', company: 'Synergy LLC', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500', status: 'Unqualified', value: 10000, source: 'Advertisement', assignedTo: '2', assignedToName: 'Benoît Dubois' },
  { id: 'lead-6', name: 'Linda Davis', email: 'linda.d@quantum.ai', company: 'Quantum Leap', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500', status: 'Converted', value: 120000, source: 'Referral', assignedTo: '1', assignedToName: 'Amélie Laurent' },
  { id: 'lead-7', name: 'James Miller', email: 'j.miller@nextgen.ai', company: 'NextGen AI', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=pink&shade=500', status: 'Contacted', value: 35000, source: 'Webinar', assignedTo: '3', assignedToName: 'Chloé Martin' },
];
const assigneeAvatars: { [key: string]: string } = {
  '1': 'https://i.pravatar.cc/150?img=1', '2': 'https://i.pravatar.cc/150?img=2',
  '3': 'https://i.pravatar.cc/150?img=3',
};
const statusStyles: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-800 ring-blue-200',
  Contacted: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
  Qualified: 'bg-indigo-100 text-indigo-800 ring-indigo-200',
  Unqualified: 'bg-slate-100 text-slate-800 ring-slate-200',
  Converted: 'bg-green-100 text-green-800 ring-green-200',
};

const activityFeed = [
    { type: 'note', content: 'Discussed pricing models and potential for a Q4 start. Sent over the enterprise package details.', author: 'Amélie Laurent', time: '2 hours ago', icon: <StickyNoteIcon className="w-5 h-5 text-yellow-600" /> },
    { type: 'call', content: 'Initial discovery call. Good fit, interested in AI analytics features.', author: 'Amélie Laurent', time: '1 day ago', icon: <PhoneIcon className="w-5 h-5 text-blue-600" /> },
    { type: 'meeting', content: 'Scheduled a product demo for next Tuesday at 10 AM PST.', author: 'John Doe', time: '3 days ago', icon: <VideoIcon className="w-5 h-5 text-purple-600" /> },
    { type: 'email', content: 'Opened initial outreach email. Clicked on pricing link.', author: 'System', time: '5 days ago', icon: <MailIcon className="w-5 h-5 text-slate-500" /> },
];

const InfoCard: React.FC<{ icon: React.ReactNode; label: string; value: string | React.ReactNode; delay: number }> = ({ icon, label, value, delay }) => (
    <div className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${delay}ms`}}>
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0">{icon}</div>
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="font-semibold text-slate-800">{value}</p>
        </div>
    </div>
);

const LeadStatusUpdater: React.FC<{ currentStatus: LeadStatus; onChange: (status: LeadStatus) => void }> = ({ currentStatus, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className={`w-full flex justify-between items-center px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${statusStyles[currentStatus]}`}>
                {currentStatus}
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-10 animate-fade-in" style={{ animationDuration: '0.2s' }}>
                    {allStatuses.map(status => (
                        <button key={status} onClick={() => { onChange(status); setIsOpen(false); }} className={`w-full text-left px-3 py-2 text-sm font-semibold hover:bg-slate-50 ${status === currentStatus ? 'text-indigo-600' : 'text-slate-700'}`}>
                            {status}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const LeadDetailPage: React.FC = () => {
    const { leadId } = useParams<{ leadId: string }>();
    const navigate = useNavigate();
    const lead = useMemo(() => leadsData.find(l => l.id === leadId), [leadId]);
    const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead?.status || 'New');

    if (!lead) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-slate-800">Lead not found</h2>
                <p className="text-slate-500">The lead you are looking for does not exist.</p>
                <Link to="/bde/leads"><Button className="mt-4">Back to Leads</Button></Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
                <div>
                    <div className="flex items-center text-sm text-slate-500 font-medium gap-1 mb-2">
                        <Link to="/bde/leads" className="hover:text-slate-800">Leads</Link>
                        <ChevronRightIcon className="w-4 h-4" />
                        <span className="text-slate-800 font-semibold">{lead.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-bold text-slate-800">{lead.name}</h1>
                        <p className="text-2xl text-slate-400 font-light">@ {lead.company}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" leftIcon={<MailIcon className="w-4 h-4" />} onClick={() => navigate('/bde/email/compose', { state: { lead } })}>Email</Button>
                    <Button leftIcon={<ArrowRightLeftIcon className="w-4 h-4" />} onClick={() => navigate(`/bde/conversion/${lead.id}`)}>Request Conversion</Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {/* Left Column */}
                <aside className="xl:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <div className="flex flex-col items-center text-center">
                            <img src={lead.companyLogo} alt={lead.company} className="w-20 h-20 mb-4"/>
                            <h2 className="text-xl font-bold text-slate-800">{lead.company}</h2>
                            <p className="text-slate-500">Innovating the future of SaaS.</p>
                        </div>
                        <hr className="my-6 border-slate-100" />
                        <div className="space-y-4">
                             <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Status</h3>
                             <LeadStatusUpdater currentStatus={currentStatus} onChange={setCurrentStatus} />
                             <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pt-4">Details</h3>
                             <InfoCard icon={<DollarSignIcon className="w-5 h-5" />} label="Value" value={`$${lead.value.toLocaleString()}`} delay={200} />
                             <InfoCard icon={<TargetIcon className="w-5 h-5" />} label="Source" value={lead.source} delay={300} />
                             <InfoCard 
                                icon={<UserPlusIcon className="w-5 h-5" />} 
                                label="Assigned To" 
                                value={
                                    <div className="flex items-center gap-2">
                                        <img src={assigneeAvatars[lead.assignedTo]} className="w-6 h-6 rounded-full" />
                                        <span>{lead.assignedToName}</span>
                                    </div>
                                } 
                                delay={400} 
                            />
                            <InfoCard icon={<MailIcon className="w-5 h-5" />} label="Email" value={<a href={`mailto:${lead.email}`} className="text-indigo-600 hover:underline">{lead.email}</a>} delay={500} />
                        </div>
                    </div>
                </aside>

                {/* Center Column */}
                <main className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Activity Feed</h3>
                        <div className="relative pl-6">
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                            {activityFeed.map((item, index) => (
                                <div key={index} className="relative mb-8 animate-fade-in" style={{ animationDelay: `${300 + index * 100}ms`}}>
                                    <div className="absolute -left-[35px] top-0 w-8 h-8 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-lg">
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

                {/* Right Column */}
                <aside className="lg:col-span-3 xl:col-span-1">
                     <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Log Interaction</h3>
                        <div className="flex gap-2 mb-4 border-b border-slate-200">
                            <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 border-indigo-500 text-indigo-600">
                                <StickyNoteIcon className="w-4 h-4" /> Note
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-800">
                                <PhoneIcon className="w-4 h-4" /> Call
                            </button>
                             <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-800">
                                <VideoIcon className="w-4 h-4" /> Meeting
                            </button>
                        </div>
                        <textarea
                            placeholder="Add a note about your interaction..."
                            rows={4}
                            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        ></textarea>
                        <Button className="w-full mt-4" leftIcon={<PlusIcon className="w-4 h-4"/>}>Add Note</Button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default LeadDetailPage;