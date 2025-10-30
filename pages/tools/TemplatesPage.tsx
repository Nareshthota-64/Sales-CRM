import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import PlusIcon from '../../components/icons/PlusIcon';
import Wand2Icon from '../../components/icons/Wand2Icon';
import CopyIcon from '../../components/icons/CopyIcon';

const initialTemplates = {
  email: [
    { id: 'e1', name: 'Initial Cold Outreach', subject: 'Introduction from BDE AI', content: 'Hi [Name], I came across your company...' },
    { id: 'e2', name: 'Post-Demo Follow-Up', subject: 'Following our demo', content: 'Hi [Name], Thanks for your time today...' },
    { id: 'e3', name: 'Re-engagement (30 days)', subject: 'Checking In', content: 'Hi [Name], Just wanted to gently follow up...' },
  ],
  'call-scripts': [
    { id: 'c1', name: 'Discovery Call Opener', subject: '', content: 'Hi, this is [Your Name] from BDE AI. The reason for my call is...' },
    { id: 'c2', name: 'Voicemail Script', subject: '', content: 'Hi [Name], sorry I missed you. I was calling because...' },
  ],
};

type TemplateCategory = 'email' | 'call-scripts';

const TemplatesPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<TemplateCategory>('email');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');

    const handleGenerate = () => {
        if (!prompt) return;
        setIsGenerating(true);
        setTimeout(() => {
            setGeneratedContent(`Based on your prompt "${prompt}", here is a generated template:\n\nSubject: A tailored solution for [Company Name]\n\nHi [Contact Name],\n\nI hope this email finds you well. I'm reaching out because I noticed your recent work in [Industry/Project], and it's clear that innovation is a top priority for your team.\n\nAt [Your Company], we specialize in [Your Solution], which helps companies like yours achieve [Key Benefit].\n\nWould you be open to a brief chat next week to explore how we might be able to assist with your goals?\n\nBest regards,\n[Your Name]`);
            setIsGenerating(false);
        }, 1500);
    };
  
    const openModal = () => {
      setPrompt('');
      setGeneratedContent('');
      setIsModalOpen(true);
    };

    return (
    <div className="space-y-8">
      <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Template Library</h1>
          <p className="text-slate-500 mt-1">Create, manage, and reuse content to streamline your workflow.</p>
        </div>
        <Button onClick={openModal} leftIcon={<PlusIcon className="w-4 h-4" />}>
          Create New Template
        </Button>
      </header>

      <main className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="border-b border-slate-200 mb-6">
          <nav className="-mb-px flex gap-6">
            <button onClick={() => setActiveCategory('email')} className={`py-3 px-1 border-b-2 font-semibold ${activeCategory === 'email' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              Email Templates
            </button>
            <button onClick={() => setActiveCategory('call-scripts')} className={`py-3 px-1 border-b-2 font-semibold ${activeCategory === 'call-scripts' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              Call Scripts
            </button>
          </nav>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialTemplates[activeCategory].map((template, index) => (
            <div key={template.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: `${200 + index * 50}ms` }}>
              <h3 className="font-bold text-slate-800">{template.name}</h3>
              {template.subject && <p className="text-sm font-semibold text-slate-600 mt-1">Subject: {template.subject}</p>}
              <p className="text-sm text-slate-500 mt-3 line-clamp-3">{template.content}</p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <Button size="sm" variant="secondary">Edit</Button>
                <Button size="sm" variant="secondary" leftIcon={<CopyIcon className="w-4 h-4" />}>Copy</Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-2">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">New Template</h2>
            <p className="text-slate-500 mb-6">Create a new template or generate one with AI.</p>
            <div className="space-y-4">
                <input type="text" placeholder="Template Name" className="w-full p-3 bg-slate-100 rounded-lg text-sm" />
                <input type="text" placeholder="Subject (for emails)" className="w-full p-3 bg-slate-100 rounded-lg text-sm" />
                <textarea rows={5} placeholder="Template content..." value={generatedContent} onChange={e => setGeneratedContent(e.target.value)} className="w-full p-3 bg-slate-100 rounded-lg text-sm" />
                
                <div className="p-4 bg-indigo-50/70 rounded-lg">
                    <label className="font-semibold text-indigo-800 block mb-2">Generate with AI</label>
                    <div className="flex gap-2">
                        <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Enter a prompt, e.g., 'a friendly check-in'" className="flex-1 p-2 bg-white rounded-lg text-sm border border-indigo-200" />
                        <Button onClick={handleGenerate} isLoading={isGenerating} leftIcon={<Wand2Icon className="w-4 h-4"/>}>Generate</Button>
                    </div>
                </div>
            </div>
            <div className="pt-6 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsModalOpen(false)}>Save Template</Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default TemplatesPage;