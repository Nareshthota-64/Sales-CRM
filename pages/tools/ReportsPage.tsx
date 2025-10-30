import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import PlusIcon from '../../components/icons/PlusIcon';
import FilePieChartIcon from '../../components/icons/FilePieChartIcon';
import MoreHorizontalIcon from '../../components/icons/MoreHorizontalIcon';

const savedReports = [
  { id: 1, name: 'Q2 BDE Performance Review', createdBy: 'Master Admin', lastRun: '2 days ago' },
  { id: 2, name: 'Weekly Lead Source Breakdown', createdBy: 'Amélie Laurent', lastRun: '1 hour ago' },
  { id: 3, name: 'Monthly Conversion Rate by Region', createdBy: 'Master Admin', lastRun: '1 week ago' },
  { id: 4, name: 'Stalled Deals Analysis', createdBy: 'David Garcia', lastRun: '5 days ago' },
];

const ReportsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const openModal = () => {
        setCurrentStep(1);
        setIsModalOpen(true);
    };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Report Builder</h1>
          <p className="text-slate-500 mt-1">Create and manage custom reports for tailored business intelligence.</p>
        </div>
        <Button onClick={openModal} leftIcon={<PlusIcon className="w-4 h-4" />}>
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
                                <Button size="sm" variant="secondary" className="mr-2">Run</Button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-2">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Create Custom Report</h2>
            <p className="text-slate-500 mb-6">Follow the steps to build your report.</p>
            
            <div className="flex items-center justify-between mb-6 text-sm font-semibold text-center">
                <span className={currentStep >= 1 ? 'text-indigo-600' : 'text-slate-400'}>1. Source</span>
                <div className="flex-1 h-0.5 bg-slate-200 mx-4"><div className={`h-0.5 bg-indigo-500`} style={{width: `${((currentStep-1)/3)*100}%`}}></div></div>
                <span className={currentStep >= 2 ? 'text-indigo-600' : 'text-slate-400'}>2. Data</span>
                <div className="flex-1 h-0.5 bg-slate-200 mx-4"><div className={`h-0.5 bg-indigo-500`} style={{width: `${((currentStep-2)/3)*100}%`}}></div></div>
                <span className={currentStep >= 3 ? 'text-indigo-600' : 'text-slate-400'}>3. Visualize</span>
                <div className="flex-1 h-0.5 bg-slate-200 mx-4"><div className={`h-0.5 bg-indigo-500`} style={{width: `${((currentStep-3)/3)*100}%`}}></div></div>
                <span className={currentStep >= 4 ? 'text-indigo-600' : 'text-slate-400'}>4. Save</span>
            </div>

            {currentStep === 1 && (
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-700">Select Data Source</h3>
                    <p className="text-sm text-slate-500">Choose the primary data set for your report.</p>
                    <select className="w-full p-3 bg-slate-100 rounded-lg">
                        <option>Leads</option>
                        <option>Companies</option>
                        <option>Deals</option>
                        <option>Users</option>
                    </select>
                </div>
            )}
             {currentStep === 2 && (
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-700">Select Columns & Add Filters</h3>
                    <p className="text-sm text-slate-500">Choose which columns to include and filter your data.</p>
                    <p className="p-4 bg-slate-100 rounded-lg text-center font-medium">[Column selection and filtering UI would be here]</p>
                </div>
            )}
            {currentStep === 3 && (
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-700">Choose Visualization</h3>
                    <p className="text-sm text-slate-500">How would you like to display your data?</p>
                     <div className="grid grid-cols-3 gap-4">
                        <button className="p-4 border-2 border-indigo-400 bg-indigo-50 rounded-lg font-semibold text-indigo-700">Table</button>
                        <button className="p-4 border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-50">Bar Chart</button>
                        <button className="p-4 border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-50">Line Chart</button>
                    </div>
                </div>
            )}
             {currentStep === 4 && (
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-700">Save Report</h3>
                    <p className="text-sm text-slate-500">Give your new report a name.</p>
                    <input type="text" placeholder="e.g., Q3 Lead Conversion by Source" className="w-full p-3 bg-slate-100 rounded-lg" />
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
                    <Button onClick={() => setIsModalOpen(false)}>
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