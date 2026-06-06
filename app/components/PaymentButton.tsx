import React from 'react';

interface PayButtonProps {
  onPay: () => void;
  disabled?: boolean;
  label?: string;
}

const PayButton: React.FC<PayButtonProps> = ({ onPay, disabled = false, label = 'Pay Now' }) => {
  return (
    <button
      onClick={onPay}
      disabled={disabled}
      className={`bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );
};

export default PayButton;