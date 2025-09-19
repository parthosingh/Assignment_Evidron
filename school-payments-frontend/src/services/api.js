
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'https://evidronassignment-school-payment-backend.onrender.com/api',
  headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
});

export const getTransactions = async (params, token) => {
  try {
    console.log('API params sent:', params); // Debug log
    const response = await api.get('/payments/transactions', { params: { ...params, token } }); // Pass token explicitly
    console.log('API response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error.message, error.response?.status, error.response?.data);
    throw error;
  }
};

export const getTransactionsBySchool = async (schoolId, params, token) => {
  try {
    console.log('API params for school:', { schoolId, params }); // Debug log
    const response = await api.get(`/payments/transactions/school/${schoolId}`, { params });
    console.log('API response for school:', response.data); // Debug log
    return response.data;
  } catch (error) {
   console.error('Error fetching transactions by school:', error.message, error.response?.data);
    throw error;
  }
};

export const getTransactionStatus = async (customOrderId, token) => {
  try {
    const response = await api.get(`/payments/transaction-status/${customOrderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    throw error;
  }
};