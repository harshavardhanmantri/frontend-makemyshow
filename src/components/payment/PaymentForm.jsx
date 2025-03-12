import React from 'react';
import { Field, ErrorMessage } from 'formik';
import '../../styles/components/payment.css';

const PaymentForm = ({ paymentMethod, formikProps }) => {
  const renderCardForm = () => {
    return (
      <div className="card-payment-form">
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <Field
            type="text"
            id="cardNumber"
            name="cardNumber"
            className="form-control"
            placeholder="1234 5678 9012 3456"
            maxLength="16"
          />
          <ErrorMessage name="cardNumber" component="div" className="form-error" />
        </div>
        
        <div className="form-group">
          <label htmlFor="cardName">Name on Card</label>
          <Field
            type="text"
            id="cardName"
            name="cardName"
            className="form-control"
            placeholder="John Doe"
          />
          <ErrorMessage name="cardName" component="div" className="form-error" />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <Field
              type="text"
              id="expiryDate"
              name="expiryDate"
              className="form-control"
              placeholder="MM/YY"
              maxLength="5"
            />
            <ErrorMessage name="expiryDate" component="div" className="form-error" />
          </div>
          
          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <Field
              type="password"
              id="cvv"
              name="cvv"
              className="form-control"
              placeholder="123"
              maxLength="4"
            />
            <ErrorMessage name="cvv" component="div" className="form-error" />
          </div>
        </div>
        
        <div className="form-group remember-card">
          <Field type="checkbox" id="saveCard" name="saveCard" />
          <label htmlFor="saveCard">Save card for future payments</label>
        </div>
      </div>
    );
  };
  
  const renderUpiForm = () => {
    return (
      <div className="upi-payment-form">
        <div className="form-group">
          <label htmlFor="upiId">UPI ID</label>
          <Field
            type="text"
            id="upiId"
            name="upiId"
            className="form-control"
            placeholder="username@upi"
          />
          <ErrorMessage name="upiId" component="div" className="form-error" />
        </div>
        
        <div className="payment-instructions">
          <p>Enter your UPI ID and click "Pay" to initiate payment</p>
          <p>You will receive a payment request on your UPI app</p>
        </div>
      </div>
    );
  };
  
  const renderNetBankingForm = () => {
    return (
      <div className="netbanking-payment-form">
        <div className="form-group">
          <label htmlFor="bankName">Select Bank</label>
          <Field as="select" id="bankName" name="bankName" className="form-control">
            <option value="">--Select Bank--</option>
            <option value="SBI">State Bank of India</option>
            <option value="HDFC">HDFC Bank</option>
            <option value="ICICI">ICICI Bank</option>
            <option value="Axis">Axis Bank</option>
            <option value="Kotak">Kotak Mahindra Bank</option>
          </Field>
          <ErrorMessage name="bankName" component="div" className="form-error" />
        </div>
        
        <div className="payment-instructions">
          <p>You will be redirected to your bank's website to complete the payment</p>
        </div>
      </div>
    );
  };
  
  const renderWalletForm = () => {
    return (
      <div className="wallet-payment-form">
        <div className="form-group">
          <label htmlFor="walletType">Select Wallet</label>
          <Field as="select" id="walletType" name="walletType" className="form-control">
            <option value="">--Select Wallet--</option>
            <option value="Paytm">Paytm</option>
            <option value="PhonePe">PhonePe</option>
            <option value="GooglePay">Google Pay</option>
            <option value="AmazonPay">Amazon Pay</option>
          </Field>
          <ErrorMessage name="walletType" component="div" className="form-error" />
        </div>
        
        <div className="form-group">
          <label htmlFor="walletId">Mobile Number / Email</label>
          <Field
            type="text"
            id="walletId"
            name="walletId"
            className="form-control"
            placeholder="Enter registered mobile or email"
          />
          <ErrorMessage name="walletId" component="div" className="form-error" />
        </div>
        
        <div className="payment-instructions">
          <p>You will receive a payment notification on your selected wallet</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="payment-form-container">
      {paymentMethod === 'CREDIT_CARD' && renderCardForm()}
      {paymentMethod === 'UPI' && renderUpiForm()}
      {paymentMethod === 'NET_BANKING' && renderNetBankingForm()}
      {paymentMethod === 'WALLET' && renderWalletForm()}
    </div>
  );
};

export default PaymentForm;