import React, { useState } from 'react';
import StatusModal from '../components/StatusModal';
import { getTransactionStatus } from '../services/api';

function TransactionStatus({ token }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [customOrderId, setCustomOrderId] = useState('');

  const handleCheckStatus = async () => {
    if (!customOrderId) {
      setStatus({ status: 'Please enter a Custom Order ID' });
      return;
    }
    try {
      const data = await getTransactionStatus(customOrderId, token);
      setStatus(data);
    } catch (error) {
      console.error('Error checking status:', error.message, error.response?.data);
      setStatus({ status: 'Error occurred' });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Check Transaction Status</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Check Status
      </button>
      <StatusModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCustomOrderId('');
          setStatus(null);
        }}
        onCheck={handleCheckStatus}
        status={status}
        customOrderId={customOrderId}
        setCustomOrderId={setCustomOrderId}
      />
    </div>
  );
}

export default TransactionStatus;