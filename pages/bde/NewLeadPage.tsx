import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ChevronRightIcon from '../../components/icons/ChevronRightIcon';
import UserIcon from '../../components/icons/UserIcon';
import MailIcon from '../../components/icons/MailIcon';
import BriefcaseIcon from '../../components/icons/BriefcaseIcon';
import BuildingIcon from '../../components/icons/BuildingIcon';
import GlobeIcon from '../../components/icons/GlobeIcon';
import ZapIcon from '../../components/icons/ZapIcon';
import SpinnerIcon from '../../components/icons/SpinnerIcon';

const NewLeadPage: React.FC = () => {
    const navigate = useNavigate();
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [isEnriching, setIsEnriching] = useState(false);
    const [showInsights, setShowInsights] = useState(false);
    const [enrichedData, setEnrichedData] = useState<{
        name: string;
        logo: string;
        description: string;
        tags: string[];
    } | null>(null);

    const handleEnrich = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!websiteUrl) return;

        setIsEnriching(true);
        setShowInsights(true);
        setEnrichedData(null);

        // Simulate AI call
        setTimeout(() => {
            setEnrichedData({
                name: 'Innovatech',
                logo: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600',
                description: 'A leading provider of enterprise SaaS solutions, specializing in cloud-based analytics and business intelligence.',
                tags: ['SaaS', 'Analytics', 'B2B', 'Cloud Services'],
            });
            setIsEnriching(false);
        }, 1500);
    };
    
    const handleSaveLead = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically save the form data
        navigate('/bde/leads');
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="animate-fade-in">
                <div className="flex items-center text-sm text-slate-500 font-medium gap-1 mb-2">
                    <Link to="/bde/leads" className="hover:text-slate-800">Leads</Link>
                    <ChevronRightIcon className="w-4 h-4" />
                    <span className="text-slate-800 font-semibold">Add New Lead</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-800">Capture a New Lead</h1>
                <p className="text-slate-500 mt-1">Fill in the details below. Use the AI assistant to enrich company data instantly.</p>
            </header>

            <form onSubmit={handleSaveLead} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Fields */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-4">Lead Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Contact Name" id="contact-name" type="text" placeholder="e.g., John Doe" icon={<UserIcon className="w-5 h-5 text-gray-400" />} />
                        <Input label="Email Address" id="email" type="email" placeholder="e.g., john.doe@company.com" icon={<MailIcon className="w-5 h-5 text-gray-400" />} />
                    </div>
                    <Input label="Job Title" id="job-title" type="text" placeholder="e.g., Head of Sales" icon={<BriefcaseIcon className="w-5 h-5 text-gray-400" />} />
                    <Input label="Company Name" id="company-name" type="text" placeholder="e.g., Innovatech" icon={<BuildingIcon className="w-5 h-5 text-gray-400" />} />
                    <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-500 mb-2">Company Website</label>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                                    <GlobeIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="website"
                                    type="text"
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                    placeholder="e.g., www.innovatech.com"
                                    className="w-full py-4 px-6 pl-14 bg-gray-100/60 rounded-full text-gray-800 placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all duration-300"
                                />
                            </div>
                            <Button variant="secondary" onClick={handleEnrich} isLoading={isEnriching} className="!py-4 !px-6 !rounded-full">
                                <ZapIcon className="w-5 h-5 mr-2" />
                                Get AI Insights
                            </Button>
                        </div>
                    </div>
                    <div className="pt-4 text-right">
                        <Button type="submit">Save Lead</Button>
                    </div>
                </div>

                {/* AI Insights Panel */}
                <div className="lg:col-span-1">
                    {showInsights && (
                        <div className="sticky top-8 bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
                            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <ZapIcon className="w-5 h-5 text-indigo-500" />
                                AI Insights
                            </h3>
                            {isEnriching ? (
                                <div className="flex flex-col items-center justify-center h-48">
                                    <SpinnerIcon className="w-8 h-8 text-indigo-500" />
                                    <p className="mt-3 text-slate-500 font-medium">Analyzing website...</p>
                                </div>
                            ) : enrichedData && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <img src={enrichedData.logo} alt="Company Logo" className="w-14 h-14" />
                                        <h4 className="text-lg font-bold text-slate-800">{enrichedData.name}</h4>
                                    </div>
                                    <p className="text-sm text-slate-600 border-l-4 border-indigo-200 pl-4">
                                        {enrichedData.description}
                                    </p>
                                    <div>
                                        <h5 className="font-semibold text-slate-700 mb-2">Industry Tags:</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {enrichedData.tags.map(tag => (
                                                <span key={tag} className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default NewLeadPage;
