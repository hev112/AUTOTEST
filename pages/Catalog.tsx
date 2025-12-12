import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, LayoutGrid, Truck, CarFront, Flag, Zap, Leaf, X } from 'lucide-react';
import { getVehicles } from '../utils/storage';
import { MAKES, CATEGORIES } from '../constants';
import VehicleCard from '../components/VehicleCard';
import { SortOption, Category, FuelType, Vehicle } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';

const Catalog: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Tout');
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  
  // Widened default ranges to ensure new items (often with price 0 or different years) are visible
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]); 
  const [yearRange, setYearRange] = useState<[number, number]>([1990, new Date().getFullYear() + 1]);
  const [maxMileage, setMaxMileage] = useState<number>(500000);
  
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');

  const [expandedSections, setExpandedSections] = useState({
    make: true,
    year: true,
    fuel: false,
    mileage: false
  });

  const refreshData = () => {
    setVehicles(getVehicles());
  };

  useEffect(() => {
    // Initial fetch
    refreshData();
    // Listen for updates from Admin page or other tabs
    window.addEventListener('db-update', refreshData);
    return () => window.removeEventListener('db-update', refreshData);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
      // When searching, reset category to Tout to show all relevant results
      setSelectedCategory('Tout');
    } else {
      setSearchQuery('');
    }
  }, [location.search]);

  const toggleMake = (make: string) => {
    if (selectedMakes.includes(make)) {
      setSelectedMakes(selectedMakes.filter(m => m !== make));
    } else {
      setSelectedMakes([...selectedMakes, make]);
    }
  };

  const toggleFuel = (fuel: string) => {
    if (selectedFuels.includes(fuel)) {
      setSelectedFuels(selectedFuels.filter(f => f !== fuel));
    } else {
      setSelectedFuels([...selectedFuels, fuel]);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const clearSearch = () => {
    navigate('/catalog');
  };

  // Filter Logic
  const allFilteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      // Search Query Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
            vehicle.make.toLowerCase().includes(query) ||
            vehicle.model.toLowerCase().includes(query) ||
            vehicle.year.toString().includes(query) ||
            vehicle.description.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Category Filter
      if (selectedCategory !== 'Tout' && vehicle.category !== selectedCategory) return false;

      // Make Filter
      if (selectedMakes.length > 0 && !selectedMakes.includes(vehicle.make)) return false;

      // Price Filter
      if (vehicle.price < priceRange[0] || vehicle.price > priceRange[1]) return false;

      // Year Filter
      if (vehicle.year < yearRange[0] || vehicle.year > yearRange[1]) return false;

      // Mileage Filter
      if (vehicle.mileage > maxMileage) return false;

      // Fuel Filter
      if (selectedFuels.length > 0 && !selectedFuels.includes(vehicle.fuelType)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'year_desc') return b.year - a.year;
      if (sortBy === 'mileage_asc') return a.mileage - b.mileage;
      return 0; // recommended logic
    });
  }, [vehicles, selectedCategory, selectedMakes, priceRange, yearRange, maxMileage, selectedFuels, sortBy, searchQuery]);

  // Pagination Logic
  const visibleVehicles = allFilteredVehicles.slice(0, visibleCount);
  const hasMore = visibleCount < allFilteredVehicles.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="bg-dark-950 min-h-screen pb-20">
      
      {/* Header Section */}
      <div className="relative pt-24 pb-12 border-b border-dark-800 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop" 
            alt="Catalog Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/80 to-dark-950/60" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight font-serif">
                {searchQuery ? `Résultats pour "${searchQuery}"` : 'Sélection Premium'}
              </h1>
              <p className="text-slate-300">Découvrez {allFilteredVehicles.length} véhicules certifiés disponibles immédiatement.</p>
              
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="mt-3 flex items-center gap-2 text-sm text-primary hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" /> Effacer la recherche
                </button>
              )}
            </div>
            
            <div className="relative group">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-dark-900/80 backdrop-blur-md text-white border border-dark-800 rounded-lg py-2.5 pl-4 pr-10 focus:outline-none focus:border-primary cursor-pointer hover:border-slate-600 transition-colors text-sm font-medium shadow-lg"
              >
                <option value="recommended">Tri : Recommandé</option>
                <option value="price_asc">Prix : Croissant</option>
                <option value="price_desc">Prix : Décroissant</option>
                <option value="year_desc">Année : Récent</option>
                <option value="mileage_asc">Kilométrage : Faible</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar mb-8">
          {CATEGORIES.map((cat) => {
            const Icon = {
              'LayoutGrid': LayoutGrid,
              'Truck': Truck,
              'CarFront': CarFront,
              'Flag': Flag,
              'Zap': Zap,
              'Leaf': Leaf
            }[cat.icon] || LayoutGrid;

            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                   setSelectedCategory(cat.id as Category);
                   setVisibleCount(6); // Reset pagination on filter change
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  isSelected 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'bg-dark-900 text-slate-400 border border-dark-800 hover:border-slate-600 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.id}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 flex-shrink-0 space-y-6">
            
            {/* Price Range */}
            <div className="bg-dark-900 rounded-2xl p-6 border border-dark-800">
              <h3 className="font-bold text-white mb-6">Fourchette de Prix</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-dark-950 border border-dark-800 rounded-lg px-3 py-2 flex-1">
                  <span className="text-xs text-slate-500 block mb-1">Min</span>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full bg-transparent text-white text-sm focus:outline-none"
                    />
                    <span className="text-slate-400 ml-1">€</span>
                  </div>
                </div>
                <span className="text-slate-600">-</span>
                <div className="bg-dark-950 border border-dark-800 rounded-lg px-3 py-2 flex-1">
                  <span className="text-xs text-slate-500 block mb-1">Max</span>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full bg-transparent text-white text-sm focus:outline-none"
                    />
                    <span className="text-slate-400 ml-1">€</span>
                  </div>
                </div>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1000000" 
                step="5000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full h-1 bg-dark-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
              />
            </div>

            {/* Make & Model */}
            <div className="bg-dark-900 rounded-2xl border border-dark-800 overflow-hidden">
              <button 
                onClick={() => toggleSection('make')}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-dark-800/50 transition-colors"
              >
                <span className="font-bold text-white">Marque & Modèle</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.make ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {expandedSections.make && (
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-3">
                      {MAKES.map((make) => (
                        <label key={make.name} className="flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedMakes.includes(make.name) ? 'bg-primary border-primary' : 'border-dark-700 group-hover:border-slate-500'}`}>
                              {selectedMakes.includes(make.name) && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <input 
                              type="checkbox" 
                              className="hidden"
                              checked={selectedMakes.includes(make.name)}
                              onChange={() => toggleMake(make.name)}
                            />
                            <span className={`text-sm ${selectedMakes.includes(make.name) ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                              {make.name}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Year */}
            <div className="bg-dark-900 rounded-2xl border border-dark-800 overflow-hidden">
               <button 
                 onClick={() => toggleSection('year')}
                 className="w-full flex justify-between items-center p-6 text-left hover:bg-dark-800/50 transition-colors"
               >
                 <span className="font-bold text-white">Année</span>
                 <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.year ? 'rotate-180' : ''}`} />
               </button>
               <AnimatePresence>
                 {expandedSections.year && (
                   <motion.div
                      initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      className="overflow-hidden"
                   >
                      <div className="px-6 pb-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="bg-dark-950 border border-dark-800 rounded-lg px-3 py-2 flex-1">
                             <span className="text-xs text-slate-500 block mb-1">Min</span>
                             <input 
                               type="number" 
                               value={yearRange[0]}
                               onChange={(e) => setYearRange([Number(e.target.value), yearRange[1]])}
                               className="w-full bg-transparent text-white text-sm focus:outline-none"
                             />
                          </div>
                          <span className="text-slate-600">-</span>
                          <div className="bg-dark-950 border border-dark-800 rounded-lg px-3 py-2 flex-1">
                             <span className="text-xs text-slate-500 block mb-1">Max</span>
                             <input 
                               type="number" 
                               value={yearRange[1]}
                               onChange={(e) => setYearRange([yearRange[0], Number(e.target.value)])}
                               className="w-full bg-transparent text-white text-sm focus:outline-none"
                             />
                          </div>
                        </div>
                        <input 
                          type="range" 
                          min="1990" 
                          max={new Date().getFullYear() + 1} 
                          step="1"
                          value={yearRange[1]}
                          onChange={(e) => setYearRange([yearRange[0], Number(e.target.value)])}
                          className="w-full h-1 bg-dark-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                        />
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Fuel Type */}
            <div className="bg-dark-900 rounded-2xl border border-dark-800 overflow-hidden">
               <button 
                 onClick={() => toggleSection('fuel')}
                 className="w-full flex justify-between items-center p-6 text-left hover:bg-dark-800/50 transition-colors"
               >
                 <span className="font-bold text-white">Carburant</span>
                 <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.fuel ? 'rotate-180' : ''}`} />
               </button>
               <AnimatePresence>
                 {expandedSections.fuel && (
                   <motion.div
                      initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      className="overflow-hidden"
                   >
                      <div className="px-6 pb-6 space-y-3">
                        {Object.values(FuelType).map((fuel) => (
                          <label key={fuel} className="flex items-center gap-3 cursor-pointer group">
                             <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedFuels.includes(fuel) ? 'bg-primary border-primary' : 'border-dark-700 group-hover:border-slate-500'}`}>
                                {selectedFuels.includes(fuel) && <Check className="w-3.5 h-3.5 text-white" />}
                             </div>
                             <input 
                               type="checkbox" 
                               className="hidden"
                               checked={selectedFuels.includes(fuel)}
                               onChange={() => toggleFuel(fuel)}
                             />
                             <span className={`text-sm ${selectedFuels.includes(fuel) ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                               {fuel}
                             </span>
                          </label>
                        ))}
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Mileage */}
            <div className="bg-dark-900 rounded-2xl border border-dark-800 overflow-hidden">
               <button 
                 onClick={() => toggleSection('mileage')}
                 className="w-full flex justify-between items-center p-6 text-left hover:bg-dark-800/50 transition-colors"
               >
                 <span className="font-bold text-white">Kilométrage</span>
                 <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.mileage ? 'rotate-180' : ''}`} />
               </button>
               <AnimatePresence>
                 {expandedSections.mileage && (
                   <motion.div
                      initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      className="overflow-hidden"
                   >
                      <div className="px-6 pb-6">
                        <div className="bg-dark-950 border border-dark-800 rounded-lg px-3 py-2 mb-4">
                           <span className="text-xs text-slate-500 block mb-1">Max Km</span>
                           <div className="flex items-center">
                              <input 
                                type="number" 
                                value={maxMileage}
                                onChange={(e) => setMaxMileage(Number(e.target.value))}
                                className="w-full bg-transparent text-white text-sm focus:outline-none"
                              />
                              <span className="text-slate-500 text-sm ml-2">km</span>
                           </div>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="500000" 
                          step="5000"
                          value={maxMileage}
                          onChange={(e) => setMaxMileage(Number(e.target.value))}
                          className="w-full h-1 bg-dark-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                        />
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

          </div>

          {/* Vehicle Grid */}
          <div className="flex-1">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {visibleVehicles.length > 0 ? (
                  visibleVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <div className="inline-block p-4 rounded-full bg-dark-900 mb-4">
                      <LayoutGrid className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Aucun véhicule trouvé</h3>
                    <p className="text-slate-400 mt-2">Ajustez vos filtres pour voir plus de résultats.</p>
                    <button onClick={() => {
                        setPriceRange([0, 1000000]);
                        setYearRange([1990, new Date().getFullYear() + 1]);
                        setMaxMileage(500000);
                        setSelectedCategory('Tout');
                        setSelectedMakes([]);
                        setSelectedFuels([]);
                    }} className="mt-4 px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm text-white transition-colors">
                        Réinitialiser tous les filtres
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>

            {visibleVehicles.length > 0 && (
              <div className="mt-12 text-center">
                <p className="text-slate-500 text-sm mb-4">Affichage de {visibleVehicles.length} sur {allFilteredVehicles.length} véhicules</p>
                <div className="w-48 h-1 bg-dark-800 rounded-full mx-auto mb-8 overflow-hidden">
                   <div 
                     className="h-full bg-primary rounded-full transition-all duration-500"
                     style={{ width: `${(visibleVehicles.length / allFilteredVehicles.length) * 100}%` }}
                   ></div>
                </div>
                {hasMore ? (
                  <button 
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-dark-900 border border-dark-800 hover:bg-dark-800 text-white rounded-xl font-medium transition-colors flex items-center gap-2 mx-auto"
                  >
                    Charger plus <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <p className="text-slate-600 text-sm">Tous les véhicules sont affichés</p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Catalog;