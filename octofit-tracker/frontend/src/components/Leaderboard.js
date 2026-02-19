import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;

  useEffect(() => {
    console.log('Leaderboard component: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Leaderboard component: fetched data', data);
        const results = Array.isArray(data) ? data : data.results || [];
        setLeaderboard(results);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Leaderboard component: error fetching data', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) return <div className="container mt-4"><p>Loading leaderboard...</p></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-4">
      <h2>Leaderboard</h2>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Team</th>
            <th>Total Activities</th>
            <th>Total Calories</th>
            <th>Total Distance (km)</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry._id || index}>
              <td>{entry.rank}</td>
              <td>{entry.username}</td>
              <td>{entry.team_name}</td>
              <td>{entry.total_activities}</td>
              <td>{entry.total_calories}</td>
              <td>{entry.total_distance}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {leaderboard.length === 0 && <p>No leaderboard entries found.</p>}
    </div>
  );
}

export default Leaderboard;
