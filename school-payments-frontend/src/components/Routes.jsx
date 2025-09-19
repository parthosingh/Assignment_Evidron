
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import TransactionsOverview from '../pages/TransactionsOverview';
import TransactionDetailsBySchool from '../pages/TransactionDetailsBySchool';
import TransactionStatus from '../pages/TransactionStatus';

function AppRoutes({ setToken }) {
  return (
    <Routes>
      <Route path="/" element={<Signup setToken={setToken} />} />
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route path="/transactions" element={<TransactionsOverview token={localStorage.getItem('token') || ''} />} />
      <Route path="/transaction-details" element={<TransactionDetailsBySchool token={localStorage.getItem('token') || ''} />} />
      <Route path="/transaction-status" element={<TransactionStatus token={localStorage.getItem('token') || ''} />} />
    </Routes>
  );
}

export default AppRoutes;