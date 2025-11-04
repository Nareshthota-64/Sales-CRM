import React, { useState, useRef } from 'react';
import Button from '../../components/ui/Button';
import UploadCloudIcon from '../../components/icons/UploadCloudIcon';
import FileDownIcon from '../../components/icons/FileDownIcon';
import CheckCircleIcon from '../../components/icons/CheckCircleIcon';
import XCircleIcon from '../../components/icons/XCircleIcon';
import ExportModal from '../../components/modals/ExportModal';
import { mockData } from '../../utils/export';

const initialImportHistory = [
  { id: 1, file: 'leads_q3_2024.csv', status: 'Completed', records: 257, date: '2 days ago' },
  { id: 2, file: 'company_update.xlsx', status: 'Completed', records: 52, date: '5 days ago' },
  { id: 3, file: 'contact_list_partial.csv', status: 'Failed', records: 15, date: '1 week ago' },
];

const exportableDataSources = ['Leads', 'Companies', 'Contacts', 'Deals', 'Activities'];

const ImportExportPage: React.FC = () => {
    const [importHistory, setImportHistory] = useState(initialImportHistory);
    const [isDragging, setIsDragging] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        
        // Simulate processing
        const newEntry = {
            id: Date.now(),
            file: file.name,
            status: 'Processing' as 'Processing' | 'Completed' | 'Failed',
            records: 0,
            date: 'Just now'
        };
        setImportHistory(prev => [newEntry, ...prev]);

        setTimeout(() => {
            const isSuccess = Math.random() > 0.2; // 80% success rate
            setImportHistory(prev => prev.map(item => item.id === newEntry.id ? {
                ...item,
                status: isSuccess ? 'Completed' : 'Failed',
                records: isSuccess ? Math.floor(Math.random() * 500) + 50 : Math.floor(Math.random() * 50),
            } : item));
        }, 2000);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };
    
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };
    
    const handleBrowseClick = () => {
        fileInputRef.current?.click();
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
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".csv, .xlsx"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg text-center transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50/50'}`}
          >
            <UploadCloudIcon className="w-12 h-12 text-slate-400 mb-3" />
            <p className="text-slate-600 font-semibold">Drag & drop your CSV or XLSX file here</p>
            <p className="text-sm text-slate-500 my-2">or</p>
            <Button type="button" variant="secondary" onClick={handleBrowseClick}>Browse Files</Button>
            <p className="text-xs text-slate-400 mt-4">Max file size: 10MB</p>
          </div>
          <h3 className="text-lg font-bold text-slate-700 mt-6 mb-3">Import History</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {importHistory.map(item => (
                <div key={item.id} className="grid grid-cols-3 gap-4 items-center p-3 bg-slate-50 rounded-lg text-sm">
                    <p className="font-semibold text-slate-800 truncate">{item.file}</p>
                    <div className={`flex items-center gap-2 font-semibold ${item.status === 'Completed' ? 'text-green-600' : item.status === 'Failed' ? 'text-red-600' : 'text-indigo-600 animate-pulse'}`}>
                        {item.status === 'Completed' ? <CheckCircleIcon className="w-4 h-4" /> : item.status === 'Failed' ? <XCircleIcon className="w-4 h-4" /> : null}
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
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-slate-600 font-medium mb-4">Select the data you want to export in various formats.</p>
            <Button onClick={() => setIsExportModalOpen(true)}>
                Start Export
            </Button>
          </div>
        </div>
      </div>
      
      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        availableDataSources={exportableDataSources}
        data={mockData}
      />
    </div>
  );
};

export default ImportExportPage;