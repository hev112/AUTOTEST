import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => {
      setIsSubmitted(true);
      setFormState({ name: '', email: '', phone: '', message: '' });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Contactez-nous</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Intéressé par un véhicule ? Planifiez un essai ou posez-nous vos questions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Contact Info & Map */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-dark-900 border border-dark-800 rounded-2xl">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-white font-bold mb-2">Appelez-nous</h3>
                <p className="text-slate-400">+33 1 23 45 67 89</p>
                <p className="text-slate-500 text-sm mt-1">Lun-Sam, 9h - 19h</p>
              </div>

              <div className="p-6 bg-dark-900 border border-dark-800 rounded-2xl">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-white font-bold mb-2">Email</h3>
                <p className="text-slate-400">ventes@autoluxe.fr</p>
                <p className="text-slate-500 text-sm mt-1">Support en ligne 24/7</p>
              </div>
            </div>

            <div className="p-6 bg-dark-900 border border-dark-800 rounded-2xl">
               <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">Visitez Notre Showroom</h3>
                    <p className="text-slate-400">123 Avenue des Champs-Élysées, Paris, France 75008</p>
                  </div>
               </div>
               {/* Location Image */}
               <div className="w-full h-64 bg-dark-800 rounded-xl overflow-hidden relative group border border-dark-800">
                  <img 
                    src="https://images.unsplash.com/photo-1562519819-016930b66355?q=80&w=2070&auto=format&fit=crop" 
                    alt="Showroom de Luxe" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 pointer-events-none">
                     <p className="text-white font-bold text-sm bg-primary/90 px-3 py-1 rounded-full backdrop-blur-sm inline-block">
                        Siège Paris
                     </p>
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-900 p-8 rounded-3xl border border-dark-800 shadow-xl"
          >
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckIcon className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Envoyé !</h3>
                <p className="text-slate-400 mb-6">Merci de nous avoir contactés. L'un de nos agents vous répondra sous peu.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2 bg-dark-800 text-white rounded-lg hover:bg-dark-700 transition-colors"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Nom Complet</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Jean Dupont"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Adresse Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="jean@exemple.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Numéro de Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="01 23 45 67 89"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                    placeholder="Je suis intéressé par la Porsche 911..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-blue-600 transition-all transform active:scale-95 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                >
                  Envoyer le Message <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Helper component for check icon
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export default Contact;