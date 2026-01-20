import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PaymentModal from '../PaymentModal/PaymentModal';


const PremiumGate = ({ video = null, redirectTo = null }) => {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [planType, setPlanType] = useState('monthly');

  // If user is already premium, redirect to video
  if (isPremium && video) {
    navigate(`/watch/${video._id}`);
    return null;
  }

  const handleUpgradeClick = () => {
    if (!user) {
      navigate('/login', { state: { from: redirectTo || `/watch/${video?._id}` } });
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePlanSelect = (plan) => {
    setPlanType(plan);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    if (video) {
      navigate(`/watch/${video._id}`);
    } else if (redirectTo) {
      navigate(redirectTo);
    }
  };

  const benefits = [
    'Access to all premium videos',
    'Ad-free viewing experience',
    'Download videos for offline viewing',
    'Early access to new content',
    'HD and 4K streaming quality',
    'Exclusive content and behind-the-scenes'
  ];

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: '$9.99',
      period: 'per month',
      popular: false,
      savings: ''
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: '$99.99',
      period: 'per year',
      popular: true,
      savings: 'Save 17%'
    },
    {
      id: 'lifetime',
      name: 'Lifetime Access',
      price: '$499.99',
      period: 'one-time payment',
      popular: false,
      savings: 'Best Value'
    }
  ];

  return (
    <div className="premium-gate-container">
      {/* Hero Section */}
      <div className="premium-hero">
        <div className="premium-hero-content">
          <div className="premium-badge">PREMIUM</div>
          <h1 className="premium-title">
            {video ? 'Premium Video Locked' : 'Unlock Premium Content'}
          </h1>
          <p className="premium-subtitle">
            {video 
              ? `"${video.title}" is exclusive to Premium members`
              : 'Get access to exclusive content, ad-free viewing, and more'}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="premium-content">
        <div className="premium-benefits">
          <h2>Why Go Premium?</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-item">
                <div className="benefit-icon">✓</div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Video Preview (if video provided) */}
        {video && (
          <div className="video-preview">
            <div className="preview-thumbnail">
              <img src={video.thumbnail} alt={video.title} />
              <div className="preview-overlay">
                <div className="preview-lock">🔒</div>
                <p>Premium Content Locked</p>
              </div>
            </div>
            <div className="preview-info">
              <h3>{video.title}</h3>
              <p>{video.description?.substring(0, 150)}...</p>
              <div className="video-meta">
                <span>Duration: {video.duration}</span>
                <span>Views: {video.views?.toLocaleString()}</span>
                <span>Published: {new Date(video.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="pricing-section">
          <h2>Choose Your Plan</h2>
          <p className="pricing-subtitle">Cancel anytime, no questions asked</p>
          
          <div className="pricing-plans">
            {plans.map(plan => (
              <div 
                key={plan.id}
                className={`pricing-plan ${plan.popular ? 'popular' : ''} ${planType === plan.id ? 'selected' : ''}`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && <div className="popular-badge">MOST POPULAR</div>}
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="plan-savings">{plan.savings}</div>
                  )}
                </div>
                <div className="plan-features">
                  <ul>
                    <li>All Premium Content</li>
                    <li>No Ads</li>
                    <li>Offline Downloads</li>
                    <li>HD Quality</li>
                    {plan.id === 'yearly' && <li>Free month annually</li>}
                    {plan.id === 'lifetime' && <li>Lifetime Updates</li>}
                  </ul>
                </div>
                <button 
                  className="select-plan-btn"
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {planType === plan.id ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Button */}
        <div className="upgrade-section">
          <button 
            className="upgrade-btn"
            onClick={handleUpgradeClick}
          >
            {user ? 'Upgrade to Premium' : 'Login to Subscribe'}
          </button>
          <p className="upgrade-note">
            {user 
              ? 'You will be redirected to secure payment'
              : 'You need to login first before subscribing'}
          </p>
        </div>

        {/* Testimonials */}
        <div className="testimonials">
          <h2>What Our Premium Members Say</h2>
          <div className="testimonial-cards">
            <div className="testimonial-card">
              <p>"The premium content is absolutely worth it! The exclusive videos are incredible."</p>
              <div className="testimonial-author">
                <strong>Alex Johnson</strong>
                <span>Premium Member</span>
              </div>
            </div>
            <div className="testimonial-card">
              <p>"Ad-free viewing changed my experience. I can finally watch without interruptions."</p>
              <div className="testimonial-author">
                <strong>Maria Garcia</strong>
                <span>Premium Member</span>
              </div>
            </div>
            <div className="testimonial-card">
              <p="Best investment for learning. The quality and depth of content is unmatched."</p>
              <div className="testimonial-author">
                <strong>David Chen</strong>
                <span>Premium Member</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          planType={planType}
          videoId={video?._id}
        />
      )}
    </div>
  );
};

export default PremiumGate;
