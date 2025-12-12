import React from 'react';
import { motion } from 'framer-motion';
import { Search, DollarSign, Clock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sell: React.FC = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              Vendez Votre Voiture <br />
              <span className="text-primary">Offre Instantanée.</span>
            </h1>
            <p className="text-slate-400 text-lg mb-8 max-w-lg">
              Obtenez une offre compétitive pour votre véhicule de luxe en quelques minutes. Nous gérons les papiers, l'enlèvement et le paiement instantanément.
            </p>

            <div className="bg-dark-900 p-6 rounded-2xl border border-dark-800 shadow-xl max-w-md">
              <label className="block text-sm font-medium text-slate-300 mb-2">Entrez le VIN ou la Plaque d'Immatriculation</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="VIN à 17 Chiffres" 
                  className="flex-1 bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all uppercase placeholder:normal-case"
                />
                <button className="bg-primary hover:bg-violet-600 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2">
                  Obtenir une Offre <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Sans engagement. Évaluation 100% gratuite.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl blur-3xl" />
            <img 
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070&auto=format&fit=crop" 
              alt="Luxury Car Front" 
              className="relative rounded-3xl border border-dark-800 shadow-2xl w-full object-cover aspect-[4/3]"
            />
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-dark-900 p-4 rounded-xl border border-dark-800 shadow-xl flex items-center gap-4 hidden md:flex">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Paiement Récent</p>
                <p className="text-white font-bold text-lg">142 500 €</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Steps Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Comment Ça Marche</h2>
            <p className="text-slate-400">Une expérience de vente fluide conçue pour les vendeurs premium.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              icon={Search}
              title="1. Soumettre les Détails"
              description="Entrez le VIN de votre véhicule et partagez quelques photos. Notre système IA analyse le marché instantanément."
              delay={0}
            />
            <StepCard 
              icon={DollarSign}
              title="2. Recevoir une Offre"
              description="Obtenez une offre cash garantie en 30 minutes. Meilleur prix payé pour les modèles à faible kilométrage."
              delay={0.1}
            />
            <StepCard 
              icon={Clock}
              title="3. Paiement Rapide"
              description="Nous venons à vous pour l'inspection et l'enlèvement. Le paiement est viré sur votre compte immédiatement."
              delay={0.2}
            />
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-dark-900 rounded-3xl p-8 md:p-12 border border-dark-800 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Pourquoi Vendre à AutoLuxe ?</h2>
              <div className="space-y-4">
                <Benefit text="Garantie de la meilleure valeur marchande" />
                <Benefit text="Virement bancaire immédiat" />
                <Benefit text="Nous gérons le remboursement de crédit existant" />
                <Benefit text="Enlèvement national gratuit" />
                <Benefit text="Service professionnel haut de gamme" />
              </div>
              <div className="mt-8">
                <Link to="/contact" className="text-primary font-bold hover:text-white transition-colors flex items-center gap-2">
                  Parler à un Spécialiste <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-full min-h-[300px] rounded-2xl overflow-hidden">
               <img 
                src="https://images.unsplash.com/photo-1560252829-804f1aedf1be?q=80&w=2070&auto=format&fit=crop" 
                alt="Remise des clés" 
                className="absolute inset-0 w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const StepCard = ({ icon: Icon, title, description, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="bg-dark-900 p-8 rounded-2xl border border-dark-800 hover:border-primary/50 transition-colors group"
  >
    <div className="w-14 h-14 bg-dark-950 border border-dark-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-7 h-7 text-primary" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">
      {description}
    </p>
  </motion.div>
);

const Benefit = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
      <CheckCircle2 className="w-4 h-4 text-primary" />
    </div>
    <span className="text-slate-300">{text}</span>
  </div>
);

export default Sell;