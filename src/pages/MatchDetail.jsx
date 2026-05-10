import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchDetail } from '../api';
import './MatchDetail.css';

const MatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      setLoading(true);
      try {
        const data = await getMatchDetail(id);
        setMatch(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  if (loading) return <div className="detail-loading">Loading match details...</div>;
  if (!match) return <div className="detail-error">Match not found.</div>;

  const { team1, team2, prediction, status, results, scheduled_time_ist, tournament, match_type } = match;

  const t1Logo = team1?.logo || `https://ui-avatars.com/api/?name=${team1?.name || "T1"}&background=FF4655&color=fff`;
  const t2Logo = team2?.logo || `https://ui-avatars.com/api/?name=${team2?.name || "T2"}&background=7B5EA7&color=fff`;
  const t1Name = team1?.name || "TBA";
  const t2Name = team2?.name || "TBA";
  
  const pTeam1 = prediction?.team1_prob || 50;
  const pTeam2 = prediction?.team2_prob || 50;

  // Mock data for Map Win Rates and Recent Form if missing from API
  const mapStats = match.map_stats || [
    { map: 'Ascent', t1: '65%', t2: '45%' },
    { map: 'Bind', t1: '50%', t2: '70%' },
    { map: 'Split', t1: '80%', t2: '60%' },
  ];
  
  const t1Form = match.team1_form || ['W', 'W', 'L', 'W', 'L'];
  const t2Form = match.team2_form || ['L', 'W', 'W', 'W', 'W'];
  const h2h = match.h2h || "Team 1 leads 3-1 in recent matchups";

  return (
    <div className="match-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      {/* Header Section */}
      <div className="md-header glass-panel">
        <div className="md-tourney">
          {status === 'running' && <span className="badge-live">LIVE</span>}
          {status === 'finished' && <span className="badge-finished">FINISHED</span>}
          <span className="md-tourney-name">{tournament} • {match_type} • {scheduled_time_ist}</span>
        </div>

        <div className="md-teams">
          <div className="md-team">
            <img src={t1Logo} alt={t1Name} />
            <h2>{t1Name}</h2>
            <span>{t1Name.substring(0, 3).toUpperCase()}</span>
          </div>

          <div className="md-vs-center">
            {status === 'finished' && results ? (
              <div className="md-score">
                <span className={results.team1_score > results.team2_score ? 'winner' : ''}>{results.team1_score}</span>
                <span className="score-sep">-</span>
                <span className={results.team2_score > results.team1_score ? 'winner' : ''}>{results.team2_score}</span>
              </div>
            ) : (
              <div className="md-vs">VS</div>
            )}
          </div>

          <div className="md-team md-team-right">
            <span>{t2Name.substring(0, 3).toUpperCase()}</span>
            <h2>{t2Name}</h2>
            <img src={t2Logo} alt={t2Name} />
          </div>
        </div>

        {/* Prediction Bar */}
        <div className="md-prediction-large">
          <div className="pred-labels">
            <span style={{ color: 'var(--valo-red)' }}>{pTeam1.toFixed(1)}%</span>
            <span style={{ color: 'var(--text-secondary)' }}>WIN PROBABILITY</span>
            <span style={{ color: 'var(--accent-purple)' }}>{pTeam2.toFixed(1)}%</span>
          </div>
          <div className="pred-bar-container-large">
            <div className="pred-bar-fill-large" style={{ width: `${pTeam1}%` }}></div>
          </div>
        </div>
      </div>

      {/* Results Box if Finished */}
      {status === 'finished' && results && (
        <div className="md-results-box glass-panel">
          <h3>Match Result Verification</h3>
          <div className="verification-flex">
            <div>
              <p className="res-label">Actual Winner</p>
              <p className="res-value">{results.actual_winner}</p>
            </div>
            <div>
              <p className="res-label">Predicted Winner</p>
              <p className="res-value">{prediction?.predicted_winner || "N/A"}</p>
            </div>
            <div className="verdict">
              {results.prediction_correct ? (
                <span className="verdict-correct">✅ AI Prediction Correct</span>
              ) : (
                <span className="verdict-wrong">❌ AI Prediction Incorrect</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis */}
      <div className="md-analysis glass-panel">
        <div className="section-title">
          <span className="icon">🧠</span>
          <h3>AI Match Analysis</h3>
        </div>
        <p className="ai-reasoning-text">{prediction?.reasoning || "The ML model indicates a tight matchup. Look out for map vetos."}</p>
      </div>

      {/* Stats Grid */}
      <div className="md-stats-grid">
        {/* Head to Head & Form */}
        <div className="md-stat-card glass-panel">
          <h3>Recent Form & H2H</h3>
          <div className="h2h-text">{h2h}</div>
          
          <div className="form-comparison">
            <div className="team-form">
              <span className="form-team-name">{t1Name}</span>
              <div className="form-badges">
                {t1Form.map((f, i) => (
                  <span key={i} className={`form-badge ${f === 'W' ? 'win' : 'loss'}`}>{f}</span>
                ))}
              </div>
            </div>
            <div className="team-form">
              <span className="form-team-name">{t2Name}</span>
              <div className="form-badges">
                {t2Form.map((f, i) => (
                  <span key={i} className={`form-badge ${f === 'W' ? 'win' : 'loss'}`}>{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Win Rates */}
        <div className="md-stat-card glass-panel">
          <h3>Map Win Rates</h3>
          <table className="map-table">
            <thead>
              <tr>
                <th>Map</th>
                <th>{t1Name.substring(0,3).toUpperCase()}</th>
                <th>{t2Name.substring(0,3).toUpperCase()}</th>
              </tr>
            </thead>
            <tbody>
              {mapStats.map((ms, i) => {
                const t1Adv = parseInt(ms.t1) > parseInt(ms.t2);
                const t2Adv = parseInt(ms.t2) > parseInt(ms.t1);
                return (
                  <tr key={i}>
                    <td>{ms.map}</td>
                    <td className={t1Adv ? 'adv' : ''}>{ms.t1}</td>
                    <td className={t2Adv ? 'adv' : ''}>{ms.t2}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default MatchDetail;
