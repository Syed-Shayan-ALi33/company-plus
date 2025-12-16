import React, { useState } from 'react';
import { Workflow, Plus, GitBranch, MessageSquare, Zap, PlayCircle } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { Modal } from './UIComponents';

const FlowCard: React.FC<{ title: string; triggers: number; steps: number; active: boolean }> = ({ title, triggers, steps, active }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Workflow size={20} />
      </div>
      <div className={`w-3 h-3 rounded-full ${active ? 'bg-green-500' : 'bg-gray-300'}`} />
    </div>
    <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
    <div className="flex gap-4 text-xs text-gray-500 mt-3">
        <div className="flex items-center gap-1">
            <Zap size={12} />
            <span>{triggers} triggers</span>
        </div>
        <div className="flex items-center gap-1">
            <GitBranch size={12} />
            <span>{steps} steps</span>
        </div>
    </div>
  </div>
);

const FlowBuilder: React.FC = () => {
  const { showToast } = useUI();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');
  const [autoPilotEnabled, setAutoPilotEnabled] = useState(true);

  const handleCreateFlow = () => {
    if (!newFlowName.trim()) {
        showToast("Please enter a flow name", "error");
        return;
    }
    showToast(`Flow "${newFlowName}" created successfully`, "success");
    setNewFlowName('');
    setIsCreateOpen(false);
  };

  const toggleAutoPilot = () => {
      const newState = !autoPilotEnabled;
      setAutoPilotEnabled(newState);
      showToast(`AI Auto-Pilot ${newState ? 'Enabled' : 'Disabled'}`, newState ? 'success' : 'info');
  };

  return (
    <div className="space-y-8 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Conversation Flows</h2>
          <p className="text-gray-500">Design unlimited automated response paths for your customers.</p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md shadow-blue-200 transition-all"
        >
          <Plus size={18} />
          Create New Flow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 text-white flex items-center justify-between shadow-xl">
            <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Zap className="text-yellow-400" />
                    AI Auto-Pilot Mode
                </h3>
                <p className="text-slate-300 max-w-xl">
                    Instead of manual flows, let Gemini 2.5 determine the best path for customer inquiries based on historical data and sentiment analysis.
                </p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm">
                <span className="text-sm font-semibold">{autoPilotEnabled ? 'Enabled' : 'Disabled'}</span>
                <div 
                  onClick={toggleAutoPilot}
                  className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${autoPilotEnabled ? 'bg-green-500' : 'bg-gray-500'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${autoPilotEnabled ? 'right-1' : 'left-1'}`}></div>
                </div>
            </div>
        </div>

        <FlowCard title="Abandoned Cart Recovery" triggers={2} steps={4} active={true} />
        <FlowCard title="New Customer Welcome" triggers={1} steps={3} active={true} />
        <FlowCard title="Order Status Lookup" triggers={3} steps={5} active={true} />
        <FlowCard title="Product Recommendation" triggers={2} steps={6} active={false} />
        <FlowCard title="Support Ticket Escalation" triggers={4} steps={8} active={true} />
        <FlowCard title="Post-Purchase Feedback" triggers={1} steps={2} active={false} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center border-dashed">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
             <Workflow size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Visual Flow Editor</h3>
        <p className="text-gray-500 max-w-md mb-6">Drag and drop message blocks, logic gates, and API actions to build complex automation flows.</p>
        <button 
          onClick={() => showToast("Opening tutorial video...", "info")}
          className="text-blue-600 font-medium hover:underline flex items-center gap-2"
        >
            <PlayCircle size={18} />
            Watch Tutorial
        </button>
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Flow"
        actionLabel="Create Flow"
        onAction={handleCreateFlow}
        secondaryActionLabel="Cancel"
      >
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flow Name</label>
              <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Holiday Promotion"
                  value={newFlowName}
                  onChange={(e) => setNewFlowName(e.target.value)}
                  autoFocus
              />
          </div>
      </Modal>
    </div>
  );
};

export default FlowBuilder;