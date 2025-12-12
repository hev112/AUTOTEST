import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { getVehicles } from '../utils/storage';
import VehicleCard from '../components/VehicleCard';
import { Vehicle } from '../types';

const Home: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const refreshData = () => {
    setVehicles(getVehicles());
  };

  useEffect(() => {
    // Initial fetch
    refreshData();
    // Listen for storage updates
    window.addEventListener('db-update', refreshData);
    return () => window.removeEventListener('db-update', refreshData);
  }, []);

  const featuredVehicles = vehicles.slice(0, 3);
  const heroVehicles = featuredVehicles.length > 0 ? featuredVehicles : [];

  // Auto slide for hero
  useEffect(() => {
    if (heroVehicles.length === 0) return;
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroVehicles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroVehicles.length]);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center bg-dark-950">
        {heroVehicles.length > 0 ? (
          <>
            {/* Background Slides */}
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentHeroSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 z-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/70 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent z-10" />
                <img
                  src={heroVehicles[currentHeroSlide].images[0]}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Hero Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
              <div className="max-w-3xl">
                <motion.div
                  key={heroVehicles[currentHeroSlide].id + "-text"}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h2 className="text-primary font-bold tracking-widest text-sm uppercase mb-4">
                    Sélection Premium
                  </h2>
                  <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                    {heroVehicles[currentHeroSlide].make} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
                      {heroVehicles[currentHeroSlide].model}
                    </span>
                  </h1>
                  <p className="text-xl text-slate-300 mb-8 max-w-lg leading-relaxed line-clamp-2">
                    {heroVehicles[currentHeroSlide].description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to={`/vehicle/${heroVehicles[currentHeroSlide].id}`}
                      className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                    >
                      Voir Détails <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to="/catalog"
                      className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
                    >
                      Tout le Catalogue
                    </Link>
                  </div>
                </motion.div>
              </div>
              
              {/* Slider Indicators */}
              <div className="absolute bottom-10 right-4 sm:right-6 lg:right-8 flex space-x-2 z-30">
                {heroVehicles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHeroSlide(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      currentHeroSlide === index ? 'w-8 bg-primary' : 'w-2 bg-slate-600'
                    }`}
                    aria-label={`Aller à la diapositive ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-serif font-bold text-white mb-6">Bienvenue chez AutoLuxe</h1>
            <p className="text-slate-400 mb-8">Chargement de l'inventaire...</p>
            <Link 
              to="/admin" 
              className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-blue-700 transition-colors"
            >
               Ajouter un véhicule
            </Link>
          </div>
        )}
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Arrivages en Vedette</h2>
              <p className="text-slate-400">Sélectionnés pour leur performance et leur condition.</p>
            </motion.div>
            
            <Link to="/catalog" className="hidden md:flex items-center text-primary hover:text-white transition-colors gap-1 group">
              Voir tout l'inventaire <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.length > 0 ? (
               featuredVehicles.map((vehicle, index) => (
               <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
               >
                 <VehicleCard vehicle={vehicle} />
               </motion.div>
            ))
            ) : (
               <div className="col-span-full py-12 text-center text-slate-500 bg-dark-900 rounded-2xl border border-dark-800">
                 <p>Aucun véhicule en vedette pour le moment.</p>
               </div>
            )}
          </div>
           
           <div className="mt-12 text-center md:hidden">
              <Link to="/catalog" className="inline-flex items-center text-primary hover:text-white transition-colors gap-1">
                Voir tout l'inventaire <ChevronRight className="w-4 h-4" />
              </Link>
           </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-dark-900 border-y border-dark-800 relative overflow-hidden">
        {/* Background Texture Image */}
        <div className="absolute inset-0 z-0">
           <img 
               src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=2067&auto=format&fit=crop" 
               alt="Background Texture"
               className="w-full h-full object-cover opacity-10"
           />
           <div className="absolute inset-0 bg-dark-900/90" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 bg-dark-950/50 backdrop-blur-sm rounded-3xl border border-dark-800"
            >
              <div className="w-16 h-16 mx-auto bg-dark-800 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-lg shadow-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Qualité Certifiée</h3>
              <p className="text-slate-400">Chaque véhicule subit une inspection rigoureuse en 150 points.</p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="p-6 bg-dark-950/50 backdrop-blur-sm rounded-3xl border border-dark-800"
            >
              <div className="w-16 h-16 mx-auto bg-dark-800 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-lg shadow-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Prix Transparents</h3>
              <p className="text-slate-400">Pas de frais cachés. Le prix que vous voyez est le prix que vous payez.</p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="p-6 bg-dark-950/50 backdrop-blur-sm rounded-3xl border border-dark-800"
            >
              <div className="w-16 h-16 mx-auto bg-dark-800 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-lg shadow-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Livraison Rapide</h3>
              <p className="text-slate-400">Livraison nationale disponible directement chez vous.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;