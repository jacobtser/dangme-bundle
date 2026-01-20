import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

const Premium = () => {
  const features = [
    'Access to all premium videos',
    'Download course materials',
    'One-on-one expert sessions',
    'Certificate of completion',
    'Priority support',
    'Offline viewing'
  ];

  return (
    <div className="page-container">
      <div className="premium-header">
        <h1>Upgrade to Premium</h1>
        <p>Unlock full access to Mech Learn 360</p>
      </div>

      <div className="pricing-cards">
        <div className="pricing-card">
          <h3>Monthly Plan</h3>
          <div className="price">$19.99<span>/month</span></div>
          <ul className="features-list">
            {features.map((feature, index) => (
              <li key={index}>✓ {feature}</li>
            ))}
          </ul>
          <Link to="/payment" className="pricing-button">Choose Monthly</Link>
        </div>
        
        <div className="pricing-card popular">
          <div className="popular-badge">MOST POPULAR</div>
          <h3>Yearly Plan</h3>
          <div className="price">$199<span>/year</span></div>
          <p className="savings">Save $40 compared to monthly</p>
          <ul className="features-list">
            {features.map((feature, index) => (
              <li key={index}>✓ {feature}</li>
            ))}
          </ul>
          <Link to="/payment" className="pricing-button popular-btn">Choose Yearly</Link>
        </div>
        
        <div className="pricing-card">
          <h3>Lifetime Access</h3>
          <div className="price">$499<span>/once</span></div>
          <ul className="features-list">
            {features.map((feature, index) => (
              <li key={index}>✓ {feature}</li>
            ))}
            <li>✓ Lifetime updates</li>
          </ul>
          <Link to="/payment" className="pricing-button">Get Lifetime</Link>
        </div>
      </div>
    </div>
  );
};

export default Premium;