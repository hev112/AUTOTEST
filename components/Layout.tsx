
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Car, Search, Shield, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';
import { getCurrentUser } from '../utils/storage';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Acheter', path: '/catalog' },
    { name: 'Vendre', path: '/sell' },
    { name: 'Échanger', path: '/exchange' },
    { name: 'Services', path: '/services' },
  ];

  const checkUser = () => {
    setCurrentUser(getCurrentUser());
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('auth-change', checkUser);
    return () => window.removeEventListener('auth-change', checkUser);
  }, []);

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthOpen(true);
    setIsOpen(false); 
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <>
      <nav className="fixed w-full z-50 bg-dark-950 border-b border-dark-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Left: Logo & Search */}
            <div className="flex items-center gap-8 md:gap-12 flex-1">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Car className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-white tracking-wide">
                  AutoLuxe
                </span>
              </Link>

              <form onSubmit={handleSearch} className="hidden md:flex relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher..." 
                  className="w-full bg-dark-900 border border-dark-800 text-slate-300 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm placeholder:text-slate-600"
                />
              </form>
            </div>

            {/* Right: Navigation & Auth */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-medium transition-colors hover:text-white ${
                      location.pathname === link.path ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center gap-3 pl-8 border-l border-dark-800">
                {currentUser ? (
                  <Link 
                    to="/dashboard"
                    className="flex items-center gap-2 bg-dark-900 border border-dark-800 hover:border-primary text-white pl-3 pr-4 py-2 rounded-lg transition-all"
                  >
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">{currentUser.name.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-medium">Mon Espace</span>
                  </Link>
                ) : (
                  <>
                    <button 
                      onClick={() => openAuth('login')}
                      className="text-sm font-medium text-white px-4 py-2 hover:text-primary transition-colors"
                    >
                      Connexion
                    </button>
                    <button 
                      onClick={() => openAuth('signup')}
                      className="text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-violet-700 transition-colors shadow-lg shadow-primary/20"
                    >
                      Inscription
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-dark-950 border-b border-dark-800 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                 <form onSubmit={handleSearch} className="relative w-full mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Rechercher..." 
                      className="w-full bg-dark-900 border border-dark-800 text-slate-300 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary"
                    />
                 </form>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block text-lg font-medium text-slate-300 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 flex flex-col gap-3">
                   {currentUser ? (
                     <Link 
                       to="/dashboard"
                       onClick={() => setIsOpen(false)}
                       className="w-full py-3 text-white font-medium bg-dark-900 border border-dark-800 rounded-lg flex items-center justify-center gap-2"
                     >
                       <UserIcon className="w-4 h-4" /> Mon Espace Client
                     </Link>
                   ) : (
                     <>
                       <button 
                        onClick={() => openAuth('login')}
                        className="w-full py-3 text-white font-medium bg-dark-900 rounded-lg"
                       >
                         Connexion
                       </button>
                       <button 
                        onClick={() => openAuth('signup')}
                        className="w-full py-3 text-white font-medium bg-primary rounded-lg"
                       >
                         Inscription
                       </button>
                     </>
                   )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        initialMode={authMode} 
      />
    </>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-950 text-slate-200 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      
      <footer className="bg-dark-950 border-t border-dark-800 py-12">
        <div className="max-w-[1400px] mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AutoLuxe. Tous droits réservés.</p>
          <div className="mt-4 flex justify-center gap-6">
             <Link to="/admin" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-1 text-xs">
               <Shield className="w-3 h-3" /> Espace Admin
             </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
