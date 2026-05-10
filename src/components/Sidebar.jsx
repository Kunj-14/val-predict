import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { name: 'Home', icon: '⌂', id: '/' },
    { name: 'Live Matches', icon: '🔴', id: '/live' },
    { name: 'Upcoming Matches', icon: '📅', id: '/upcoming' },
    { name: 'Past Matches', icon: '⏱️', id: '/past' },
    { name: 'Predictions', icon: '🎯', id: '/predictions' },
    { name: 'Teams', icon: '🛡️', id: '/teams' },
    { name: 'Tournaments', icon: '🏆', id: '/tournaments' },
    { name: 'Stats', icon: '📊', id: '/stats' }
  ];

  return (
    <aside className="sidebar glass-panel">
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item, index) => (
            <li key={item.id} className="nav-item">
              <NavLink to={item.id} className={({ isActive }) => (isActive ? 'active' : '')}>
                <span className="icon">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="btn-primary">Connect Riot ID</button>
      </div>
    </aside>
  );
};

export default Sidebar;
