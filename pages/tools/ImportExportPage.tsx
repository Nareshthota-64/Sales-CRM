import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import UploadCloudIcon from '../../components/icons/UploadCloudIcon';
import FileDownIcon from '../../components/icons/FileDownIcon';
import CheckCircleIcon from '../../components/icons/CheckCircleIcon';
import XCircleIcon from '../../components/icons/XCircleIcon';

const importHistory = [
  { id: 1, file: 'leads_q3_2024.csv', status: 'Completed', records: 257, date: '2 days ago' },
  { id: 2, file: 'company_update.xlsx', status: 'Completed', records: 52, date: '5 days ago' },
  { id: 3, file: 'contact_list_partial.csv', status: 'Failed', records: 15, date: '1 week ago' },
];

const exportableData = ['Leads', 'Companies', 'Contacts', 'Deals', 'Activities'];

const ImportExportPage: React.FC = () => {
    const [selectedData, setSelectedData] = useState<string[]>(['Leads', 'Companies']);
    const [exportFormat, setExportFormat] = useState('CSV');

    const toggleSelection = (item: string) => {
        setSelectedData(prev => 
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

  return (
    <div className="space-y-8">
      <header className="animate-fade-in">
        <h1 className="text-4xl font-bold text-slate-800">Data Import & Export</h1>
        <p className="text-slate-500 mt-1">Manage your data with bulk import and export operations.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Import Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
            <UploadCloudIcon className="w-6 h-6 text-indigo-500" />
            Import Data
          </h2>
          <div className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-slate-300 rounded-lg text-center bg-slate-50/50">
            <UploadCloudIcon className="w-12 h-12 text-slate-400 mb-3" />
            <p className="text-slate-600 font-semibold">Drag & drop your CSV or XLSX file here</p>
            <p className="text-sm text-slate-500 my-2">or</p>
            <Button type="button" variant="secondary">Browse Files</Button>
            <p className="text-xs text-slate-400 mt-4">Max file size: 10MB</p>
          </div>
          <h3 className="text-lg font-bold text-slate-700 mt-6 mb-3">Import History</h3>
          <div className="space-y-2">
            {importHistory.map(item => (
                <div key={item.id} className="grid grid-cols-3 gap-4 items-center p-3 bg-slate-50 rounded-lg text-sm">
                    <p className="font-semibold text-slate-800 truncate">{item.file}</p>
                    <div className={`flex items-center gap-2 font-semibold ${item.status === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.status === 'Completed' ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                        {item.status}
                    </div>
                    <p className="text-slate-500 text-right">{item.records} records</p>
                </div>
            ))}
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
            <FileDownIcon className="w-6 h-6 text-green-500" />
            Export Data
          </h2>
          <div>
            <h3 className="font-semibold text-slate-700 mb-3">1. Select data to export</h3>
            <div className="grid grid-cols-2 gap-3">
                {exportableData.map(item => (
                    <button key={item} onClick={() => toggleSelection(item)} className={`p-3 border rounded-lg text-left transition-colors ${selectedData.includes(item) ? 'bg-indigo-100 border-indigo-300 text-indigo-800 font-semibold' : 'bg-white border-slate-300 hover:bg-slate-50'}`}>
                        {item}
                    </button>
                ))}
            </div>
          </div>
           <div className="mt-6">
            <h3 className="font-semibold text-slate-700 mb-3">2. Choose format</h3>
            <div className="flex gap-2">
                {['CSV', 'XLSX', 'JSON'].map(format => (
                    <button key={format} onClick={() => setExportFormat(format)} className={`px-4 py-2 text-sm font-semibold rounded-full ${exportFormat === format ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        {format}
                    </button>
                ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-200 text-right">
            <Button>Export Data</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportPage;