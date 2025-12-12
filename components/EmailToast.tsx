import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Globe } from 'lucide-react';
import { Email } from '../utils/mailServer';

const EmailToast: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);

  useEffect(() => {
    const handleEmail = (e: Event) => {
      const customEvent = e as CustomEvent<Email>;
      const newEmail = customEvent.detail;
      setEmails(prev => [...prev, newEmail]);
      
      // Auto dismiss after 15 seconds so user has time to copy code
      setTimeout(() => {
        removeEmail(newEmail.id);
      }, 15000);
    };

    window.addEventListener('incoming-email', handleEmail);
    return () => window.removeEventListener('incoming-email', handleEmail);
  }, []);

  const removeEmail = (id: string) => {
    setEmails(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="fixed top-24 right-4 z-[200] flex flex-col gap-3 pointer-events-none font-sans">
      <AnimatePresence>
        {emails.map(email => (
          <motion.div
            key={email.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="bg-white/95 backdrop-blur-md text-slate-900 w-80 md:w-96 rounded-xl shadow-2xl overflow-hidden pointer-events-auto border border-slate-200 ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 rounded p-1">
                   <Mail className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-bold text-slate-600">Mail System</span>
                <span className="text-[10px] text-slate-400">• maintenant</span>
              </div>
              <button onClick={() => removeEmail(email.id)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                 <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-lg">
                    🏎️
                 </div>
                 <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">{email.subject}</h4>
                    <p className="text-xs text-slate-500">De: {email.from}</p>
                    <p className="text-xs text-slate-500">À: {email.to}</p>
                 </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-sm text-slate-700 font-medium leading-relaxed">
                {email.body.includes("Code") ? (
                    <>
                        <p className="mb-1">Votre code de vérification est :</p>
                        <p className="text-2xl font-bold text-primary tracking-widest my-2 select-all">{email.body.replace(/[^0-9]/g, '')}</p>
                        <p className="text-xs text-slate-400">Ne partagez ce code avec personne.</p>
                    </>
                ) : (
                    email.body
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default EmailToast;
