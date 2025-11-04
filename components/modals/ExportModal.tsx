import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { exportDataAsFile } from '../../utils/export';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableDataSources: string[];
  initialSelectedData?: string[];
  data: { [key: string]: any[] };
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, availableDataSources, initialSelectedData = [], data }) => {
    const [selectedData, setSelectedData] = useState<string[]>(initialSelectedData);
    const [exportFormat, setExportFormat] = useState<'CSV' | 'XLSX' | 'JSON'>('CSV');
    const [isExporting, setIsExporting] = useState(false);

    const toggleSelection = (item: string) => {
        setSelectedData(prev => 
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    const handleExport = () => {
        if (selectedData.length === 0) return;
        setIsExporting(true);

        // Simulate file generation
        setTimeout(() => {
            selectedData.forEach(sourceName => {
                const dataToExport = data[sourceName];
                if (dataToExport) {
                    exportDataAsFile(
                        dataToExport, 
                        `${sourceName.toLowerCase()}_export_${new Date().toISOString()}`, 
                        exportFormat.toLowerCase() as 'csv' | 'xlsx' | 'json'
                    );
                }
            });
            setIsExporting(false);
            onClose();
        }, 1000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Export Data</h2>
                <p className="text-slate-500 mb-6">Select your data and format to begin the export.</p>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-slate-700 mb-3">1. Select data to export</h3>
                        <div className="grid grid-cols-2 gap-3 p-2 bg-slate-50 rounded-lg max-h-48 overflow-y-auto">
                            {availableDataSources.map(item => (
                                <label key={item} className="flex items-center gap-2 p-2 rounded hover:bg-slate-200 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedData.includes(item)} 
                                        onChange={() => toggleSelection(item)} 
                                        className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-700 mb-3">2. Choose format</h3>
                        <div className="flex gap-2">
                            {(['CSV', 'XLSX', 'JSON'] as const).map(format => (
                                <button key={format} onClick={() => setExportFormat(format)} className={`px-4 py-2 text-sm font-semibold rounded-full ${exportFormat === format ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                    {format}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="button" onClick={handleExport} isLoading={isExporting} disabled={selectedData.length === 0}>
                        Export
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ExportModal;
