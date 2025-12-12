import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, Save, 
  Search, LayoutDashboard, Check, Lock, Shield, LogOut, KeyRound, ArrowRight,
  FileText, CheckCircle2, XCircle
} from 'lucide-react';
import { 
  getVehicles, saveVehicle, deleteVehicle,
  hasAdminAccount, isAdminAuthenticated, createAdminAccount, loginAdmin, logoutAdmin,
  getExchangeRequests, updateRequestStatus 
} from '../utils/storage';
import { Vehicle, FuelType, Category, BadgeType, ExchangeRequest } from '../types';

type AuthStage = 'loading' | 'setup' | 'login' | 'dashboard';
type AdminTab = 'inventory' | 'requests';

const Admin: React.FC = () => {
  const [authStage, setAuthStage] = useState<AuthStage>('loading');
  const [activeTab, setActiveTab] = useState<AdminTab>('inventory');
  
  // Inventory State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Partial<Vehicle>>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Requests State
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);

  // Auth Form State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Initial Load & Auth Check
  useEffect(() => {
    checkAuth();
    // Listen for DB updates only if authenticated
    const handleDbUpdate = () => {
       if (isAdminAuthenticated()) refreshData();
    };
    window.addEventListener('db-update', handleDbUpdate);
    window.addEventListener('request-update', handleDbUpdate);
    return () => {
      window.removeEventListener('db-update', handleDbUpdate);
      window.removeEventListener('request-update', handleDbUpdate);
    };
  }, []);

  const checkAuth = () => {
    if (!hasAdminAccount()) {
      setAuthStage('setup');
    } else if (isAdminAuthenticated()) {
      setAuthStage('dashboard');
      refreshData();
    } else {
      setAuthStage('login');
    }
  };

  const refreshData = () => {
    setVehicles(getVehicles());
    setRequests(getExchangeRequests());
  };

  // --- Auth Handlers ---

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setAuthError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (password !== confirmPassword) {
      setAuthError('Les mots de passe ne correspondent pas');
      return;
    }
    createAdminAccount(password);
    setAuthStage('dashboard');
    refreshData();
    setPassword('');
    setConfirmPassword('');
    setAuthError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      setAuthStage('dashboard');
      refreshData();
      setPassword('');
      setAuthError('');
    } else {
      setAuthError('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setAuthStage('login');
    setPassword('');
  };

  // --- Dashboard Handlers ---

  const handleAddNew = () => {
    setCurrentVehicle({
      images: [],
      features: [],
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      fuelType: FuelType.Petrol,
      category: 'Berlines',
      seller: {
        name: 'AutoLuxe Admin',
        verified: true,
        location: 'Paris, France',
        phone: '+33 1 00 00 00 00'
      }
    });
    setIsEditing(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setCurrentVehicle({ ...vehicle });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.')) {
      deleteVehicle(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVehicle.make || !currentVehicle.model || !currentVehicle.price) {
      alert("Veuillez remplir les champs obligatoires (Marque, Modèle, Prix)");
      return;
    }
    const vehicleToSave = {
      ...currentVehicle,
      images: currentVehicle.images?.length ? currentVehicle.images : ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=2070'],
      features: currentVehicle.features || [],
    } as Vehicle;

    saveVehicle(vehicleToSave);
    setIsEditing(false);
  };

  const handleStatusUpdate = (id: string, status: 'Approuvé' | 'Refusé') => {
    updateRequestStatus(id, status);
  };

  const filteredVehicles = vehicles.filter(v => 
    v.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- RENDER LOGIC ---

  if (authStage === 'loading') {
    return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">Chargement...</div>;
  }

  // --- SETUP VIEW ---
  if (authStage === 'setup') {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-dark-900 border border-dark-800 rounded-3xl p-8 shadow-2xl"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">Configuration Admin</h1>
          <p className="text-slate-400 text-center text-sm mb-8">
            C'est votre première connexion. Veuillez définir un mot de passe sécurisé pour accéder au panneau d'administration.
          </p>

          <form onSubmit={handleSetupSubmit} className="space-y-4">
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mot de Passe Admin</label>
               <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                 <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                 />
               </div>
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confirmer le Mot de Passe</label>
               <div className="relative">
                 <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                 <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                 />
               </div>
             </div>

             {authError && (
               <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-medium text-center">
                 {authError}
               </div>
             )}

             <button type="submit" className="w-full py-3 bg-primary hover:bg-violet-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 mt-2">
               Créer le Compte Admin
             </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- LOGIN VIEW ---
  if (authStage === 'login') {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-dark-900 border border-dark-800 rounded-3xl p-8 shadow-2xl"
        >
          <div className="w-16 h-16 bg-dark-800 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <KeyRound className="w-8 h-8 text-slate-200" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">Accès Restreint</h1>
          <p className="text-slate-400 text-center text-sm mb-8">
            Veuillez entrer votre mot de passe administrateur pour continuer.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mot de Passe</label>
               <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                 <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                 />
               </div>
             </div>

             {authError && (
               <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-medium text-center">
                 {authError}
               </div>
             )}

             <button type="submit" className="w-full py-3 bg-primary hover:bg-violet-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 mt-2 flex items-center justify-center gap-2">
               Se Connecter <ArrowRight className="w-4 h-4" />
             </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="pt-24 pb-20 min-h-screen bg-dark-950 text-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
              <LayoutDashboard className="text-primary" /> Tableau de Bord Admin
            </h1>
            <p className="text-slate-400 mt-1">Gérez votre inventaire et vos demandes clients</p>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === 'inventory' && (
                <button 
                  onClick={handleAddNew}
                  className="px-6 py-3 bg-primary hover:bg-violet-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Ajouter
                </button>
            )}
            <button 
              onClick={handleLogout}
              className="px-4 py-3 bg-dark-900 border border-dark-800 hover:bg-dark-800 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'inventory' ? 'bg-white text-dark-950' : 'bg-dark-900 text-slate-400 border border-dark-800 hover:text-white'}`}
          >
            Inventaire
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-2 rounded-lg font-bold transition-all relative ${activeTab === 'requests' ? 'bg-white text-dark-950' : 'bg-dark-900 text-slate-400 border border-dark-800 hover:text-white'}`}
          >
            Demandes de Reprise
            {requests.filter(r => r.status === 'En attente').length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {requests.filter(r => r.status === 'En attente').length}
                </span>
            )}
          </button>
        </div>

        {activeTab === 'inventory' ? (
           <>
            {/* Filters */}
            <div className="bg-dark-900 p-4 rounded-2xl border border-dark-800 mb-8 flex items-center gap-4">
              <Search className="w-5 h-5 text-slate-500 ml-2" />
              <input 
                type="text" 
                placeholder="Rechercher par marque ou modèle..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-white w-full h-full py-2"
              />
            </div>

            {/* List */}
            <div className="bg-dark-900 rounded-2xl border border-dark-800 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-dark-950 text-slate-400 text-sm uppercase tracking-wider border-b border-dark-800">
                    <th className="p-6 font-semibold">Véhicule</th>
                    <th className="p-6 font-semibold">Catégorie</th>
                    <th className="p-6 font-semibold">Prix</th>
                    <th className="p-6 font-semibold">Année/Km</th>
                    <th className="p-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-dark-800/50 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 rounded-lg overflow-hidden bg-dark-800 flex-shrink-0">
                            <img src={vehicle.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-white">{vehicle.make} {vehicle.model}</div>
                            <div className="text-xs text-slate-500">ID: {vehicle.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="px-3 py-1 bg-dark-800 rounded-full text-xs font-medium text-slate-300 border border-dark-700">
                          {vehicle.category}
                        </span>
                      </td>
                      <td className="p-6 font-bold text-white">
                        {vehicle.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                      </td>
                      <td className="p-6 text-sm text-slate-400">
                        {vehicle.year} • {vehicle.mileage.toLocaleString()} km
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(vehicle)}
                            className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(vehicle.id)}
                            className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredVehicles.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-500">
                        Aucun véhicule trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
           </>
        ) : (
            // --- REQUESTS TAB ---
            <div className="space-y-4">
                {requests.length > 0 ? (
                    requests.map(req => (
                        <div key={req.id} className="bg-dark-900 rounded-2xl border border-dark-800 p-6 flex flex-col lg:flex-row justify-between gap-6">
                             <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-white">
                                        {req.userName}
                                    </h3>
                                    <span className={`text-xs px-2 py-1 rounded-full border ${
                                        req.status === 'En attente' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                        req.status === 'Approuvé' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                        'bg-red-500/10 border-red-500/20 text-red-500'
                                    }`}>
                                        {req.status}
                                    </span>
                                </div>
                                <div className="text-slate-400 text-sm mb-4">
                                    {req.userEmail} • {req.contactPhone}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-dark-950 p-4 rounded-xl border border-dark-800">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Véhicule Actuel</p>
                                        <p className="text-white font-medium">{req.currentVehicle.year} {req.currentVehicle.make} {req.currentVehicle.model}</p>
                                        <p className="text-slate-400 text-sm">{req.currentVehicle.mileage} km • VIN: {req.currentVehicle.vin || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Véhicule Souhaité</p>
                                        <p className="text-primary font-medium">{req.desiredVehicle}</p>
                                    </div>
                                </div>
                             </div>
                             
                             <div className="flex flex-row lg:flex-col justify-center gap-3 border-t lg:border-t-0 lg:border-l border-dark-800 pt-4 lg:pt-0 lg:pl-6">
                                {req.status === 'En attente' && (
                                    <>
                                        <button 
                                            onClick={() => handleStatusUpdate(req.id, 'Approuvé')}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Approuver
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate(req.id, 'Refusé')}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="w-4 h-4" /> Refuser
                                        </button>
                                    </>
                                )}
                                {req.status !== 'En attente' && (
                                     <div className="text-slate-500 text-sm text-center italic">
                                         Traitée le {new Date().toLocaleDateString()}
                                     </div>
                                )}
                             </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-dark-900 rounded-2xl border border-dark-800 p-12 text-center">
                        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-white font-bold text-lg">Aucune demande</h3>
                        <p className="text-slate-500">Il n'y a pas encore de demandes de reprise.</p>
                    </div>
                )}
            </div>
        )}

      </div>

      {/* Edit Modal (Existing code reused) */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsEditing(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm"
             />
             <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-dark-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-dark-800 shadow-2xl flex flex-col"
             >
                <form onSubmit={handleSubmit}>
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-dark-900 z-10 flex justify-between items-center p-6 border-b border-dark-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {currentVehicle.id ? <Edit2 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                      {currentVehicle.id ? 'Modifier le Véhicule' : 'Nouveau Véhicule'}
                    </h2>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Annuler</button>
                      <button type="submit" className="px-6 py-2 bg-primary hover:bg-violet-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                        <Save className="w-4 h-4" /> Enregistrer
                      </button>
                    </div>
                  </div>

                  {/* Form Content */}
                  <div className="p-8 space-y-8">
                    
                    {/* Basic Info */}
                    <Section title="Informations Principales">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Marque" value={currentVehicle.make} onChange={v => setCurrentVehicle({...currentVehicle, make: v})} placeholder="Ex: Porsche" required />
                        <Input label="Modèle" value={currentVehicle.model} onChange={v => setCurrentVehicle({...currentVehicle, model: v})} placeholder="Ex: 911 Carrera" required />
                        <Input label="Année" type="number" value={currentVehicle.year} onChange={v => setCurrentVehicle({...currentVehicle, year: Number(v)})} />
                        <Input label="Prix (€)" type="number" value={currentVehicle.price} onChange={v => setCurrentVehicle({...currentVehicle, price: Number(v)})} required />
                        <Input label="Kilométrage (km)" type="number" value={currentVehicle.mileage} onChange={v => setCurrentVehicle({...currentVehicle, mileage: Number(v)})} />
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Carburant</label>
                          <select 
                            value={currentVehicle.fuelType} 
                            onChange={e => setCurrentVehicle({...currentVehicle, fuelType: e.target.value as FuelType})}
                            className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                          >
                            {Object.values(FuelType).map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Catégorie</label>
                          <select 
                            value={currentVehicle.category} 
                            onChange={e => setCurrentVehicle({...currentVehicle, category: e.target.value as Category})}
                            className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                          >
                            <option value="SUV">SUV</option>
                            <option value="Berlines">Berlines</option>
                            <option value="Sport">Sport</option>
                            <option value="Électrique">Électrique</option>
                            <option value="Hybride">Hybride</option>
                          </select>
                        </div>

                         <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Badge (Optionnel)</label>
                          <select 
                            value={currentVehicle.badge || ''} 
                            onChange={e => setCurrentVehicle({...currentVehicle, badge: e.target.value as BadgeType || undefined})}
                            className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                          >
                            <option value="">Aucun</option>
                            <option value="Nouveauté">Nouveauté</option>
                            <option value="Certifié">Certifié</option>
                            <option value="Bonne Affaire">Bonne Affaire</option>
                            <option value="Occasion">Occasion</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                        <textarea 
                          rows={4}
                          value={currentVehicle.description || ''}
                          onChange={e => setCurrentVehicle({...currentVehicle, description: e.target.value})}
                          className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                          placeholder="Description détaillée du véhicule..."
                        />
                      </div>
                    </Section>

                    {/* Technical Specs */}
                    <Section title="Spécifications Techniques">
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <Input label="Puissance (ch)" type="number" value={currentVehicle.horsepower} onChange={v => setCurrentVehicle({...currentVehicle, horsepower: Number(v)})} />
                          <Input label="0-100 km/h (sec)" type="number" step="0.1" value={currentVehicle.zeroToSixty} onChange={v => setCurrentVehicle({...currentVehicle, zeroToSixty: Number(v)})} />
                          <Input label="Transmission" value={currentVehicle.transmission} onChange={v => setCurrentVehicle({...currentVehicle, transmission: v})} />
                          <Input label="Drivetrain" value={currentVehicle.drivetrain} onChange={v => setCurrentVehicle({...currentVehicle, drivetrain: v})} placeholder="AWD, RWD..." />
                          <Input label="Carrosserie" value={currentVehicle.bodyStyle} onChange={v => setCurrentVehicle({...currentVehicle, bodyStyle: v})} placeholder="Coupé, SUV..." />
                          <Input label="Autonomie (km)" type="number" value={currentVehicle.range} onChange={v => setCurrentVehicle({...currentVehicle, range: Number(v)})} />
                          <Input label="Sièges" type="number" value={currentVehicle.seating} onChange={v => setCurrentVehicle({...currentVehicle, seating: Number(v)})} />
                       </div>
                    </Section>

                    {/* Images & Features */}
                    <Section title="Médias & Options">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center justify-between">
                            Images (URLs)
                            <span className="text-[10px] normal-case bg-dark-800 px-2 py-0.5 rounded">Une URL par ligne</span>
                          </label>
                          <textarea 
                            rows={6}
                            value={currentVehicle.images?.join('\n') || ''}
                            onChange={e => setCurrentVehicle({...currentVehicle, images: e.target.value.split('\n').filter(s => s.trim() !== '')})}
                            className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary font-mono text-xs"
                            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                          />
                          <div className="mt-2 flex gap-2 overflow-x-auto py-2">
                             {currentVehicle.images?.slice(0,4).map((img, i) => (
                               <div key={i} className="w-16 h-12 bg-dark-800 rounded border border-dark-700 flex-shrink-0 overflow-hidden">
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                             ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center justify-between">
                            Caractéristiques / Options
                            <span className="text-[10px] normal-case bg-dark-800 px-2 py-0.5 rounded">Une option par ligne</span>
                          </label>
                           <textarea 
                            rows={6}
                            value={currentVehicle.features?.join('\n') || ''}
                            onChange={e => setCurrentVehicle({...currentVehicle, features: e.target.value.split('\n').filter(s => s.trim() !== '')})}
                            className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary text-sm"
                            placeholder="Toit Panoramique&#10;Sièges Chauffants&#10;GPS"
                          />
                        </div>
                      </div>
                    </Section>

                  </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="bg-dark-950/50 rounded-2xl p-6 border border-dark-800">
    <h3 className="text-lg font-bold text-white mb-6 border-b border-dark-800 pb-2">{title}</h3>
    {children}
  </div>
);

const Input = ({ label, value, onChange, type = "text", placeholder, required, step }: any) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      type={type}
      step={step}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default Admin;
