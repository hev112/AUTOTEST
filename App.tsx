import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import VehicleDetail from './pages/VehicleDetail';
import Contact from './pages/Contact';
import Sell from './pages/Sell';
import Exchange from './pages/Exchange';
import Services from './pages/Services';
import Admin from './pages/Admin';
import ClientDashboard from './pages/ClientDashboard';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/vehicle/:id" element={<VehicleDetail />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/exchange" element={<Exchange />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<ClientDashboard />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
