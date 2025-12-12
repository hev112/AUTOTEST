import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, AlertCircle, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser, checkEmailExists } from '../utils/storage';
import { sendMockEmail } from '../utils/mailServer';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [step, setStep] = useState<'input' | 'verify'>('input');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Verification State
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [pendingData, setPendingData] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setMode(initialMode);
    setStep('input');
    setError('');
    setVerificationCode('');
    setGeneratedCode('');
    setPendingData(null);
    setIsLoading(false);
  }, [initialMode, isOpen]);

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Tous les champs sont requis.');
      return;
    }

    if (checkEmailExists(email)) {
      setError('Cet email est déjà utilisé.');
      return;
    }

    setIsLoading(true);

    // Generate Code Client Side
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    // Simulate Network Request & Email
    await sendMockEmail(
        email, 
        'Votre code de vérification AutoLuxe',
        `Bonjour ${name}, votre code de vérification est : ${code}`
    );
    
    setIsLoading(false);
    setPendingData({ name, email, password });
    setStep('verify');
  };

  const handleVerifyAndRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode !== generatedCode) {
      setError('Code incorrect. Veuillez réessayer.');
      return;
    }

    const result = registerUser(pendingData.name, pendingData.email, pendingData.password);
    if (result.success) {
      onClose();
      navigate('/dashboard');
    } else {
      setError(result.message || 'Erreur lors de l\'inscription.');
      setStep('input');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email et mot de passe requis.');
      return;
    }
    const result = loginUser(email, password);
    if (result.success) {
      onClose();
      navigate('/dashboard');
    } else {
      setError(result.message || 'Erreur de connexion.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (mode === 'signup') {
      if (step === 'input') {
        handleSendVerification(e);
      } else {
        handleVerifyAndRegister(e);
      }
    } else {
      handleLogin(e);
    }
  };

  const resendCode = async () => {
    setError('');
    setIsLoading(true);
    // Reuse generated code or generate new one
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    
    await sendMockEmail(
        email, 
        'Votre code de vérification AutoLuxe',
        `Bonjour ${name}, votre nouveau code de vérification est : ${code}`
    );
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-dark-900 border border-dark-800 rounded-3xl shadow-2xl overflow-hidden my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-dark-800">
                <div className="flex items-center gap-3">
                   {step === 'verify' && (
                     <button onClick={() => setStep('input')} className="text-slate-400 hover:text-white transition-colors">
                       <ArrowLeft className="w-5 h-5" />
                     </button>
                   )}
                   <h2 className="text-xl font-bold text-white">
                     {mode === 'login' ? 'Bon Retour' : (step === 'verify' ? 'Vérification' : 'Créer un Compte')}
                   </h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-white hover:bg-dark-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {mode === 'signup' && step === 'verify' ? (
                    /* VERIFICATION STEP */
                    <div className="text-center">
                       <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ShieldCheck className="w-8 h-8 text-primary" />
                       </div>
                       <p className="text-slate-300 text-sm mb-6">
                         Nous avons envoyé un code de confirmation à <span className="text-white font-bold">{email}</span>.
                         Regardez la notification en haut à droite (Mode Démo).
                       </p>
                       
                       <input 
                          type="text" 
                          maxLength={6}
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="000000"
                          className="w-full bg-dark-950 border border-dark-800 rounded-xl py-4 text-center text-2xl font-bold tracking-[0.5em] text-white focus:outline-none focus:border-primary transition-colors mb-4"
                          autoFocus
                        />
                        
                        <div className="text-sm text-slate-400 mb-6">
                           Vous n'avez rien reçu ? <button type="button" onClick={resendCode} className="text-primary hover:underline font-bold" disabled={isLoading}>{isLoading ? 'Envoi...' : 'Renvoyer'}</button>
                        </div>
                    </div>
                  ) : (
                    /* INPUT STEPS */
                    <>
                      {mode === 'signup' && (
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nom Complet</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input 
                              type="text" 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Jean Dupont"
                              className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Adresse Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="vous@exemple.com"
                            className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mot de Passe</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-medium">
                      <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-primary hover:bg-violet-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {mode === 'login' ? 'Se Connecter' : (step === 'verify' ? 'Confirmer' : 'S\'inscrire')} <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-400">
                  {mode === 'login' ? "Pas encore de compte ?" : "Vous avez déjà un compte ?"}{' '}
                  <button 
                    onClick={() => {
                      setMode(mode === 'login' ? 'signup' : 'login');
                      setStep('input');
                      setError('');
                    }}
                    className="text-primary font-bold hover:underline"
                  >
                    {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;