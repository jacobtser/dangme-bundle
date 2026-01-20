import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

const Payment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      alert('Payment Successful! Premium features activated.');
      navigate('/dashboard');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="page-container">
      <div className="payment-container">
        <div className="payment-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <span>Yearly Premium Plan</span>
            <span>$199.00</span>
          </div>
          <div className="summary-item">
            <span>Tax</span>
            <span>$0.00</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>$199.00</span>
          </div>
        </div>

        <div className="payment-form">
          <h2>Payment Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Cardholder Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="form-row">
              <label>Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                placeholder="4242 4242 4242 4242"
                maxLength="16"
                required
              />
            </div>
            
            <div className="form-row-group">
              <div className="form-row">
                <label>Expiry Date</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="MM/YY"
                  maxLength="4"
                  required
                />
              </div>
              
              <div className="form-row">
                <label>CVC</label>
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="123"
                  maxLength="3"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="pay-button" disabled={loading}>
              {loading ? 'Processing...' : `Pay $199.00`}
            </button>
            
            <p className="payment-note">
              Your payment is secured with 256-bit SSL encryption.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;