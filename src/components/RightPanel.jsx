import React from 'react';
import './RightPanel.css';

const RightPanel = ({ tournaments, potdMatch }) => {
  
  // Format POTD if we have a match
  const potd = potdMatch ? {
    team1: potdMatch.team1?.name || "T1",
    team2: potdMatch.team2?.name || "T2",
    t1Logo: potdMatch.team1?.logo || "https://ui-avatars.com/api/?name=T1&background=FF4655&color=fff",
    t2Logo: potdMatch.team2?.logo || "https://ui-avatars.com/api/?name=T2&background=7B5EA7&color=fff",
    prob1: potdMatch.prediction?.team1_prob || 50,
    prob2: potdMatch.prediction?.team2_prob || 50,
    reasoning: potdMatch.prediction?.reasoning || "A close matchup based on historical data.",
  } : null;

  return (
    <aside className="right-panel">
      
      {/* Prediction of the Day */}
      <div className="panel-section glass-panel highlight-section">
        <div className="section-header">
          <h2>Prediction of the Day</h2>
          <span className="live-indicator"></span>
        </div>
        
        {potd ? (
          <div className="potd-card">
            <div className="potd-teams">
              <div className="potd-t">
                <img src={potd.t1Logo} alt={potd.team1} />
                <span className={potd.prob1 > potd.prob2 ? "winner-text" : ""}>{potd.team1}</span>
              </div>
              <span className="potd-vs">vs</span>
              <div className="potd-t">
                <span className={potd.prob2 > potd.prob1 ? "winner-text" : ""}>{potd.team2}</span>
                <img src={potd.t2Logo} alt={potd.team2} />
              </div>
            </div>
            
            <div className="potd-win-prob">
              <span className="prob-large">
                {potd.prob1 > potd.prob2 ? potd.prob1.toFixed(1) : potd.prob2.toFixed(1)}%
              </span>
              <span className="prob-label">Win Probability</span>
            </div>
            
            <p className="potd-desc">{potd.reasoning}</p>
            <button className="btn-primary potd-btn">View Analysis</button>
          </div>
        ) : (
          <div className="potd-card"><p className="potd-desc">Loading POTD...</p></div>
        )}
      </div>

      {/* Upcoming Tournaments */}
      <div className="panel-section glass-panel">
        <div className="section-header">
          <h2>Upcoming Tournaments</h2>
        </div>
        
        <div className="tournament-list">
          {tournaments && tournaments.length > 0 ? (
            tournaments.slice(0, 3).map((tourney, idx) => {
              const startDate = tourney.begin_at ? new Date(tourney.begin_at).toLocaleDateString() : "TBA";
              const endDate = tourney.end_at ? new Date(tourney.end_at).toLocaleDateString() : "TBA";
              
              return (
                <div key={tourney.id || idx} className="tournament-item">
                  <div className="tourney-icon">
                    <img src={tourney.league?.image_url || `https://ui-avatars.com/api/?name=${tourney.name}&background=7B5EA7&color=fff`} alt="T" />
                  </div>
                  <div className="tourney-info">
                    <h4>{tourney.name || "Tournament Name"}</h4>
                    <p>{tourney.tier ? tourney.tier.toUpperCase() : "Tier Unknown"} • {startDate}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="potd-desc">No upcoming tournaments found.</p>
          )}
        </div>
      </div>

    </aside>
  );
};

export default RightPanel;
