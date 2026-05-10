import React from 'react';
import { Link } from 'react-router-dom';
import './MatchCard.css';

const MatchCard = ({ match }) => {
  const { scheduled_time_ist, tournament, match_type, status, team1, team2, prediction } = match;
  
  // Parse date and time if available
  let dateStr = "TBA";
  let timeStr = "";
  if (scheduled_time_ist) {
    const parts = scheduled_time_ist.split(" ");
    if (parts.length >= 3) {
      dateStr = parts[0];
      timeStr = parts[1] + " " + parts[2];
    } else {
      dateStr = scheduled_time_ist;
    }
  }

  // Default Prediction if missing
  const pTeam1 = prediction?.team1_prob || 50;
  const pTeam2 = prediction?.team2_prob || 50;
  
  // Fallback logos if none from api
  const t1Logo = team1?.logo || "https://ui-avatars.com/api/?name=" + (team1?.name || "T1") + "&background=FF4655&color=fff";
  const t2Logo = team2?.logo || "https://ui-avatars.com/api/?name=" + (team2?.name || "T2") + "&background=7B5EA7&color=fff";
  
  const t1Name = team1?.name || "TBD";
  const t2Name = team2?.name || "TBD";

  return (
    <div className="match-card glass-panel">
      <div className="mc-top">
        <div className="mc-datetime">
          <span className="mc-time">{timeStr}</span>
          <span className="mc-date">{dateStr}</span>
        </div>
        
        <div className="mc-teams-area">
          <div className="mc-team t1">
            <img src={t1Logo} alt={t1Name} className="mc-logo" />
            <div className="mc-team-info">
              <span className="mc-team-name">{t1Name}</span>
              <span className="mc-team-tag">{t1Name.substring(0, 3).toUpperCase()}</span>
            </div>
          </div>
          
          <div className="mc-vs-area">
            <div className="mc-tourney-info">
              {status === 'running' && <span className="badge-live">LIVE</span>}
              <span className="badge-tourney" title={tournament}>{tournament.length > 20 ? tournament.substring(0, 20) + "..." : tournament}</span>
              <span className="badge-type">{match_type}</span>
            </div>
            <div className="mc-vs-text">VS</div>
          </div>
          
          <div className="mc-team t2">
            <div className="mc-team-info right-text">
              <span className="mc-team-name">{t2Name}</span>
              <span className="mc-team-tag">{t2Name.substring(0, 3).toUpperCase()}</span>
            </div>
            <img src={t2Logo} alt={t2Name} className="mc-logo" />
          </div>
        </div>
      </div>

      <div className="mc-bottom">
        <div className="mc-prediction">
          <div className="pred-labels">
            <span className="pred-val t1-val" style={{ color: 'var(--valo-red)' }}>{pTeam1.toFixed(1)}%</span>
            <span className="pred-val t2-val" style={{ color: 'var(--accent-purple)' }}>{pTeam2.toFixed(1)}%</span>
          </div>
          <div className="pred-bar-container">
            <div className="pred-bar-fill" style={{ width: `${pTeam1}%` }}></div>
          </div>
        </div>
        
        <div className="mc-actions">
          <Link to={`/match/${match.match_id || match.id}`} className="btn-view" style={{ textDecoration: 'none', display: 'inline-block' }}>View Match</Link>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
