

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TransactionTable from '../components/TransactionTable';
import { getTransactions } from '../services/api';
import Select from 'react-select';

function TransactionsOverview({ token }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(searchParams.getAll('status') || []);
  const [schoolFilter, setSchoolFilter] = useState(searchParams.getAll('school_id') || []);
  const [searchOrderId, setSearchOrderId] = useState(searchParams.get('orderId') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [error, setError] = useState(null);
  const limit = 10;
  const sort = searchParams.get('sort') || 'payment_time';
  const order = searchParams.get('order') || 'desc';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit, sort, order };
        if (statusFilter.length) params.status = statusFilter.join(',');
        if (schoolFilter.length) params.school_id = schoolFilter.join(',');
        if (searchOrderId) params.custom_order_id = searchOrderId;
        console.log('Fetch params:', params);
        const response = await getTransactions(params, token);
        setTransactions(response.data);
        console.log('Received data:', response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, statusFilter, schoolFilter, searchOrderId, sort, order, token]);

  const handleStatusChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    console.log('Selected status values:', values);
    setStatusFilter(values);
    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    newParams.set('sort', sort);
    newParams.set('order', order);
    if (values.length) newParams.set('status', values.join(','));
    if (schoolFilter.length) newParams.set('school_id', schoolFilter.join(','));
    if (searchOrderId) newParams.set('custom_order_id', searchOrderId);
    console.log('New params to set:', newParams.toString());
    setSearchParams(newParams);
    setTimeout(() => fetchData(), 0);
  };

  const handleSchoolChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    console.log('Selected school values:', values);
    setSchoolFilter(values);
    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    newParams.set('sort', sort);
    newParams.set('order', order);
    if (values.length) newParams.set('school_id', values.join(','));
    if (statusFilter.length) newParams.set('status', statusFilter.join(','));
    if (searchOrderId) newParams.set('custom_order_id', searchOrderId);
    console.log('New params to set:', newParams.toString());
    setSearchParams(newParams);
    setTimeout(() => fetchData(), 0);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log('Selected order ID:', value);
    setSearchOrderId(value);
    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    newParams.set('sort', sort);
    newParams.set('order', order);
    if (value) newParams.set('custom_order_id', value);
    if (statusFilter.length) newParams.set('status', statusFilter.join(','));
    if (schoolFilter.length) newParams.set('school_id', schoolFilter.join(','));
    console.log('New params to set:', newParams.toString());
    setSearchParams(newParams);
    setTimeout(() => fetchData(), 0);
  };

  const handleSort = (key, direction) => {
    setSearchParams({ page: '1', status: statusFilter.join(','), school_id: schoolFilter.join(','), orderId: searchOrderId, sort: key, order: direction });
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
  ];

  const schoolOptions = Array.from(new Set(transactions.map(t => t.school_id)))
    .map(schoolId => ({ value: schoolId, label: schoolId }));

  
  const selectStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 50, 
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 50, 
    }),
    container: (provided) => ({
      ...provided,
      width: '200px',
    }),
  };

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (transactions.length === 0) return <div className="text-center text-gray-600">No transactions found.</div>;

  return (
    <div className="mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Transactions Overview</h1>
      <div className="flex flex-row items-center space-x-4 mb-8"> 
        <div className="w-64">
          <input
            type="text"
            value={searchOrderId}
            onChange={handleSearchChange}
            placeholder="Search by Order ID"
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-64">
          <Select
            isMulti
            options={statusOptions}
            value={statusOptions.filter(option => statusFilter.includes(option.value))}
            onChange={handleStatusChange}
            placeholder="Filter by Status"
            className="basic-multi-select"
            classNamePrefix="select"
            styles={selectStyles}
            menuPortalTarget={document.body} 
          />
        </div>
        <div className="w-64">
          <Select
            isMulti
            options={schoolOptions}
            value={schoolOptions.filter(option => schoolFilter.includes(option.value))}
            onChange={handleSchoolChange}
            placeholder="Filter by School ID"
            className="basic-multi-select"
            classNamePrefix="select"
            styles={selectStyles}
            menuPortalTarget={document.body} 
          />
        </div>
      </div>
      <TransactionTable transactions={transactions} onSort={handleSort} page={page} limit={limit} />
      <div className="flex justify-center mt-6 space-x-14">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={transactions.length < limit}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
        >
          Next
        </button>
        <span className="text-lg text-gray-700">Page {page}</span>
      </div>
    </div>
  );
}

export default TransactionsOverview;