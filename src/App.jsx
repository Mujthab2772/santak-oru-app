import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import SecretSanta from './pages/SecretSanta';
import Wishlist from './pages/Wishlist';
import MemoryVault from './pages/MemoryVault';
import SantaRoast from './pages/SantaRoast';
import Snowfall from './components/Snowfall';

function App() {
  return (
    <Router basename="/santak-oru-app/">
      <Snowfall />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/secret-santa" element={<SecretSanta />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/memories" element={<MemoryVault />} />
        <Route path="/roast" element={<SantaRoast />} />
      </Routes>
    </Router>
  );
}

export default App;
