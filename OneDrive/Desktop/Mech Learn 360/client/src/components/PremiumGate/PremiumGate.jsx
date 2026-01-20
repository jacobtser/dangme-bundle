import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import PaymentModal from '../PaymentModal/PaymentModal';
import '../../../styles/components/premium-gate.css';

const PremiumGate = ({ children, requiredLevel = 'premium' }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      features: [
        'Access to beginner videos',
        'Download resources',
        'Community access',
        'Email support'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 19.99,
      features: [
        'Everything in Basic',
        'All video levels',
        'Project files',
        'Priority support',
        'Certificate of completion'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 49.99,
      features: [
        'Everything in Pro',
        'Team management',
        'Custom content',
        'Dedicated support',
        'API access',
        'Analytics dashboard'
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      id: 1,
      content: 'This platform transformed my career. The premium content is worth every penny!',
      author: 'Sarah Johnson',
      title: 'Mechanical Engineer',
      avatar: 'SJ'
    },
    {
      id: 2,
      content: 'Best investment I made in my professional development. The video quality is exceptional.',
      author: 'Michael Chen',
      title: 'CAD Designer',
      avatar: 'MC'
    },
    {
      id: 3,
      content: 'The premium tutorials helped me land my dream job. The community support is amazing.',
      author: 'Alex Rodriguez',
      title: 'Product Designer',
      avatar: 'AR'
    }
  ];

  const faqs = [
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You will continue to have access until the end of your billing period.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee if you are not satisfied with the premium content.'
    },
    {
      question: 'Can I switch plans?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. The changes will take effect at the start of your next billing cycle.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'We offer a 7-day free trial for our Pro plan to let you experience the premium features.'
    }
  ];

  const handleUpgradeClick = (plan) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    setShowPaymentModal(false);
    // Refresh user data or show success message
    alert(`Congratulations! You now have access to ${paymentData.plan.name} plan.`);
  };

  // Check if user has required access level
  const hasAccess = () => {
    if (!isAuthenticated) return false;
    
    if (requiredLevel === 'free') return true;
    if (requiredLevel === 'premium') return user?.subscription?.active;
    if (requiredLevel === 'pro') return user?.subscription?.plan === 'pro' || user?.subscription?.plan === 'enterprise';
    if (requiredLevel === 'enterprise') return user?.subscription?.plan === 'enterprise';
    
    return false;
  };

  if (hasAccess()) {
    return children;
  }

  return (
    <div className="premium-gate">
      <div className="premium-card">
        <div className="premium-header">
          <div className="premium-icon">⭐</div>
          <h1>Unlock Premium Content</h1>
          <p className="premium-tagline">
            Upgrade your learning experience with exclusive content, advanced features, and premium support
          </p>
          <span className="premium-badge">Most Popular</span>
        </div>

        {/* Premium Features */}
        <div className="premium-features">
          <h2>What You'll Get</h2>
          <ul className="features-list">
            <li className="feature-item">
              <div className="feature-icon">🎥</div>
              <div className="feature-content">
                <h3>Premium Video Library</h3>
                <p>Access exclusive tutorials, case studies, and expert interviews</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-icon">📁</div>
              <div className="feature-content">
                <h3>Project Files & Resources</h3>
                <p>Download source files, templates, and reference materials</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-icon">👨‍🏫</div>
              <div className="feature-content">
                <h3>1-on-1 Mentoring</h3>
                <p>Get personalized guidance from industry experts</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-icon">📜</div>
              <div className="feature-content">
                <h3>Certification</h3>
                <p>Earn recognized certificates for completed courses</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-icon">⚡</div>
              <div className="feature-content">
                <h3>No Ads Experience</h3>
                <p>Learn without interruptions or distractions</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Pricing Plans */}
        <div className="premium-action">
          <h2>Choose Your Plan</h2>
          <div className="options-grid">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`option-card ${plan.popular ? 'popular' : ''}`}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <h3 className="option-title">{plan.name}</h3>
                <div className="option-price">${plan.price}<span>/month</span></div>
                <p className="option-period">Billed monthly</p>
                
                <ul className="option-features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                
                <button 
                  className={`option-button ${plan.popular ? 'popular' : ''}`}
                  onClick={() => handleUpgradeClick(plan)}
                >
                  {isAuthenticated ? 'Upgrade Now' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>

          <div className="security-note">
            <div className="security-icon">🔒</div>
            <span>Secure payment · 30-day money-back guarantee</span>
          </div>

          <div className="trial-note">
            <strong>7-day free trial</strong> available for Pro plan. No credit card required to start trial.
          </div>
        </div>

        {/* Testimonials */}
        <div className="premium-testimonials">
          <div className="testimonials-header">
            <h2>Join 5,000+ Satisfied Learners</h2>
            <p>See what our premium members are saying</p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <p className="testimonial-content">{testimonial.content}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <h4>{testimonial.author}</h4>
                    <p className="author-title">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="premium-faq">
          <div className="faq-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about premium membership</p>
          </div>
          
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Already have account? */}
        {isAuthenticated && user?.subscription?.active && (
          <div className="alternative-options">
            <p>
              Already a premium member? <Link to="/dashboard">Go to Dashboard</Link>
            </p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default PremiumGate;