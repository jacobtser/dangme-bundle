import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../services/api';


const PaymentModal = ({ isOpen, onClose, onSuccess, planType = 'monthly', videoId = null }) => {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = {
    monthly: { name: 'Monthly Plan', price: 9.99, interval: 'month' },
    yearly: { name: 'Yearly Plan', price: 99.99, interval: 'year' },
    lifetime: { name: 'Lifetime Access', price: 499.99, interval: 'lifetime' }
  };

  useEffect(() => {
    setSelectedPlan(plans[planType]);
  }, [planType]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCardInput = (field, value) => {
    let formattedValue = value;
    
    switch (field) {
      case 'number':
        formattedValue = value.replace(/\D/g, '')
          .replace(/(\d{4})/g, '$1 ')
          .trim()
          .substring(0, 19);
        break;
      case 'expiry':
        formattedValue = value.replace(/\D/g, '')
          .replace(/(\d{2})(\d{0,4})/, '$1/$2')
          .substring(0, 7);
        break;
      case 'cvc':
        formattedValue = value.replace(/\D/g, '').substring(0, 4);
        break;
      default:
        formattedValue = value;
    }
    
    setCardDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const validateCard = () => {
    if (!cardDetails.number.replace(/\s/g, '').match(/^\d{16}$/)) {
      return 'Please enter a valid 16-digit card number';
    }
    
    const [month, year] = cardDetails.expiry.split('/');
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return 'Please enter a valid expiry date (MM/YY)';
    }
    
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      return 'Card has expired';
    }
    
    if (!cardDetails.cvc.match(/^\d{3,4}$/)) {
      return 'Please enter a valid CVC';
    }
    
    if (!cardDetails.name.trim()) {
      return 'Please enter the name on card';
    }
    
    return null;
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      const validationError = validateCard();
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }

      // Process payment
      const response = await axios.post('/api/payments/create', {
        planType,
        paymentMethod,
        cardDetails,
        userId: user._id,
        videoId
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(response.data.message || 'Payment failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment processing failed');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('payment-modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="payment-modal-overlay" onClick={handleOutsideClick}>
      <div className="payment-modal">
        {/* Header */}
        <div className="modal-header">
          <h2>Complete Your Purchase</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Success Message */}
        {success ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Payment Successful!</h3>
            <p>Your premium subscription has been activated.</p>
            <p>Redirecting you to the content...</p>
          </div>
        ) : (
          <>
            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Plan:</span>
                  <span>{selectedPlan?.name}</span>
                </div>
                <div className="summary-row">
                  <span>Billing:</span>
                  <span>{selectedPlan?.interval === 'lifetime' 
                    ? 'One-time payment' 
                    : `${selectedPlan?.interval}ly billing`}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span className="total-amount">${selectedPlan?.price}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-methods">
              <h3>Payment Method</h3>
              <div className="method-options">
                <button
                  className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  💳 Credit/Debit Card
                </button>
                <button
                  className={`method-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  🔵 PayPal
                </button>
              </div>
            </div>

            {/* Card Details Form */}
            {paymentMethod === 'card' && (
              <div className="card-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => handleCardInput('number', e.target.value)}
                    className="card-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => handleCardInput('expiry', e.target.value)}
                      className="card-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardDetails.cvc}
                      onChange={(e) => handleCardInput('cvc', e.target.value)}
                      className="card-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Name on Card</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => handleCardInput('name', e.target.value)}
                    className="card-input"
                  />
                </div>

                {/* Security Badges */}
                <div className="security-badges">
                  <div className="security-badge">🔒 256-bit SSL</div>
                  <div className="security-badge">✅ PCI Compliant</div>
                  <div className="security-badge">🛡️ Fraud Protection</div>
                </div>
              </div>
            )}

            {/* PayPal Option */}
            {paymentMethod === 'paypal' && (
              <div className="paypal-option">
                <p>You will be redirected to PayPal to complete your payment.</p>
                <button className="paypal-btn">
                  Continue with PayPal
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="modal-actions">
              <button className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="pay-btn"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  `Pay $${selectedPlan?.price}`
                )}
              </button>
            </div>

            {/* Security Notice */}
            <div className="security-notice">
              <p>🔒 Your payment is secure and encrypted</p>
              <p>Your card details are never stored on our servers</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
