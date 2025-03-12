import React from 'react';
import { FaCreditCard, FaWallet, FaMobileAlt, FaUniversity } from 'react-icons/fa';
import '../../styles/components/payment.css';

const PaymentMethods = ({ selectedMethod, onMethodChange }) => {
  const paymentMethods = [
    {
      id: 'CREDIT_CARD',
      name: 'Credit/Debit Card',
      icon: <FaCreditCard />
    },
    {
      id: 'UPI',
      name: 'UPI',
      icon: <FaMobileAlt />
    },
    {
      id: 'NET_BANKING',
      name: 'Net Banking',
      icon: <FaUniversity />
    },
    {
      id: 'WALLET',
      name: 'Wallet',
      icon: <FaWallet />
    }
  ];
  
  return (
    <div className="payment-methods">
      {paymentMethods.map(method => (
        <div
          key={method.id}
          className={`payment-method ${selectedMethod === method.id ? 'selected' : ''}`}
          onClick={() => onMethodChange(method.id)}
        >
          <div className="method-icon">
            {method.icon}
          </div>
          <div className="method-name">
            {method.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethods;