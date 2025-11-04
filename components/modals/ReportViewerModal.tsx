import React from 'react';
import Modal from '../ui/Modal';
import BarChart from '../charts/BarChart';

// Helper to generate some plausible mock data based on config
const generateMockData = (config) => {
    if (!config) return [];
    // For demonstration, we'll just generate simple data.
    // A real implementation would fetch and process data here.
    if (config.visualization?.type === 'Bar Chart' && config.visualization?.dimension) {
        if (config.visualization.dimension === 'source') {
            return [
                { label: 'Webinar', value: 45 },
                { label: 'Referral', value: 30 },
                { label: 'Website', value: 22 },
                { label: 'Cold Call', value: 15 },
            ];
        }
    }
    // Default mock data for table
    return [
        { name: 'John Doe', closedARR: 50000, conversionRate: 25 },
        { name: 'Jane Smith', closedARR: 75000, conversionRate: 30 },
        { name: 'Sam Wilson', closedARR: 30000, conversionRate: 20 },
    ];
};


const ReportViewerModal: React.FC<{ isOpen: boolean; onClose: () => void; report: any }> = ({ isOpen, onClose, report }) => {
    if (!isOpen || !report) return null;

    const data = generateMockData(report.config);

    const renderVisualization = () => {
        const { visualization } = report.config;
        switch (visualization.type) {
            case 'Bar Chart':
                // FIX: Cast data to the type expected by BarChart. This is safe because generateMockData returns the correct shape for a bar chart visualization.
                return <div className="h-72"><BarChart data={data as { label: string; value: number; }[]} /></div>;
            case 'Table':
            default:
                return (
                    <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase border-b border-slate-200 sticky top-0 bg-white">
                                <tr>
                                    {report.config.columns.map(col => <th key={col} className="px-4 py-3">{col}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr key={index} className="border-b border-slate-100">
                                        {report.config.columns.map(col => <td key={col} className="px-4 py-3">{row[col] ?? 'N/A'}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2 w-full max-w-3xl">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">{report.name}</h2>
                <p className="text-slate-500 mb-6">{report.description}</p>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                    {renderVisualization()}
                </div>
            </div>
        </Modal>
    );
};

export default ReportViewerModal;