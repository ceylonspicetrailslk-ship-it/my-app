import React from 'react';
import { AssessmentState } from '../types';
import { calculateEligibility, getProvinceMatches, calculateCosts } from '../utils/scoringLogic';
import { motion } from 'framer-motion';
import { ShieldAlert, TrendingUp, Wallet, MapPin, CheckCircle2, AlertCircle, FileText, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface LiveDashboardProps {
  state: AssessmentState;
  onBookConsultation: () => void;
}

export default function LiveDashboard({ state, onBookConsultation }: LiveDashboardProps) {
  const { score, details } = calculateEligibility(state);
  const provinceMatches = getProvinceMatches(state);
  const costs = calculateCosts(state);

  const isInitial = Object.keys(state).length === 0;

  const scoreData = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];
  const COLORS = ['#0A192F', '#E2E8F0'];

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6 pb-20">
      {/* 1. Eligibility Score Module */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Overall Eligibility Score
        </h3>
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-32 h-32 shrink-0">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-800">{score}</span>
              <span className="text-[10px] text-slate-500 font-medium">/ 100</span>
            </div>
          </div>
          
          <div className="flex-1 w-full space-y-3">
            <div className="space-y-1">
               <div className="flex justify-between text-xs font-medium">
                 <span className="text-slate-600">Financial Capacity</span>
                 <span className="text-slate-800">{details.netWorth + details.investment} / 50</span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: `${((details.netWorth + details.investment) / 50) * 100}%` }} className="h-full bg-blue-600 rounded-full" />
               </div>
            </div>
            <div className="space-y-1">
               <div className="flex justify-between text-xs font-medium">
                 <span className="text-slate-600">Business Experience</span>
                 <span className="text-slate-800">{details.experience} / 20</span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: `${(details.experience / 20) * 100}%` }} className="h-full bg-indigo-600 rounded-full" />
               </div>
            </div>
            <div className="space-y-1">
               <div className="flex justify-between text-xs font-medium">
                 <span className="text-slate-600">Language Proficiency</span>
                 <span className="text-slate-800">{details.language} / 20</span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: `${(details.language / 20) * 100}%` }} className="h-full bg-teal-500 rounded-full" />
               </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Province Match Engine */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Province Match Engine
        </h3>
        
        {isInitial ? (
          <div className="text-center py-8 text-slate-400 text-sm">
             Awaiting assessment data to calculate province matches...
          </div>
        ) : provinceMatches.length > 0 ? (
          <div className="space-y-4">
            {provinceMatches.map((match, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm transition-all hover:border-cport-navy/30">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-800">{match.province}</h4>
                  <div className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
                    {match.suitability}% Match
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Min. Investment</span>
                    <span className="font-medium text-slate-700">{match.investment}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Min. Net Worth</span>
                    <span className="font-medium text-slate-700">{match.netWorth}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Language</span>
                    <span className="font-medium text-slate-700">{match.language}</span>
                  </div>
                   <div>
                    <span className="text-slate-500 block mb-0.5">Competition</span>
                    <span className="font-medium text-slate-700">{match.competitive}</span>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              *Program requirements may change. Final eligibility depends on official provincial assessment.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
             <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
             <p className="text-sm text-orange-800">
               Based on the current data, you may not meet the minimum financial or experience requirements for the primary programs. Continue the consultation to explore alternative options.
             </p>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 3. Cost Calculator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-2xl p-6">
          <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase mb-4 flex items-center gap-2">
            <Wallet className="w-4 h-4" /> Cost Calculator
          </h3>
          <div className="space-y-3 pb-4 mb-4 border-b border-slate-100">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Business Investment</span>
              <span className="font-medium">CAD ${costs.investment.toLocaleString()}</span>
            </div>
             <div className="flex justify-between text-sm">
              <span className="text-slate-600">Settlement Funds</span>
              <span className="font-medium">est. CAD ${costs.settlement.toLocaleString()}</span>
            </div>
             <div className="flex justify-between text-sm">
              <span className="text-slate-600">Gov. & Legal Fees</span>
              <span className="font-medium">est. CAD ${(costs.governmentFees + costs.legal).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-800">Total Est. Budget</span>
            <span className="text-lg font-bold text-cport-navy">CAD ${(costs.total).toLocaleString()}</span>
          </div>
        </motion.div>

        {/* 4. Readiness & Risk */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel rounded-2xl p-6">
           <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Application Readiness
          </h3>
          <div className="space-y-4">
             <div className="flex items-center gap-3">
               {details.experience >= 10 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-slate-300" />}
               <span className={`text-sm ${details.experience >= 10 ? 'text-slate-800' : 'text-slate-500'}`}>Business Experience Verified</span>
             </div>
             <div className="flex items-center gap-3">
               {details.netWorth + details.investment >= 20 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-slate-300" />}
               <span className={`text-sm ${details.netWorth + details.investment >= 20 ? 'text-slate-800' : 'text-slate-500'}`}>Financial Capacity Verified</span>
             </div>
             <div className="flex items-center gap-3">
               {details.language >= 15 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-slate-300" />}
               <span className={`text-sm ${details.language >= 15 ? 'text-slate-800' : 'text-slate-500'}`}>Language Threshold Met</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Action Area */}
       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-cport-navy text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl print:hidden">
          <div>
            <h4 className="font-semibold text-lg mb-1">Ready for the Next Step?</h4>
            <p className="text-cport-light text-sm max-w-md">Unlock your full diagnostic report and speak directly with one of our business immigration strategists.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto flex-col sm:flex-row">
            <button onClick={() => window.print()} className="flex-1 sm:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download Report
            </button>
            <button onClick={onBookConsultation} className="flex-1 sm:flex-none px-6 py-2.5 bg-white text-cport-navy hover:bg-slate-100 rounded-lg text-sm font-semibold transition-colors shadow-sm">
              Book Strategy Call
            </button>
          </div>
       </motion.div>

    </div>
  );
}
