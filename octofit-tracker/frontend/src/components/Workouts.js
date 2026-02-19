import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

  useEffect(() => {
    console.log('Workouts component: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Workouts component: fetched data', data);
        const results = Array.isArray(data) ? data : data.results || [];
        setWorkouts(results);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Workouts component: error fetching data', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) return <div className="container mt-4"><p>Loading workouts...</p></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-4">
      <h2>Workouts</h2>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Duration (min)</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((workout, index) => (
            <tr key={workout._id || index}>
              <td>{workout.name}</td>
              <td>{workout.category}</td>
              <td>{workout.difficulty}</td>
              <td>{workout.duration}</td>
              <td>{workout.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {workouts.length === 0 && <p>No workouts found.</p>}
    </div>
  );
}

export default Workouts;
