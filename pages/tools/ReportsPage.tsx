import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import PlusIcon from '../../components/icons/PlusIcon';
import FilePieChartIcon from '../../components/icons/FilePieChartIcon';
import MoreHorizontalIcon from '../../components/icons/MoreHorizontalIcon';
import ReportViewerModal from '../../components/modals/ReportViewerModal';
import ListIcon from '../../components/icons/ListIcon';
import BarChartHorizontalIcon from '../../components/icons/BarChartHorizontalIcon';
import TrendingUpIcon from '../../components/icons/TrendingUpIcon';
import PieChartIcon from '../../components/icons/PieChartIcon';

const initialSavedReports = [
  { 
    id: 1, 
    name: 'Q2 BDE Performance Review', 
    description: 'A summary of closed ARR and conversion rates for each BDE in Q2.',
    createdBy: 'Master Admin', 
    lastRun: '2 days ago',
    config: {
      dataSource: 'Users',
      columns: ['name', 'closedARR', 'conversionRate'],
      filters: [],
      visualization: { type: 'Table' }
    }
  },
  { 
    id: 2, 
    name: 'Weekly Lead Source Breakdown', 
    description: 'Bar chart showing the count of new leads from each source this week.',
    createdBy: 'Amélie Laurent', 
    lastRun: '1 hour ago',
    config: {
      dataSource: 'Leads',
      columns: ['source', 'id'],
      filters: [],
      visualization: { type: 'Bar Chart', metric: 'id', metricAggregation: 'Count', dimension: 'source' }
    }
  },
];

const dataSchemas = {
    Leads: {
        fields: [
            { id: 'name', label: 'Lead Name', type: 'string' },
            { id: 'company', label: 'Company', type: 'string' },
            { id: 'status', label: 'Status', type: 'category', options: ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'] },
            { id: 'aiScore', label: 'AI Score', type: 'category', options: ['Hot', 'Warm', 'Cold'] },
            { id: 'source', label: 'Source', type: 'category', options: ['Webinar', 'Cold Call', 'Referral', 'Website', 'Advertisement'] },
            { id: 'createdDate', label: 'Creation Date', type: 'date' },
        ]
    },
    Deals: {
        fields: [
            { id: 'name', label: 'Deal Name', type: 'string' },
            { id: 'value', label: 'Value (ARR)', type: 'number' },
            { id: 'stage', label: 'Stage', type: 'category', options: ['Qualification', 'Proposal', 'Negotiation', 'Closed Won'] },
            { id: 'owner', label: 'Owner', type: 'string' },
            { id: 'closeDate', label: 'Close Date', type: 'date' },
        ]
    },
     Users: {
        fields: [
            { id: 'name', label: 'User Name', type: 'string' },
            { id: 'role', label: 'Role', type: 'category', options: ['BDE', 'Admin'] },
            { id: 'status', label: 'Status', type: 'category', options: ['Active', 'Inactive'] },
            { id: 'leads', label: 'Assigned Leads', type: 'number' },
            { id: 'conversionRate', label: 'Conversion Rate (%)', type: 'number' },
            { id: 'closedARR', label: 'Closed ARR', type: 'number' },
        ]
    },
};

const defaultReportConfig = {
    dataSource: 'Leads',
    columns: [],
    filters: [],
    visualization: { type: 'Table', metric: '', metricAggregation: 'Count', dimension: '' },
    name: '',
    description: '',
};

const ReportsPage: React.FC = () => {
    const [savedReports, setSavedReports] = useState(initialSavedReports);
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [reportToView, setReportToView] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [reportConfig, setReportConfig] = useState(defaultReportConfig);

    const openBuilder = () => {
        setReportConfig(defaultReportConfig);
        setCurrentStep(1);
        setIsBuilderOpen(true);
    };

    const handleSaveReport = () => {
        const newReport = {
            id: Date.now(),
            name: reportConfig.name,
            description: reportConfig.description,
            createdBy: 'Amélie Laurent', // Or get from user context
            lastRun: 'Never',
            config: { ...reportConfig },
        };
        setSavedReports(prev => [newReport, ...prev]);
        setIsBuilderOpen(false);
    };
    
    const handleRunReport = (report) => {
        setReportToView(report);
        setIsViewerOpen(true);
    };

    const toggleColumn = (fieldId) => {
        setReportConfig(prev => ({
            ...prev,
            columns: prev.columns.includes(fieldId)
                ? prev.columns.filter(c => c !== fieldId)
                : [...prev.columns, fieldId]
        }));
    };

    const numericFields = dataSchemas[reportConfig.dataSource]?.fields.filter(f => f.type === 'number').map(f => f.id) || [];
    const categoryFields = dataSchemas[reportConfig.dataSource]?.fields.filter(f => f.type === 'category' || f.type === 'string').map(f => f.id) || [];

    return (
    <div className="space-y-8">
      <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Report Builder</h1>
          <p className="text-slate-500 mt-1">Create and manage custom reports for tailored business intelligence.</p>
        </div>
        <Button onClick={openBuilder} leftIcon={<PlusIcon className="w-4 h-4" />}>
          Create New Report
        </Button>
      </header>

      <main className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                        <th className="px-4 py-3">Report Name</th>
                        <th className="px-4 py-3">Created By</th>
                        <th className="px-4 py-3">Last Run</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {savedReports.map((report, index) => (
                        <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors animate-fade-in" style={{ animationDelay: `${200 + index * 50}ms` }}>
                            <td className="px-4 py-4 font-bold text-slate-800 flex items-center gap-2">
                                <FilePieChartIcon className="w-4 h-4 text-indigo-500" />
                                {report.name}
                            </td>
                            <td className="px-4 py-4 text-slate-600">{report.createdBy}</td>
                            <td className="px-4 py-4 text-slate-500">{report.lastRun}</td>
                            <td className="px-4 py-4 text-right">
                                <Button size="sm" variant="secondary" className="mr-2" onClick={() => handleRunReport(report)}>Run</Button>
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

      <ReportViewerModal isOpen={isViewerOpen} onClose={() => setIsViewerOpen(false)} report={reportToView} />

      <Modal isOpen={isBuilderOpen} onClose={() => setIsBuilderOpen(false)}>
        <div className="p-2 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Create Custom Report</h2>
            <p className="text-slate-500 mb-6">Follow the steps to build your report.</p>
            
            <div className="flex items-center justify-between mb-6 text-sm font-semibold text-center">
                {['Source', 'Fields & Filters', 'Visualize', 'Save'].map((step, index) => (
                    <React.Fragment key={step}>
                        <span className={currentStep >= (index + 1) ? 'text-indigo-600' : 'text-slate-400'}>{index + 1}. {step}</span>
                        {index < 3 && <div className="flex-1 h-0.5 bg-slate-200 mx-4"><div className={`h-0.5 bg-indigo-500`} style={{width: `${Math.max(0, (currentStep - (index + 1)) * 100)}%`}}></div></div>}
                    </React.Fragment>
                ))}
            </div>

            {currentStep === 1 && (
                <div className="space-y-4 min-h-[200px]">
                    <h3 className="font-bold text-slate-700">Select Data Source</h3>
                    <p className="text-sm text-slate-500">Choose the primary data set for your report.</p>
                    <select value={reportConfig.dataSource} onChange={e => setReportConfig(prev => ({...prev, dataSource: e.target.value, columns: []}))} className="w-full p-3 bg-slate-100 rounded-lg">
                        {Object.keys(dataSchemas).map(source => <option key={source}>{source}</option>)}
                    </select>
                </div>
            )}
             {currentStep === 2 && (
                <div className="space-y-4 min-h-[200px]">
                    <h3 className="font-bold text-slate-700">Select Fields</h3>
                    <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded-lg max-h-48 overflow-y-auto">
                        {dataSchemas[reportConfig.dataSource].fields.map(field => (
                            <label key={field.id} className="flex items-center gap-2 p-2 rounded hover:bg-slate-200 cursor-pointer">
                                <input type="checkbox" checked={reportConfig.columns.includes(field.id)} onChange={() => toggleColumn(field.id)} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-sm font-medium">{field.label}</span>
                            </label>
                        ))}
                    </div>
                    {/* Simplified Filter UI */}
                    <h3 className="font-bold text-slate-700 pt-2">Add Filters (Optional)</h3>
                     <p className="text-sm p-4 bg-slate-100 rounded-lg text-center font-medium text-slate-500">[Advanced filtering UI would be here]</p>
                </div>
            )}
            {currentStep === 3 && (
                <div className="space-y-4 min-h-[200px]">
                    <h3 className="font-bold text-slate-700">Choose Visualization</h3>
                    <div className="grid grid-cols-5 gap-2 text-center">
                        {(['Table', 'Metric', 'Bar Chart', 'Line Chart', 'Pie Chart'] as const).map(type => {
                            const icons = { 'Table': <ListIcon/>, 'Metric': <span className="font-bold text-xl">123</span>, 'Bar Chart': <BarChartHorizontalIcon/>, 'Line Chart': <TrendingUpIcon/>, 'Pie Chart': <PieChartIcon/> };
                            return (
                                <button key={type} onClick={() => setReportConfig(p => ({...p, visualization: {...p.visualization, type}}))} className={`p-4 border-2 rounded-lg font-semibold flex flex-col items-center justify-center gap-2 ${reportConfig.visualization.type === type ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                                    <div className="h-6 w-6">{icons[type]}</div>
                                    <span className="text-xs">{type}</span>
                                </button>
                            )
                        })}
                    </div>
                    {['Bar Chart', 'Pie Chart'].includes(reportConfig.visualization.type) && (
                         <div className="grid grid-cols-2 gap-4 pt-4">
                            <div>
                                <label className="text-sm font-medium">Dimension</label>
                                <select value={reportConfig.visualization.dimension} onChange={e => setReportConfig(p => ({...p, visualization: {...p.visualization, dimension: e.target.value}}))} className="w-full p-2 bg-slate-100 rounded-lg mt-1">
                                    <option value="">Select...</option>
                                    {categoryFields.map(fieldId => <option key={fieldId} value={fieldId}>{dataSchemas[reportConfig.dataSource].fields.find(f=>f.id===fieldId).label}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="text-sm font-medium">Metric</label>
                                <select value={reportConfig.visualization.metric} onChange={e => setReportConfig(p => ({...p, visualization: {...p.visualization, metric: e.target.value}}))} className="w-full p-2 bg-slate-100 rounded-lg mt-1">
                                    <option value="">Select...</option>
                                    {dataSchemas[reportConfig.dataSource].fields.map(field => <option key={field.id} value={field.id}>{field.label}</option>)}
                                </select>
                            </div>
                         </div>
                    )}
                </div>
            )}
             {currentStep === 4 && (
                <div className="space-y-4 min-h-[200px]">
                    <h3 className="font-bold text-slate-700">Save Report</h3>
                    <p className="text-sm text-slate-500">Give your new report a name and description.</p>
                    <input type="text" placeholder="e.g., Q3 Lead Conversion by Source" value={reportConfig.name} onChange={e => setReportConfig(p => ({...p, name: e.target.value}))} className="w-full p-3 bg-slate-100 rounded-lg" />
                    <textarea placeholder="A short description of what this report shows." value={reportConfig.description} onChange={e => setReportConfig(p => ({...p, description: e.target.value}))} rows={3} className="w-full p-3 bg-slate-100 rounded-lg text-sm" />
                </div>
            )}

            <div className="pt-6 flex justify-between items-center">
                <Button variant="secondary" onClick={() => setCurrentStep(s => Math.max(1, s - 1))} disabled={currentStep === 1}>
                    Previous
                </Button>
                {currentStep < 4 ? (
                    <Button onClick={() => setCurrentStep(s => Math.min(4, s + 1))}>
                        Next
                    </Button>
                ) : (
                    <Button onClick={handleSaveReport}>
                        Save Report
                    </Button>
                )}
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportsPage;