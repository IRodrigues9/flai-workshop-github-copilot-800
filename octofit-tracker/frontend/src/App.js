import './App.css';
import { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import octofitLogo from './OctofitLogo.svg';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';

function App() {
  const [navOpen, setNavOpen] = useState(false);

  const navLinks = [
    { to: '/users',       label: 'Users' },
    { to: '/teams',       label: 'Teams' },
    { to: '/activities',  label: 'Activities' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/workouts',    label: 'Workouts' },
  ];

  return (
    <div>
      {/* ── Navbar ── */}
      <nav className="navbar navbar-expand-lg octofit-navbar">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <img src={octofitLogo} alt="OctoFit logo" className="octofit-navbar-logo" />
            OctoFit Tracker
          </NavLink>

          {/* Hamburger toggle */}
          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className={`collapse navbar-collapse${navOpen ? ' show' : ''}`}>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {navLinks.map(({ to, label }) => (
                <li className="nav-item" key={to}>
                  <NavLink
                    className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                    to={to}
                    onClick={() => setNavOpen(false)}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* ── Page content ── */}
      <div className="container mt-4 mb-5">
        <Routes>
          <Route path="/" element={
            <div className="octofit-hero">
              <h1>&#127939; Welcome to OctoFit Tracker</h1>
              <p className="lead">
                Track your fitness activities, manage teams, and compete on the leaderboard.
              </p>
              <div className="d-flex flex-wrap gap-2 mt-4">
                {navLinks.map(({ to, label }) => (
                  <NavLink key={to} to={to} className="btn btn-light btn-lg fw-semibold">
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          } />
          <Route path="/users"       element={<Users />} />
          <Route path="/teams"       element={<Teams />} />
          <Route path="/activities"  element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts"    element={<Workouts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
