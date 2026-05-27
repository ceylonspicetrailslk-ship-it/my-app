import React, { useState } from 'react';
import { ShieldCheck, UserCircle, Users, BarChart3, Settings, Database, LogOut, ChevronRight } from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('leads');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuthenticated(true);
    else alert('Invalid credentials');
  };

  const leads = [
    { id: 1, name: 'Jean-Luc Picard', country: 'France', date: '2023-11-20', status: 'Consultation Booked', type: 'Ontario Entrepreneur' },
    { id: 2, name: 'Sarah Chen', country: 'Singapore', date: '2023-11-19', status: 'Report Downloaded', type: 'BC Regional' },
    { id: 3, name: 'Marco Silva', country: 'Brazil', date: '2023-11-18', status: 'Contacted', type: 'PEI Work Permit' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400">✕</button>
            <div className="w-12 h-12 bg-cport-navy rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-center text-slate-800 mb-6">CPORT Admin</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-cport-navy"
              />
              <button type="submit" className="w-full py-3 bg-cport-navy text-white font-semibold rounded-lg hover:bg-cport-navy-light">
                Login Securely
              </button>
            </form>
            <p className="text-center text-xs text-slate-400 mt-4">Demo pswd: admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F7FC] flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-cport-navy text-white flex flex-col">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10">
          <ShieldCheck className="w-6 h-6 text-cport-light" />
          <span className="font-bold tracking-wider">CPORT ADMIN</span>
        </div>
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1">
            {[
              { id: 'leads', icon: Users, label: 'Lead Management' },
              { id: 'analytics', icon: BarChart3, label: 'Assessments & Data' },
              { id: 'criteria', icon: Database, label: 'Province Criteria' },
              { id: 'settings', icon: Settings, label: 'System Settings' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors \${activeTab === item.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => { setIsAuthenticated(false); onClose(); }} className="w-full flex items-center gap-3 px-2 py-2 text-sm text-slate-300 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Exit Console
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-slate-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-green-500"></span>
             <span className="text-sm font-medium text-slate-600 border-r border-slate-200 pr-4">AI Core Connected</span>
             <UserCircle className="w-8 h-8 text-slate-400 ml-2" />
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'leads' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-semibold text-slate-800">Recent Assessments & Leads</h3>
                <button className="text-sm text-cport-navy font-medium px-4 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Export CSV</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Origin</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Pathway Target</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">{lead.name}</td>
                        <td className="px-6 py-4">{lead.country}</td>
                        <td className="px-6 py-4">{lead.date}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {lead.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \${lead.status.includes('Booked') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-700'}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-cport-navy hover:text-cport-navy-light flex items-center gap-1 text-xs font-semibold">
                            Details <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab !== 'leads' && (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-500 text-sm">
               This administration module is designated for authenticated CPORT personnel only. Configure backend adapters to view data.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
