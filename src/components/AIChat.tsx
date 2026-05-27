import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage, AssessmentState } from '../types';

interface AIChatProps {
  onStateUpdate: (newState: Partial<AssessmentState>) => void;
  currentState: AssessmentState;
}

export default function AIChat({ onStateUpdate, currentState }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `Welcome to CPORT IMMIGRATION AI. I am your professional consultation assistant for Canadian Entrepreneur Immigration pathways. To provide an accurate preliminary assessment, I will need to ask you a series of questions. Let's start with your country of citizenship and your current country of residence.`,
        timestamp: new Date()
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          state: currentState
        })
      });

      if (!response.ok) throw new Error("Failed to chat");

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Update state if new data was extracted
      if (data.extractedData && Object.keys(data.extractedData).length > 0) {
        onStateUpdate(data.extractedData);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but I am having trouble connecting to my assessment engine right now. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Bot className="w-5 h-5 text-cport-navy-light" />
            AI Consultation Session
          </h2>
          <p className="text-sm text-slate-500">Live preliminary assessment</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-medium text-slate-600">Secure AI Core Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#FAFAFA]">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-cport-navy'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-slate-600" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-cport-navy text-white rounded-tr-sm shadow-sm' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-cport-navy flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 rounded-tl-sm shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                </div>
             </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your response here..."
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-cport-navy focus:ring-1 focus:ring-cport-navy transition-all shadow-sm bg-slate-50 text-slate-800"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 rounded-lg bg-cport-navy text-white hover:bg-cport-navy-light disabled:opacity-50 disabled:hover:bg-cport-navy transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-3">
          AI assessments are preliminary and do not constitute legal advice.
        </p>
      </div>
    </div>
  );
}
