import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import MatchesFeed from './pages/MatchesFeed';
import MatchDetail from './pages/MatchDetail';
import Predictions from './pages/Predictions';
import { getUpcomingMatches, getTournaments } from './api';

function App() {
  const [tournaments, setTournaments] = useState([]);
  const [potdMatch, setPotdMatch] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // We fetch POTD and Tournaments once at the App level to persist in RightPanel
  useEffect(() => {
    const fetchGlobals = async () => {
      try {
        const [matchesData, tournamentsData] = await Promise.all([
          getUpcomingMatches(),
          getTournaments()
        ]);
        setTournaments(tournamentsData || []);
        if (matchesData && matchesData.length > 0) {
          setPotdMatch(matchesData[0]);
        }
      } catch (error) {
        console.error("Failed to load global data:", error);
      }
    };
    fetchGlobals();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar toggleMobileMenu={toggleMobileMenu} />
        {isMobileMenuOpen && <div className="mobile-overlay" onClick={closeMobileMenu}></div>}
        <Sidebar isOpen={isMobileMenuOpen} closeMobileMenu={closeMobileMenu} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/upcoming" replace />} />
            <Route path="/upcoming" element={<MatchesFeed />} />
            <Route path="/live" element={<MatchesFeed />} />
            <Route path="/past" element={<MatchesFeed />} />
            <Route path="/match/:id" element={<MatchDetail />} />
            <Route path="/predictions" element={<Predictions />} />
            
            {/* Fallbacks */}
            <Route path="/teams" element={<div style={{color:'white'}}>Teams Page Coming Soon...</div>} />
            <Route path="/tournaments" element={<div style={{color:'white'}}>Tournaments Page Coming Soon...</div>} />
            <Route path="/stats" element={<div style={{color:'white'}}>Stats Page Coming Soon...</div>} />
          </Routes>
        </main>

        <RightPanel tournaments={tournaments} potdMatch={potdMatch} />
      </div>
    </Router>
  );
}

export default App;
