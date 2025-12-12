import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Shield, Truck, CreditCard, Sparkles, ChevronRight } from 'lucide-react';

const Services: React.FC = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-white mb-6"
          >
            Services Premium
          </motion.h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Au-delà de la vente, nous proposons une suite de services haut de gamme pour entretenir, protéger et améliorer votre expérience de propriétaire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <ServiceCard 
            icon={Wrench}
            title="Optimisation Performance"
            description="Maintenance experte et améliorations de performance pour véhicules haut de gamme. Techniciens certifiés."
            delay={0}
            image="https://images.unsplash.com/photo-1626668893632-6f39379f722b?q=80&w=2070&auto=format&fit=crop"
          />

          <ServiceCard 
            icon={Shield}
            title="Garantie & Protection"
            description="Forfaits de garantie prolongée, protection pneus & jantes, et assurance GAP pour votre tranquillité d'esprit."
            delay={0.1}
            image="https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=2070&auto=format&fit=crop"
          />

          <ServiceCard 
            icon={CreditCard}
            title="Financement Sur Mesure"
            description="Solutions de leasing et de financement personnalisées adaptées à votre situation financière unique."
            delay={0.2}
            image="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop"
          />

          <ServiceCard 
            icon={Truck}
            title="Transport Fermé"
            description="Expédition de véhicules nationale et internationale dans des transporteurs fermés sécurisés et climatisés."
            delay={0.3}
            image="https://images.unsplash.com/photo-1566471677271-925916027178?q=80&w=2070&auto=format&fit=crop"
          />

          <ServiceCard 
            icon={Sparkles}
            title="Detailing & PPF"
            description="Correction de peinture, traitement céramique et installation de film de protection de peinture (PPF)."
            delay={0.4}
            image="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop"
          />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-dark-900 rounded-2xl p-8 border border-dark-800 flex flex-col justify-center items-center text-center group hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden h-full min-h-[360px]"
          >
             <div className="relative z-10">
               <span className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                 <ChevronRight className="w-8 h-8 text-primary" />
               </span>
               <h3 className="text-2xl font-bold text-white mb-3">Demande Spéciale ?</h3>
               <p className="text-slate-400 mb-6 text-sm max-w-xs mx-auto">Contactez notre équipe de conciergerie pour des besoins spécifiques non listés ici.</p>
               <button className="px-6 py-2 rounded-full border border-dark-700 bg-dark-950 text-white font-medium hover:bg-primary hover:border-primary transition-all">
                  Contacter la Conciergerie
               </button>
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-900 to-dark-900 z-0" />
          </motion.div>

        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ icon: Icon, title, description, delay, image }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="bg-dark-900 rounded-2xl overflow-hidden border border-dark-800 hover:border-primary/50 transition-colors hover:shadow-2xl hover:shadow-primary/10 group flex flex-col"
  >
    <div className="relative h-48 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent z-10" />
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
      />
      <div className="absolute bottom-4 left-6 z-20 w-10 h-10 bg-primary/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    
    <div className="p-6 flex-grow flex flex-col">
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
        {description}
      </p>
      <button className="text-primary text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all mt-auto">
        En Savoir Plus <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

export default Services;