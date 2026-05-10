import React, { useState, useEffect } from 'react';
import { getAccuracyStats } from '../api';

const Predictions = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getAccuracyStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="predictions-page">
      <header className="main-header" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>ML Prediction Accuracy</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>How well is our AI model performing?</p>
      </header>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading accuracy stats...</p>
      ) : stats ? (
        <div className="stats-container glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', fontWeight: '800', color: 'var(--valo-red)' }}>
            {stats.accuracy ? stats.accuracy.toFixed(1) : '0.0'}%
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Overall Win Prediction Accuracy
          </p>
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '32px' }}>
            <div>
              <span style={{ fontSize: '24px', fontWeight: '700' }}>{stats.total_evaluated || 0}</span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Matches Evaluated</p>
            </div>
            <div>
              <span style={{ fontSize: '24px', fontWeight: '700', color: '#00ff00' }}>{stats.correct_predictions || 0}</span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Correct Predictions</p>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ color: 'var(--text-secondary)' }}>No statistics available yet.</p>
      )}
    </div>
  );
};

export default Predictions;
