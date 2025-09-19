
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getTransactions } from '../services/api'; 
import TransactionTable from '../components/TransactionTable';
import Select from 'react-select';

function TransactionDetailsBySchool({ token }) {
  const { schoolId } = useParams() || {}; 
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [schoolFilter, setSchoolFilter] = useState(searchParams.getAll('school_id') || []); 
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [error, setError] = useState(null);
  const limit = 10;
  const sort = searchParams.get('sort') || 'payment_time';
  const order = searchParams.get('order') || 'desc';
  const navigate = useNavigate();

 
  const [schoolOptions, setSchoolOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit, sort, order };
        if (schoolFilter.length) params.school_id = schoolFilter.join(',');
        console.log('Fetch params:', params);
        const response = await getTransactions(params, token);
        console.log('API response:', response);
        if (response && Array.isArray(response.data)) {
          setTransactions(response.data);
          const uniqueSchoolIds = Array.from(new Set(response.data.map(t => t.school_id)))
            .map(schoolId => ({ value: schoolId, label: schoolId }));
          if (uniqueSchoolIds.length > 0) setSchoolOptions(uniqueSchoolIds);
        } else {
          setTransactions([]);
          setError('Invalid API response format');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error.message, error.response?.data);
        setError(error.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, schoolFilter, sort, order, token]);

  const handleSchoolChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    console.log('Selected school values:', values);
    setSchoolFilter(values);
    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    newParams.set('sort', sort);
    newParams.set('order', order);
    if (values.length) newParams.set('school_id', values.join(','));
    console.log('New params to set:', newParams.toString());
    setSearchParams(newParams);
    setTimeout(() => fetchData(), 0);
  };

  const handleSort = (key, direction) => {
    setSearchParams({ page: '1', school_id: schoolFilter.join(','), sort: key, order: direction });
  };

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (transactions.length === 0) return <div className="text-center text-gray-600">No transactions found.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Transactions for School ID</h1>
      <div className="mb-6">
        <Select
          isMulti
          options={schoolOptions}
          value={schoolOptions.filter(option => schoolFilter.includes(option.value))}
          onChange={handleSchoolChange}
          placeholder="Select School ID"
          className="basic-multi-select"
          classNamePrefix="select"
          styles={{ container: (provided) => ({ ...provided, width: '300px' }) }}
          isSearchable={true} // Enable filtering
        />
      </div>
      <TransactionTable transactions={transactions} onSort={handleSort} page={page} limit={limit} />
      <div className="flex justify-center mt-6 space-x-4">
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

export default TransactionDetailsBySchool;