import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import '../../../styles/components/payment-modal.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ plan, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    country: 'US',
    zipCode: ''
  });

  useEffect(() => {
    // Fetch client secret from backend
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post('/api/payments/create-intent', {
          amount: plan.price * 100, // Convert to cents
          currency: 'usd',
          planId: plan.id
        });
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        setError('Failed to initialize payment. Please try again.');
      }
    };

    createPaymentIntent();
  }, [plan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;

      if (paymentMethod === 'card') {
        const cardElement = elements.getElement(CardElement);
        
        result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: billingDetails
          }
        });
      } else if (paymentMethod === 'paypal') {
        // Handle PayPal integration
        result = await stripe.confirmPayPalPayment(clientSecret, {
          return_url: `${window.location.origin}/payment-success`,
        });
      }

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // Save subscription to backend
          await axios.post('/api/subscriptions/create', {
            planId: plan.id,
            paymentIntentId: result.paymentIntent.id,
            paymentMethod
          });
          
          onSuccess({
            plan,
            paymentId: result.paymentIntent.id,
            date: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Complete Your Purchase</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          {/* Progress Steps */}
          <div className="payment-progress">
            <div className="progress-steps active-1">
              <div className="progress-step active">
                <div className="step-circle">1</div>
                <span className="step-label">Plan</span>
              </div>
              <div className="progress-step active">
                <div className="step-circle">2</div>
                <span className="step-label">Payment</span>
              </div>
              <div className="progress-step">
                <div className="step-circle">3</div>
                <span className="step-label">Complete</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-header">
              <h3>Order Summary</h3>
              <a href="#change" className="edit-plan">Change Plan</a>
            </div>
            
            <div className="plan-details">
              <h4 className="plan-name">{plan.name}</h4>
              <div className="plan-price">${plan.price}<span>/month</span></div>
              <p className="plan-billing">Billed monthly, cancel anytime</p>
              
              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="summary-items">
              <div className="summary-item">
                <span>Monthly subscription</span>
                <span>${plan.price}</span>
              </div>
              <div className="summary-item">
                <span>Tax</span>
                <span>${(plan.price * 0.08).toFixed(2)}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>${(plan.price * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="payment-methods">
            <h3>Select Payment Method</h3>
            <div className="methods-grid">
              <div 
                className={`method-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="method-icon">💳</div>
                <div className="method-name">Credit/Debit Card</div>
                <div className="method-description">Visa, Mastercard, Amex</div>
              </div>
              
              <div 
                className={`method-card ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('paypal')}
              >
                <div className="method-icon">🔵</div>
                <div className="method-name">PayPal</div>
                <div className="method-description">Pay with PayPal</div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="card-form">
            {paymentMethod === 'card' && (
              <>
                <div className="form-section">
                  <h3>Billing Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={billingDetails.name}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={billingDetails.email}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    
                    <div className="form-group-full">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={billingDetails.address}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="123 Main St"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        name="city"
                        value={billingDetails.city}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="New York"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={billingDetails.zipCode}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Card Details</h3>
                  <div className="card-element-container">
                    <CardElement 
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                              color: '#aab7c4',
                            },
                          },
                          invalid: {
                            color: '#9e2146',
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="card-icons">
                    <div className="card-icon">VISA</div>
                    <div className="card-icon">MC</div>
                    <div className="card-icon">AMEX</div>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <p className="error-message">{error}</p>
              </div>
            )}

            {/* Security Info */}
            <div className="security-info">
              <div className="security-icon">🔒</div>
              <div className="security-text">
                Your payment is secure and encrypted. We never store your card details.
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="back-button" onClick={onClose}>
            ← Back
          </button>
          
          <div className="price-display">
            <div className="price-total">${(plan.price * 1.08).toFixed(2)}</div>
            <div className="price-note">per month</div>
          </div>

          <button 
            type="submit" 
            className={`pay-button ${loading ? 'processing' : ''}`}
            onClick={handleSubmit}
            disabled={!stripe || loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Processing...
              </>
            ) : (
              `Pay $${(plan.price * 1.08).toFixed(2)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const PaymentModal = ({ isOpen, onClose, plan, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm plan={plan} onSuccess={onSuccess} onClose={onClose} />
    </Elements>
  );
};

export default PaymentModal;