import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', team_id: '' });
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);

  const baseUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`;
  const apiUrl = `${baseUrl}/api/users/`;
  const teamsUrl = `${baseUrl}/api/teams/`;

  const fetchUsers = () => {
    return fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const results = Array.isArray(data) ? data : data.results || [];
        setUsers(results);
      });
  };

  useEffect(() => {
    Promise.all([
      fetchUsers(),
      fetch(teamsUrl)
        .then((r) => r.json())
        .then((data) => setTeams(Array.isArray(data) ? data : data.results || []))
        .catch(() => setTeams([])),
    ])
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      team_id: user.team_id || '',
    });
    setSaveError(null);
  };

  const closeEdit = () => {
    setEditingUser(null);
    setSaveError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    setSaveError(null);
    fetch(`${apiUrl}${editingUser._id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => { throw new Error(JSON.stringify(d)); });
        return res.json();
      })
      .then(() => fetchUsers())
      .then(() => closeEdit())
      .catch((err) => setSaveError(err.message))
      .finally(() => setSaving(false));
  };

  if (loading) return (
    <div className="octofit-spinner-wrapper">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading users...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger d-flex align-items-center" role="alert">
      <i className="me-2">&#9888;</i> {error}
    </div>
  );

  return (
    <>
      <div className="card octofit-card">
        <div className="card-header">
          <h2>&#128100; Users</h2>
        </div>
        <div className="card-body p-0">
          {users.length === 0 ? (
            <p className="octofit-empty">No users found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover octofit-table mb-0">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Team</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const team = teams.find((t) => t._id === user.team_id);
                    return (
                      <tr key={user._id || index}>
                        <td className="text-muted">{index + 1}</td>
                        <td><strong>{user.username}</strong></td>
                        <td><a href={`mailto:${user.email}`} className="text-decoration-none">{user.email}</a></td>
                        <td>
                          {team
                            ? <span className="badge bg-primary">{team.name}</span>
                            : user.team_id
                              ? <span className="badge bg-secondary">{user.team_id}</span>
                              : <span className="text-muted">—</span>}
                        </td>
                        <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEdit(user)}
                          >
                            &#9998; Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card-footer text-muted small">
          {users.length} user{users.length !== 1 ? 's' : ''} total
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">&#9998; Edit User: {editingUser.username}</h5>
                <button type="button" className="btn-close" onClick={closeEdit} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {saveError && (
                  <div className="alert alert-danger">{saveError}</div>
                )}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Team</label>
                  <select
                    className="form-select"
                    name="team_id"
                    value={formData.team_id}
                    onChange={handleChange}
                  >
                    <option value="">— No team —</option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeEdit} disabled={saving}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Users;
