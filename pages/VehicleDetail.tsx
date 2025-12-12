import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, Gauge, 
  Zap, MapPin, Maximize2, Heart, Share, Calculator, Phone, 
  CheckCircle2, Car, Users, Settings, Battery, X, DollarSign, Calendar
} from 'lucide-react';
import { getVehicle } from '../utils/storage';
import { Vehicle } from '../types';

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  
  // Action States
  const [isSaved, setIsSaved] = useState(false);
  const [shareLabel, setShareLabel] = useState('Partager');
  const [showFinanceModal, setShowFinanceModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsSaved(false);
    setShareLabel('Partager');
    if (id) {
      const found = getVehicle(id);
      setVehicle(found || null);
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div className="min-h-screen bg-dark-950 pt-20 flex items-center justify-center text-white">Chargement...</div>;
  if (!vehicle) return <div className="min-h-screen bg-dark-950 pt-20 flex flex-col items-center justify-center text-white">
      <h2 className="text-2xl font-bold mb-4">Véhicule non trouvé</h2>
      <Link to="/catalog" className="text-primary hover:underline">Retour au catalogue</Link>
  </div>;

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % vehicle.images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);

  // Handlers
  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      text: `Regardez cette ${vehicle.year} ${vehicle.make} ${vehicle.model} sur AutoLuxe.`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.debug('Partage annulé');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareLabel('Copié !');
        setTimeout(() => setShareLabel('Partager'), 2000);
      } catch (err) {
        setShareLabel('Échec');
        setTimeout(() => setShareLabel('Partager'), 2000);
      }
    }
  };

  return (
    <div className="pt-8 pb-20 min-h-screen bg-dark-950 text-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
          <span className="mx-2">›</span>
          <Link to="/catalog" className="hover:text-white transition-colors">Inventaire</Link>
          <span className="mx-2">›</span>
          <span className="text-white">{vehicle.year} {vehicle.make} {vehicle.model}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column (Images & Info) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Main Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-dark-900 border border-dark-800 shadow-2xl group">
                <AnimatePresence mode='wait'>
                  <motion.img
                    key={currentImage}
                    src={vehicle.images[currentImage]}
                    alt={`${vehicle.make} view`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Badge */}
                {vehicle.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-lg">
                    {vehicle.badge}
                  </div>
                )}

                {/* Fullscreen Toggle */}
                <button className="absolute bottom-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
                  <Maximize2 className="w-5 h-5" />
                </button>

                {/* Nav Arrows */}
                <button 
                  onClick={prevImage} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextImage} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {vehicle.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`relative flex-shrink-0 w-32 aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      currentImage === index ? 'border-primary opacity-100 ring-2 ring-primary/20' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Miniature" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="bg-dark-900/50 rounded-3xl p-8 border border-dark-800">
              <h3 className="text-xl font-bold text-white mb-6">Spécifications Techniques</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <SpecCard 
                  icon={Gauge} 
                  label="0-100 km/h" 
                  value={vehicle.zeroToSixty ? `${vehicle.zeroToSixty} sec` : 'N/A'} 
                  color="text-indigo-400"
                  bgColor="bg-indigo-500/10"
                />
                <SpecCard 
                  icon={Zap} 
                  label="Puissance" 
                  value={`${vehicle.horsepower} ch`} 
                  color="text-violet-400"
                  bgColor="bg-violet-500/10"
                />
                <SpecCard 
                  icon={Battery} 
                  label="Autonomie" 
                  value={vehicle.range ? `${vehicle.range} km` : 'N/A'} 
                  color="text-emerald-400"
                  bgColor="bg-emerald-500/10"
                />
                <SpecCard 
                  icon={Settings} 
                  label="Transmission" 
                  value={vehicle.drivetrain || 'Propulsion'} 
                  color="text-blue-400"
                  bgColor="bg-blue-500/10"
                />
                <SpecCard 
                  icon={Car} 
                  label="Carrosserie" 
                  value={vehicle.bodyStyle || 'Coupé'} 
                  color="text-rose-400"
                  bgColor="bg-rose-500/10"
                />
                <SpecCard 
                  icon={Users} 
                  label="Places" 
                  value={vehicle.seating ? `${vehicle.seating} Adultes` : '4 Adultes'} 
                  color="text-amber-400"
                  bgColor="bg-amber-500/10"
                />
              </div>
            </div>

            {/* Overview & Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Aperçu du Véhicule</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {vehicle.description}
                </p>
                <p className="text-slate-400 leading-relaxed text-sm mt-4">
                  L'intérieur est raffiné et conçu pour le confort. Avec une ingénierie de précision, la {vehicle.model} offre une expérience de conduite inégalée, alliant vitesse, autonomie et silence.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Caractéristiques Clés</h3>
                <ul className="space-y-3">
                  {vehicle.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                      <div className="mt-0.5 bg-primary rounded-full p-0.5">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Main Action Card */}
            <div className="bg-dark-900 rounded-3xl p-6 border border-dark-800 shadow-xl">
              <div className="mb-6">
                <h1 className="text-3xl font-serif font-bold text-white mb-2">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  {vehicle.bodyStyle || 'Trim'} • {vehicle.mileage.toLocaleString()} km
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-4xl font-bold text-white">{vehicle.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}</span>
                </div>
                <p className="text-slate-500 text-xs">
                  est. {Math.round(vehicle.price * 0.016).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}/mois
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <button className="w-full py-3.5 bg-primary hover:bg-violet-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group">
                  Acheter Maintenant <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full py-3.5 bg-dark-800 hover:bg-dark-700 text-white font-medium rounded-xl border border-dark-700 transition-colors flex items-center justify-center gap-2">
                  <MailIcon className="w-4 h-4" /> Contacter le Vendeur
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-dark-800 pt-6">
                <ActionButton 
                  icon={Heart} 
                  label={isSaved ? "Enregistré" : "Sauver"} 
                  active={isSaved}
                  onClick={toggleSave}
                />
                <ActionButton 
                  icon={Share} 
                  label={shareLabel} 
                  onClick={handleShare}
                />
                <ActionButton 
                  icon={Calculator} 
                  label="Finance" 
                  onClick={() => setShowFinanceModal(true)}
                />
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-dark-900 rounded-3xl p-6 border border-dark-800">
              <div className="flex items-start justify-between mb-4">
                <div>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Vendu Par</p>
                   <h3 className="font-bold text-white text-lg">{vehicle.seller?.name || 'Luxe Motors'}</h3>
                   <div className="flex items-center gap-1 text-primary text-xs font-medium mt-1">
                     <CheckCircle2 className="w-3 h-3 text-primary" fill="currentColor" /> Concessionnaire Vérifié
                   </div>
                </div>
                <button className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center text-slate-300 hover:bg-dark-700 hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Map Preview */}
            <div className="relative h-48 rounded-3xl overflow-hidden border border-dark-800 group">
               {/* Location Image */}
               <div className="absolute inset-0 bg-dark-950" />
               <img 
                 src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=2070&auto=format&fit=crop" 
                 alt="Carte de localisation"
                 className="w-full h-full object-cover opacity-60 mix-blend-overlay"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
               
               <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <p className="text-white font-bold text-sm">{vehicle.seller?.location || 'Paris, France'}</p>
                    <p className="text-slate-400 text-xs">à 3.8 km</p>
                  </div>
                  <button className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-xs font-medium text-white hover:bg-white/20 transition-colors">
                    Itinéraire
                  </button>
               </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Finance Calculator Modal */}
      <FinanceModal 
        isOpen={showFinanceModal}
        onClose={() => setShowFinanceModal(false)}
        vehiclePrice={vehicle.price}
      />

    </div>
  );
};

// Sub-components

const FinanceModal = ({ isOpen, onClose, vehiclePrice }: { isOpen: boolean, onClose: () => void, vehiclePrice: number }) => {
  const [downPayment, setDownPayment] = useState(vehiclePrice * 0.2);
  const [term, setTerm] = useState(72);
  const [apr, setApr] = useState(5.99);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Calculations
  const principal = vehiclePrice - downPayment;
  const monthlyRate = apr / 100 / 12;
  const monthlyPayment = 
    (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
    (Math.pow(1 + monthlyRate, term) - 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div 
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95, y: 20 }}
             className="relative bg-dark-900 w-full max-w-lg rounded-3xl border border-dark-800 shadow-2xl overflow-hidden"
          >
             {/* Header */}
             <div className="flex justify-between items-center p-6 border-b border-dark-800 bg-dark-950">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                   <Calculator className="w-5 h-5 text-primary" />
                 </div>
                 <h3 className="text-lg font-bold text-white">Calculateur de Paiement</h3>
               </div>
               <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-dark-800 rounded-full transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>

             {/* Content */}
             <div className="p-8 space-y-8">
               
               {/* Result Display */}
               <div className="text-center bg-dark-950 rounded-2xl p-6 border border-dark-800">
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Mensualité Estimée</p>
                  <h2 className="text-5xl font-bold text-white flex items-start justify-center gap-1">
                    {Math.round(monthlyPayment).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                  </h2>
                  <p className="text-xs text-slate-500 mt-2">
                    *Hors taxes, frais d'immatriculation et autres frais.
                  </p>
               </div>

               {/* Inputs */}
               <div className="space-y-6">
                 
                 {/* Down Payment */}
                 <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300 font-medium">Apport</span>
                      <span className="text-white font-bold">{downPayment.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })} ({Math.round((downPayment/vehiclePrice)*100)}%)</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max={vehiclePrice}
                      step={1000}
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                    />
                 </div>

                 {/* Term Length */}
                 <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300 font-medium">Durée</span>
                      <span className="text-white font-bold">{term} Mois</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      {[36, 48, 60, 72].map(t => (
                        <button 
                          key={t}
                          onClick={() => setTerm(t)}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                            term === t 
                             ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                             : 'bg-dark-950 border-dark-800 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          {t} mois
                        </button>
                      ))}
                    </div>
                 </div>

                 {/* APR */}
                 <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300 font-medium">Taux d'Intérêt (TAEG)</span>
                      <span className="text-white font-bold">{apr}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="15"
                      step="0.1"
                      value={apr}
                      onChange={(e) => setApr(Number(e.target.value))}
                      className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                    />
                 </div>
               </div>
               
               <button className="w-full py-4 bg-primary hover:bg-violet-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20">
                 Demander un Financement
               </button>

             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const SpecCard = ({ icon: Icon, label, value, color, bgColor }: any) => (
  <div className="bg-dark-950 rounded-xl p-4 border border-dark-800/50">
    <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center mb-3`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
    <p className="text-white font-bold text-lg">{value}</p>
  </div>
);

interface ActionButtonProps {
  icon: any;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

const ActionButton = ({ icon: Icon, label, onClick, active }: ActionButtonProps) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 group outline-none"
  >
    <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
      active 
        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25' 
        : 'bg-dark-950 border-dark-800 text-slate-400 group-hover:text-white group-hover:border-primary'
    }`}>
      <Icon className={`w-4 h-4 ${active ? 'fill-current' : ''}`} />
    </div>
    <span className={`text-xs font-medium transition-colors ${
      active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
    }`}>{label}</span>
  </button>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default VehicleDetail;