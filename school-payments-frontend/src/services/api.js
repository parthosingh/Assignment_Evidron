
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'https://assignment-evidron-school-payment-backend.onrender.com/api',
});

// ✅ Add interceptor to always attach the latest token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getTransactions = async (params) => {
  try {
    console.log('API params sent:', params);
    const response = await api.get('/payments/transactions', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error.message, error.response?.status, error.response?.data);
    throw error;
  }
};

export const getTransactionsBySchool = async (schoolId, params) => {
  try {
    console.log('API params for school:', { schoolId, params });
    const response = await api.get(`/payments/transactions/school/${schoolId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions by school:', error.message, error.response?.data);
    throw error;
  }
};

export const getTransactionStatus = async (customOrderId) => {
  try {
    const response = await api.get(`/payments/transaction-status/${customOrderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    throw error;
  }
};
