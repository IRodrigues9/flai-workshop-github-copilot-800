import React, { useState, useEffect } from 'react';

const DIFFICULTY_COLORS = {
  easy:   'success',
  medium: 'warning',
  hard:   'danger',
};

function difficultyBadge(level) {
  const color = DIFFICULTY_COLORS[(level || '').toLowerCase()] || 'secondary';
  return <span className={`badge bg-${color}`}>{level}</span>;
}

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

  useEffect(() => {
    console.log('Workouts component: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const results = Array.isArray(data) ? data : data.results || [];
        setWorkouts(results);
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
        <span className="visually-hidden">Loading workouts...</span>
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
        <h2>&#128170; Workouts</h2>
      </div>
      <div className="card-body p-0">
        {workouts.length === 0 ? (
          <p className="octofit-empty">No workouts found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover octofit-table mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Difficulty</th>
                  <th scope="col">Duration (min)</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout, index) => (
                  <tr key={workout._id || index}>
                    <td className="text-muted">{index + 1}</td>
                    <td><strong>{workout.name}</strong></td>
                    <td><span className="badge bg-info text-dark">{workout.category}</span></td>
                    <td>{difficultyBadge(workout.difficulty)}</td>
                    <td>{workout.duration}</td>
                    <td className="text-muted">{workout.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card-footer text-muted small">
        {workouts.length} workout{workouts.length !== 1 ? 's' : ''} available
      </div>
    </div>
  );
}

export default Workouts;
