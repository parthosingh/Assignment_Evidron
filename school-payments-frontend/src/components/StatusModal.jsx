import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function StatusModal({ isOpen, onClose, onCheck, status, customOrderId, setCustomOrderId }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '300px',
        },
      }}
      contentLabel="Transaction Status Modal"
    >
      <h2 className="text-xl font-bold mb-4">Check Transaction Status</h2>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          value={customOrderId}
          onChange={(e) => setCustomOrderId(e.target.value)}
          placeholder="Enter Custom Order ID"
          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onCheck}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
        >
          Check Status
        </button>
        {status && <p className="mt-4 text-center">Status: {status.status || status}</p>}
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-colors w-full"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default StatusModal;