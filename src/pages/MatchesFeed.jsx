import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MatchCard from '../components/MatchCard';
import { getUpcomingMatches, getLiveMatches, getPastMatches } from '../api';

const MatchesFeed = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        let data = [];
        if (location.pathname === '/live') {
          data = await getLiveMatches();
        } else if (location.pathname === '/past') {
          data = await getPastMatches();
        } else {
          // Default to upcoming for '/', '/upcoming', etc.
          data = await getUpcomingMatches();
        }
        setMatches(data || []);
      } catch (error) {
        console.error("Failed to load matches feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [location.pathname]);

  const getTitle = () => {
    if (location.pathname === '/live') return 'Live Matches';
    if (location.pathname === '/past') return 'Past Matches';
    return 'Upcoming Matches';
  };

  const getSubtitle = () => {
    if (location.pathname === '/live') return 'Matches happening right now across the globe.';
    if (location.pathname === '/past') return 'Review historical data and ML prediction accuracy.';
    return 'Make your predictions and climb the leaderboard.';
  };

  return (
    <div className="matches-feed-page">
      <header className="main-header" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{getTitle()}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{getSubtitle()}</p>
      </header>

      <div className="matches-feed">
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading match data...</p>
        ) : matches.length > 0 ? (
          matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No matches found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default MatchesFeed;
