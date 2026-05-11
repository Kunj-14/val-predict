import React from 'react';
import './Navbar.css';

const Navbar = ({ toggleMobileMenu }) => {
  return (
    <nav className="top-navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn icon-btn" onClick={toggleMobileMenu}>
          ☰
        </button>
        <div className="nav-logo">
          <svg width="24" height="24" viewBox="0 0 100 100" fill="var(--valo-red)" xmlns="http://www.w3.org/2000/svg">
            <path d="M99.25 48.66V10.28L83.16 9.4L50 42.56L16.84 9.4L0.75 10.28V48.66L50 97.91L99.25 48.66Z"/>
          </svg>
          <h1>VALPREDICT</h1>
        </div>
        <span className="nav-tagline">AI-Powered Match Insights</span>
      </div>

      <div className="navbar-center">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search teams, players, tournaments..." />
        </div>
      </div>

      <div className="navbar-right">
        <button className="icon-btn notification-btn">
          <span>🔔</span>
          <span className="badge">3</span>
        </button>
        <div className="profile-icon">
          <img src="https://ui-avatars.com/api/?name=User&background=7B5EA7&color=fff" alt="Profile" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
