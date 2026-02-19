import React, { useState, useEffect } from 'react';

function rankBadge(rank) {
  if (rank === 1) return <span className="badge rank-gold   fs-6">&#129351; 1st</span>;
  if (rank === 2) return <span className="badge rank-silver fs-6">&#129352; 2nd</span>;
  if (rank === 3) return <span className="badge rank-bronze fs-6">&#129353; 3rd</span>;
  return <span className="badge bg-secondary">{rank}</span>;
}

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;

  useEffect(() => {
    console.log('Leaderboard component: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const results = Array.isArray(data) ? data : data.results || [];
        setLeaderboard(results);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) return (
    <div className="octofit-spinner-wrapper">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading leaderboard...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger d-flex align-items-center" role="alert">
      <i className="me-2">&#9888;</i> {error}
    </div>
  );

  return (
    <div className="card octofit-card">
      <div className="card-header">
        <h2>&#127941; Leaderboard</h2>
      </div>
      <div className="card-body p-0">
        {leaderboard.length === 0 ? (
          <p className="octofit-empty">No leaderboard entries found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover octofit-table mb-0">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Username</th>
                  <th scope="col">Team</th>
                  <th scope="col">Total Activities</th>
                  <th scope="col">Total Calories</th>
                  <th scope="col">Total Distance (km)</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={entry._id || index} className={entry.rank <= 3 ? 'fw-semibold' : ''}>
                    <td>{rankBadge(entry.rank)}</td>
                    <td>{entry.username}</td>
                    <td><span className="badge bg-primary">{entry.team_name}</span></td>
                    <td>{entry.total_activities}</td>
                    <td>{entry.total_calories}</td>
                    <td>{entry.total_distance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card-footer text-muted small">
        {leaderboard.length} entr{leaderboard.length !== 1 ? 'ies' : 'y'} on the board
      </div>
    </div>
  );
}

export default Leaderboard;
