import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

const Home = () => {
  return (
    <div className="page-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to Mech Learn 360</h1>
        <p className="hero-subtitle">Master Mechanical Engineering with Interactive Learning</p>
        
        <div className="hero-features">
          <div className="feature">
            <h3>📚 Comprehensive Courses</h3>
            <p>Learn from basic to advanced mechanical concepts</p>
          </div>
          <div className="feature">
            <h3>🎬 Video Tutorials</h3>
            <p>Watch detailed explanations and demonstrations</p>
          </div>
          <div className="feature">
            <h3>🎓 Expert Instructors</h3>
            <p>Learn from industry professionals and professors</p>
          </div>
        </div>
        
        <div className="hero-actions">
          <Link to="/videos" className="primary-button">Browse Videos</Link>
          <Link to="/register" className="secondary-button">Start Learning Free</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;