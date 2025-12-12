import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ArrowRight, Car, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentUser, saveExchangeRequest } from '../utils/storage';
import { User } from '../types';
import AuthModal from '../components/AuthModal';

const Exchange: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    year: '',
    make: '',
    model: '',
    mileage: '',
    vin: '',
    desiredVehicle: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      // Pre-fill contact info if user is logged in
      setFormData(prev => ({
        ...prev,
        contactName: user.name,
        contactEmail: user.email
      }));
    }
  }, [authOpen]); // Re-check when auth modal might have closed

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security Check
    if (!currentUser) {
      setAuthOpen(true);
      return;
    }

    // Save Logic
    saveExchangeRequest({
      userId: currentUser.id,
      userName: formData.contactName,
      userEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      currentVehicle: {
        year: formData.year,
        make: formData.make,
        model: formData.model,
        mileage: formData.mileage,
        vin: formData.vin
      },
      desiredVehicle: formData.desiredVehicle
    });

    setSubmitSuccess(true);
    // Reset form partially
    setFormData(prev => ({ ...prev, year: '', make: '', model: '', mileage: '', vin: '', desiredVehicle: '' }));
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 border border-primary/20"
          >
            <RefreshCw className="w-4 h-4" /> Programme de Reprise
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-white mb-6"
          >
            Améliorez Votre Véhicule
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Appliquez la valeur de votre véhicule actuel à n'importe quelle voiture de notre inventaire. Économisez et profitez d'une transition fluide.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Exchange Form */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-dark-900 p-8 rounded-3xl border border-dark-800 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Demande de Reprise</h3>
              
              {submitSuccess ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Demande Envoyée !</h3>
                  <p className="text-slate-400 mb-6">
                    Votre demande de reprise a été enregistrée. Vous pouvez suivre son statut dans votre espace client.
                  </p>
                  <Link 
                    to="/dashboard" 
                    className="inline-block px-6 py-2 bg-dark-800 text-white rounded-xl hover:bg-dark-700 transition-colors"
                  >
                    Aller à Mon Espace
                  </Link>
                  <button 
                    onClick={() => setSubmitSuccess(false)}
                    className="block w-full mt-4 text-sm text-slate-500 hover:text-white"
                  >
                    Nouvelle demande
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Current Vehicle Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-dark-800 pb-2 mb-4">Votre Véhicule</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Année</label>
                        <input name="year" required value={formData.year} onChange={handleInputChange} type="text" className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="2020" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Marque</label>
                        <input name="make" required value={formData.make} onChange={handleInputChange} type="text" className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="Porsche" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Modèle</label>
                        <input name="model" required value={formData.model} onChange={handleInputChange} type="text" className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="911 Carrera" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Kilométrage</label>
                        <input name="mileage" required value={formData.mileage} onChange={handleInputChange} type="text" className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="12 500" />
                      </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">VIN (Optionnel)</label>
                        <input name="vin" value={formData.vin} onChange={handleInputChange} type="text" className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary uppercase" placeholder="VIN à 17 Chiffres" />
                    </div>
                  </div>

                  {/* Desired Vehicle Section */}
                  <div className="space-y-4 pt-4">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-dark-800 pb-2 mb-4">Intéressé Par</h4>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Véhicule d'Intérêt</label>
                        <select name="desiredVehicle" required value={formData.desiredVehicle} onChange={handleInputChange} className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary">
                          <option value="">Sélectionnez dans l'inventaire...</option>
                          <option value="2024 Hyperion X GT">2024 Hyperion X GT</option>
                          <option value="2023 Porsche 911 Carrera S">2023 Porsche 911 Carrera S</option>
                          <option value="2023 Tesla Model S Plaid">2023 Tesla Model S Plaid</option>
                          <option value="2022 Mercedes-Benz AMG GT">2022 Mercedes-Benz AMG GT</option>
                          <option value="2024 Audi RS7 Sportback">2024 Audi RS7 Sportback</option>
                          <option value="Autre">Autre (Préciser lors du contact)</option>
                        </select>
                    </div>
                  </div>

                  {/* Contact Info - Read only if logged in, but phone is editable */}
                  <div className="space-y-4 pt-4">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-dark-800 pb-2 mb-4">Infos Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Nom</label>
                        <input name="contactName" value={formData.contactName} onChange={handleInputChange} disabled={!!currentUser} type="text" className={`w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary ${currentUser ? 'opacity-60' : ''}`} placeholder="Jean Dupont" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                        <input name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} disabled={!!currentUser} type="email" className={`w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary ${currentUser ? 'opacity-60' : ''}`} placeholder="jean@exemple.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Téléphone</label>
                      <input name="contactPhone" required value={formData.contactPhone} onChange={handleInputChange} type="tel" className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="06 12 34 56 78" />
                    </div>
                  </div>

                  {!currentUser && (
                    <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-xl border border-primary/20">
                      <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300">
                        Vous devez avoir un compte client pour soumettre une demande. En cliquant ci-dessous, vous serez invité à vous connecter ou à créer un compte.
                      </p>
                    </div>
                  )}

                  <button className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-violet-600 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-6">
                    {currentUser ? 'Soumettre la Demande' : 'Se Connecter & Soumettre'} <ArrowRight className="w-5 h-5" />
                  </button>

                </form>
              )}
            </motion.div>
          </div>

          {/* Sidebar / Info */}
          <div className="lg:col-span-5 space-y-8">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.3 }}
               className="bg-dark-900 p-8 rounded-3xl border border-dark-800"
             >
               <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                 <Car className="w-7 h-7 text-primary" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-4">Avantage Fiscal</h3>
               <p className="text-slate-400 leading-relaxed mb-6">
                 Lorsque vous échangez votre véhicule avec AutoLuxe, vous ne payez la taxe de vente que sur la différence de prix entre votre nouvelle voiture et la valeur de reprise. Cela peut vous faire économiser des milliers d'euros.
               </p>
               <div className="bg-dark-950 p-4 rounded-xl border border-dark-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-sm">Prix Nouvelle Voiture</span>
                    <span className="text-white font-bold">100 000 €</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-sm">Valeur de Reprise</span>
                    <span className="text-green-500 font-bold">- 60 000 €</span>
                  </div>
                  <div className="border-t border-dark-800 my-2 pt-2 flex justify-between items-center">
                    <span className="text-slate-300 text-sm font-bold">Montant Taxable</span>
                    <span className="text-white font-bold">40 000 €</span>
                  </div>
               </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4 }}
               className="relative p-8 rounded-3xl text-white overflow-hidden h-full min-h-[300px] flex flex-col justify-center border border-dark-800"
             >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1583121274602-3e2820c698d9?q=80&w=2070&auto=format&fit=crop" 
                    alt="Luxury Garage" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-dark-950/90 to-primary/20" />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">Parcourir l'Inventaire</h3>
                  <p className="text-slate-200 mb-8 max-w-xs">Trouvez votre prochaine voiture de rêve avant l'échange. Notre collection vous attend.</p>
                  <Link to="/catalog" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-violet-600 transition-colors shadow-lg shadow-primary/25">
                    Voir le Catalogue <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
             </motion.div>
          </div>

        </div>
      </div>

      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        initialMode="login"
      />
    </div>
  );
};

export default Exchange;
