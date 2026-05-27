import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, CheckCircle2 } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadModal({ isOpen, onClose }: LeadModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', country: '', date: '', time: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    // In a real app, this would send data to the backend
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 1 ? (
            <div className="p-8 pb-10">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Book Strategic Consultation</h2>
                <p className="text-slate-500 text-sm">Unlock your full comprehensive report and speak directly with one of our business immigration strategists.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Full Name</label>
                  <input required type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cport-navy focus:border-cport-navy outline-none transition-all" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Email Address</label>
                  <input required type="email" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cport-navy focus:border-cport-navy outline-none transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Phone Number</label>
                    <input required type="tel" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cport-navy focus:border-cport-navy outline-none transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Country</label>
                    <input required type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cport-navy focus:border-cport-navy outline-none transition-all" />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" /> Select Availability
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input required type="date" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 outline-none text-sm text-slate-600" />
                    <select required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 outline-none text-sm text-slate-600 bg-white">
                      <option value="">Time</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full mt-4 bg-cport-navy hover:bg-cport-navy-light text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                  Confirm Booking
                </button>
              </form>
            </div>
          ) : (
            <div className="p-8 py-16 text-center">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed</h2>
              <p className="text-slate-500 mb-8">A strategist will review your custom AI assessment diagnostic and contact you shortly. A confirmation email has been dispatched.</p>
              <button onClick={onClose} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-8 rounded-lg transition-colors">
                Return to Dashboard
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
