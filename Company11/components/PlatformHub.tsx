import React, { useState } from 'react';
import { Facebook, Instagram, MessageSquare, Globe, CheckCircle2, AlertCircle, Key, RefreshCw, Smartphone, Loader2 } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { Modal } from './UIComponents';

interface IntegrationProps {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  icon: React.ReactNode;
  color: string;
  onToggle: (id: string) => void;
}

const IntegrationCard: React.FC<IntegrationProps> = ({ id, name, description, connected, icon, color, onToggle }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
    <div>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${color} text-white`}>
          {icon}
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
          connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {connected ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
          {connected ? 'Active' : 'Inactive'}
        </div>
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-2">{name}</h3>
      <p className="text-gray-500 text-sm mb-6">{description}</p>
    </div>
    
    <button 
      onClick={() => onToggle(id)}
      className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
      connected 
        ? 'border border-gray-200 text-gray-700 hover:bg-gray-50' 
        : 'bg-slate-900 text-white hover:bg-slate-800'
    }`}>
      {connected ? 'Manage Settings' : 'Connect Account'}
    </button>
  </div>
);

const PlatformHub: React.FC = () => {
    const { showToast } = useUI();
    const [apiKey, setApiKey] = useState('sk_live_51Mxxxxxxxxxxxxxxxxxx');
    const [webhookUrl, setWebhookUrl] = useState('https://api.omniscale.com/v1/hooks/catch/12345');
    
    const [connections, setConnections] = useState({
        web: true,
        fb: true,
        ig: false,
        wa: false
    });

    const [modalConfig, setModalConfig] = useState<{isOpen: boolean, id: string | null, type: 'connect' | 'manage' | null}>({
        isOpen: false, id: null, type: null
    });
    const [isConnecting, setIsConnecting] = useState(false);

    const handleToggle = (id: string) => {
        const isConnected = connections[id as keyof typeof connections];
        setModalConfig({
            isOpen: true,
            id,
            type: isConnected ? 'manage' : 'connect'
        });
    };

    const handleConnect = () => {
        setIsConnecting(true);
        // Simulate API delay
        setTimeout(() => {
            setConnections(prev => ({ ...prev, [modalConfig.id!]: true }));
            setIsConnecting(false);
            setModalConfig({ isOpen: false, id: null, type: null });
            showToast("Platform connected successfully!", "success");
        }, 1500);
    };

    const handleDisconnect = () => {
         setConnections(prev => ({ ...prev, [modalConfig.id!]: false }));
         setModalConfig({ isOpen: false, id: null, type: null });
         showToast("Platform disconnected", "info");
    };

    const copyApiKey = () => {
        navigator.clipboard.writeText(apiKey);
        showToast("API Key copied to clipboard", "success");
    };

    const regenerateKey = () => {
        const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        setApiKey(newKey);
        showToast("API Key regenerated", "success");
    };

    const updateWebhook = () => {
        showToast("Webhook URL updated successfully", "success");
    };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Multi-Platform Deployment</h2>
        <p className="text-gray-500">Manage your presence across all major channels from a single dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <IntegrationCard 
          id="web"
          name="Website Widget" 
          description="Embed the AI chat assistant directly on your storefront."
          connected={connections.web}
          icon={<Globe size={24} />}
          color="bg-blue-600"
          onToggle={handleToggle}
        />
        <IntegrationCard 
          id="fb"
          name="Facebook Messenger" 
          description="Automate replies to customer inquiries on your FB Page."
          connected={connections.fb}
          icon={<Facebook size={24} />}
          color="bg-[#1877F2]"
          onToggle={handleToggle}
        />
        <IntegrationCard 
          id="ig"
          name="Instagram DM" 
          description="Handle product questions and story replies instantly."
          connected={connections.ig}
          icon={<Instagram size={24} />}
          color="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]"
          onToggle={handleToggle}
        />
        <IntegrationCard 
          id="wa"
          name="WhatsApp Business" 
          description="Send order updates and support via WhatsApp API."
          connected={connections.wa}
          icon={<Smartphone size={24} />}
          color="bg-[#25D366]"
          onToggle={handleToggle}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-100 rounded-lg">
             <Key size={20} className="text-slate-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Custom API Integration</h3>
            <p className="text-gray-500 text-sm">Connect your own backend or third-party tools.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Public API Key</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={apiKey}
                        readOnly
                        className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-600 font-mono focus:outline-none"
                    />
                    <button onClick={copyApiKey} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                        Copy
                    </button>
                    <button onClick={regenerateKey} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                        <RefreshCw size={16} />
                    </button>
                </div>
                <p className="text-xs text-gray-400">Used for client-side SDK initialization.</p>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Webhook URL</label>
                 <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                     <button onClick={updateWebhook} className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                        Update
                    </button>
                </div>
                 <p className="text-xs text-gray-400">We will send POST requests to this URL for subscribed events.</p>
            </div>
        </div>
      </div>

      <Modal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({isOpen: false, id: null, type: null})}
        title={modalConfig.type === 'connect' ? 'Connect Platform' : 'Platform Settings'}
        actionLabel={modalConfig.type === 'connect' ? (isConnecting ? 'Connecting...' : 'Authorize Connection') : undefined}
        onAction={modalConfig.type === 'connect' ? handleConnect : undefined}
        secondaryActionLabel={modalConfig.type === 'manage' ? 'Disconnect' : 'Cancel'}
        onSecondaryAction={modalConfig.type === 'manage' ? handleDisconnect : () => setModalConfig({isOpen: false, id: null, type: null})}
      >
        {modalConfig.type === 'connect' ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                    {isConnecting ? <Loader2 className="animate-spin text-blue-600" size={32} /> : <Globe size={32} className="text-slate-400"/>}
                </div>
                <p className="text-center text-gray-600">
                    You are about to redirect to the provider to authorize OmniScale AI.
                </p>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                    <span className="text-green-800 font-medium text-sm">Status</span>
                    <span className="text-green-700 font-bold text-sm flex items-center gap-1"><CheckCircle2 size={14}/> Connected</span>
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Configuration</label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                        Auto-Reply enabled for all incoming messages.
                    </div>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default PlatformHub;