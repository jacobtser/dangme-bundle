import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Pages.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>Your Learning Dashboard</h1>
        <p>Welcome back, {user?.email}</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📊 Progress Overview</h3>
          <p>Courses Completed: 3/10</p>
          <p>Hours Learned: 15</p>
          <p>Current Streak: 5 days</p>
        </div>
        
        <div className="dashboard-card">
          <h3>🎯 Recent Activity</h3>
          <ul>
            <li>Completed "Thermodynamics Basics"</li>
            <li>Started "Fluid Mechanics"</li>
            <li>Watched 3 videos yesterday</li>
          </ul>
        </div>
        
        <div className="dashboard-card">
          <h3>🚀 Recommended Next</h3>
          <p>Continue with "Material Science"</p>
          <Link to="/videos" className="card-button">Continue Learning</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>⭐ Premium Features</h3>
          <p>{user?.isPremium ? 'You have Premium Access!' : 'Upgrade for advanced features'}</p>
          {!user?.isPremium && (
            <Link to="/premium" className="card-button premium">Upgrade Now</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;