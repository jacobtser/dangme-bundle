import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <nav className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">Mech Learn 360</Link>
        </div>
        
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/videos">Videos</Link>
          <Link to="/premium">Premium</Link>
          {user && <Link to="/dashboard">Dashboard</Link>}
        </div>

        <div className="nav-auth">
          {!user ? (
            <>
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/register" className="auth-link register">Register</Link>
            </>
          ) : (
            <div className="user-info">
              <span className="user-email">Welcome, {user.email}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;