import React, { useState } from 'react';
import { AssessmentState } from './types';
import AIChat from './components/AIChat';
import LiveDashboard from './components/LiveDashboard';
import LeadModal from './components/LeadModal';
import AdminDashboard from './components/AdminDashboard';
import { ShieldCheck, Settings, RefreshCw } from 'lucide-react';

export default function App() {
  const [assessmentState, setAssessmentState] = useState<AssessmentState>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleStateUpdate = (newState: Partial<AssessmentState>) => {
    setAssessmentState(prev => ({ ...prev, ...newState }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
        {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm print:hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cport-navy rounded flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-wide text-cport-navy">CPORT IMMIGRATION AI</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs font-bold text-slate-400 tracking-widest hidden md:block border border-slate-200 px-3 py-1 rounded-full">ENTREPRENEUR ASSESSMENT PLATFORM</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.location.reload()} 
                className="flex items-center gap-2 text-slate-500 hover:text-cport-navy transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 text-sm font-medium"
                title="Start Over"
              >
                 <RefreshCw className="w-4 h-4" />
                 <span className="hidden sm:inline">Start Over</span>
              </button>
              <button 
                onClick={() => setIsAdminOpen(true)} 
                className="flex items-center gap-2 text-slate-500 hover:text-cport-navy transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 text-sm font-medium"
              >
                 <Settings className="w-4 h-4" />
                 <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Split Layout */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 h-[calc(100vh-4rem)] overflow-hidden print:h-auto print:overflow-visible">
        
        {/* Left Panel: Chat Interface */}
        <section className="flex-1 lg:max-w-[45%] flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 print:hidden">
          <AIChat onStateUpdate={handleStateUpdate} currentState={assessmentState} />
        </section>

        {/* Right Panel: Live Dashboard */}
        <section className="flex-1 lg:max-w-[55%] h-full overflow-hidden rounded-2xl print:max-w-full print:w-full print:overflow-visible">
          <LiveDashboard state={assessmentState} onBookConsultation={() => setIsModalOpen(true)} />
        </section>

      </main>

      <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
}
