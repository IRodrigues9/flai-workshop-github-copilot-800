import React, { useState, useEffect } from 'react';

const ACTIVITY_COLORS = {
  running:   'success',
  cycling:   'info',
  swimming:  'primary',
  walking:   'secondary',
  hiking:    'warning',
  weightlifting: 'danger',
};

function activityBadge(type) {
  const color = ACTIVITY_COLORS[(type || '').toLowerCase()] || 'secondary';
  return <span className={`badge bg-${color}`}>{type}</span>;
}

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;

  useEffect(() => {
    console.log('Activities component: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const results = Array.isArray(data) ? data : data.results || [];
        setActivities(results);
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
        <span className="visually-hidden">Loading activities...</span>
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
        <h2>&#127939; Activities</h2>
      </div>
      <div className="card-body p-0">
        {activities.length === 0 ? (
          <p className="octofit-empty">No activities found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover octofit-table mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">User ID</th>
                  <th scope="col">Activity Type</th>
                  <th scope="col">Duration (min)</th>
                  <th scope="col">Calories Burned</th>
                  <th scope="col">Distance (km)</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => (
                  <tr key={activity._id || index}>
                    <td className="text-muted">{index + 1}</td>
                    <td>{activity.user_id}</td>
                    <td>{activityBadge(activity.activity_type)}</td>
                    <td>{activity.duration}</td>
                    <td>{activity.calories_burned}</td>
                    <td>{activity.distance != null ? activity.distance : <span className="text-muted">—</span>}</td>
                    <td>{activity.date ? new Date(activity.date).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card-footer text-muted small">
        {activities.length} activit{activities.length !== 1 ? 'ies' : 'y'} total
      </div>
    </div>
  );
}

export default Activities;
