import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User as UserIcon, LogOut, FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { getCurrentUser, logoutUser, getExchangeRequests } from '../utils/storage';
import { User, ExchangeRequest } from '../types';

const ClientDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    
    // Filter requests for this user
    const allRequests = getExchangeRequests();
    const userRequests = allRequests.filter(r => r.userId === currentUser.id);
    setRequests(userRequests);

    // Listen for updates (in case user adds new request in another tab)
    const handleUpdate = () => {
       const updatedAll = getExchangeRequests();
       setRequests(updatedAll.filter(r => r.userId === currentUser?.id));
    };
    window.addEventListener('request-update', handleUpdate);
    return () => window.removeEventListener('request-update', handleUpdate);

  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approuvé': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Refusé': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }
  };

  if (!user) return null;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-serif font-bold text-white mb-2">Mon Espace Client</h1>
            <p className="text-slate-400">Bienvenue, {user.name}</p>
          </motion.div>

          <motion.button 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             onClick={handleLogout}
             className="px-6 py-3 bg-dark-900 border border-dark-800 hover:bg-dark-800 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
          >
             <LogOut className="w-5 h-5" /> Déconnexion
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-900 rounded-3xl p-8 border border-dark-800"
          >
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
               <UserIcon className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-slate-400 text-sm mb-6">{user.email}</p>
            
            <div className="border-t border-dark-800 pt-6">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-slate-500 text-sm">Membre depuis</span>
                 <span className="text-white text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-slate-500 text-sm">Demandes actives</span>
                 <span className="text-white text-sm">{requests.length}</span>
               </div>
            </div>
          </motion.div>

          {/* Activity Section */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Mes Demandes de Reprise</h2>
            
            {requests.length > 0 ? (
               <div className="space-y-4">
                 {requests.map((req, index) => (
                   <motion.div 
                     key={req.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.1 }}
                     className="bg-dark-900 rounded-2xl p-6 border border-dark-800"
                   >
                     <div className="flex flex-col md:flex-row justify-between gap-4">
                       <div>
                         <div className="flex items-center gap-2 mb-2">
                           <FileText className="w-4 h-4 text-primary" />
                           <span className="text-white font-bold">Échange: {req.currentVehicle.make} {req.currentVehicle.model}</span>
                         </div>
                         <p className="text-slate-400 text-sm mb-1">
                           Intéressé par : <span className="text-slate-300">{req.desiredVehicle}</span>
                         </p>
                         <p className="text-slate-500 text-xs">
                           Soumis le {new Date(req.date).toLocaleDateString()}
                         </p>
                       </div>
                       
                       <div className="flex items-center">
                         <div className={`px-4 py-2 rounded-full border text-sm font-bold flex items-center gap-2 ${getStatusColor(req.status)}`}>
                            {req.status === 'Approuvé' && <CheckCircle2 className="w-4 h-4" />}
                            {req.status === 'Refusé' && <XCircle className="w-4 h-4" />}
                            {req.status === 'En attente' && <Clock className="w-4 h-4" />}
                            {req.status}
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 ))}
               </div>
            ) : (
              <div className="bg-dark-900 rounded-2xl p-12 border border-dark-800 text-center">
                <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Aucune demande</h3>
                <p className="text-slate-500">Vous n'avez pas encore soumis de demande de reprise.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
