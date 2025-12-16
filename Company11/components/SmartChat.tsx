import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { createChatSession, sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat } from "@google/genai";
import { useUI } from '../context/UIContext';

const SmartChat: React.FC = () => {
  const { showToast } = useUI();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! I am OmniBot, your enterprise automation assistant. How can I help you manage your stores or analyze your data today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
        chatSessionRef.current = createChatSession();
    } catch (e) {
        console.error("Failed to init chat", e);
        setError("Could not initialize AI. Please check your API Key configuration.");
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    // Check if chat session is initialized
    if (!chatSessionRef.current) {
        try {
             chatSessionRef.current = createChatSession();
        } catch (e) {
             setError("API Key missing or invalid. Please check your environment variables.");
             showToast("API Key configuration error", "error");
             return;
        }
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      const responseText = await sendMessageToGemini(chatSessionRef.current!, userMessage.text);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setError("Failed to get a response. Please try again.");
      showToast("Failed to connect to AI service", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
      setMessages([messages[0]]);
      showToast("Chat history cleared", "info");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">OmniBot AI</h2>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Online • Gemini Powered
            </p>
          </div>
        </div>
        <button 
          onClick={handleClearChat}
          className="text-xs text-gray-500 hover:text-gray-800 underline"
        >
          Clear Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center ${
              msg.role === 'user' ? 'bg-gray-200' : 'bg-blue-100'
            }`}>
              {msg.role === 'user' ? <User size={16} className="text-gray-600" /> : <Bot size={16} className="text-blue-600" />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              <span className={`text-[10px] mt-2 block opacity-70 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot size={16} className="text-blue-600" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        {error && (
            <div className="flex items-center justify-center gap-2 text-red-500 text-sm py-2 bg-red-50 rounded-lg border border-red-100 mx-10">
                <AlertCircle size={16} />
                {error}
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-center">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask OmniBot about your sales, inventory, or generate a customer response..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none max-h-32 min-h-[50px]"
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-2">
          AI generated responses may vary. API usage is subject to quotas.
        </p>
      </div>
    </div>
  );
};

export default SmartChat;