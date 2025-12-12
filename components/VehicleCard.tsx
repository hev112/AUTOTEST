import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fuel, Gauge, Calendar, Zap, Heart, Car } from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const [imgError, setImgError] = useState(false);

  const getBadgeColor = (badge?: string) => {
    switch(badge) {
      case 'Nouveauté': return 'bg-primary text-white';
      case 'Certifié': return 'bg-amber-100 text-amber-800';
      case 'Bonne Affaire': return 'bg-rose-500 text-white';
      case 'Occasion': return 'bg-slate-100 text-slate-800';
      default: return 'bg-primary text-white';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className="group bg-dark-900 rounded-2xl overflow-hidden border border-dark-800 hover:border-primary/50 transition-all duration-300 flex flex-col"
    >
      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden bg-dark-800">
        <Link to={`/vehicle/${vehicle.id}`} className="block w-full h-full">
            {imgError ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-dark-800 text-slate-600 gap-3 group-hover:bg-dark-700 transition-colors">
                <Car className="w-12 h-12 opacity-50" />
                <span className="text-xs font-bold uppercase tracking-widest opacity-70">Image Indisponible</span>
              </div>
            ) : (
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                src={vehicle.images[0]}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            )}
        </Link>
        
        {/* Badge */}
        {vehicle.badge && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-lg ${getBadgeColor(vehicle.badge)} z-10`}>
            {vehicle.badge}
          </div>
        )}

        {/* Favorite Button */}
        <button className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all z-10">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <Link to={`/vehicle/${vehicle.id}`}>
            <h3 className="text-lg font-bold text-white hover:text-primary transition-colors mb-1">
                {vehicle.make} {vehicle.model}
            </h3>
          </Link>
          <p className="text-primary font-bold text-xl">{vehicle.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-dark-800 mt-auto">
          <div className="flex flex-col items-center justify-center gap-1">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-[11px] font-medium text-slate-400">{vehicle.year}</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <Gauge className="w-4 h-4 text-slate-500" />
            <span className="text-[11px] font-medium text-slate-400">{vehicle.mileage >= 1000 ? `${(vehicle.mileage/1000).toFixed(1)}k` : vehicle.mileage} km</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            {vehicle.fuelType === 'Électrique' ? <Zap className="w-4 h-4 text-slate-500" /> : <Fuel className="w-4 h-4 text-slate-500" />}
            <span className="text-[11px] font-medium text-slate-400">{vehicle.fuelType}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleCard;