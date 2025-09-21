
import React, { useState, useEffect } from "react";
import { getTransactionsBySchool } from "../services/api";
import TransactionTable from "../components/TransactionTable";

function TransactionDetailsBySchool() {
  const [schoolId, setSchoolId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("payment_time");
  const [order, setOrder] = useState("desc");

  const limit = 10; // items per page

  const fetchTransactions = async () => {
    if (!schoolId) {
      setError("Please enter a school ID");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const params = { page, limit, sort, order };
      const data = await getTransactionsBySchool(schoolId, params); // Pass schoolId and params correctly
      console.log("API response:", data);

      let txnData = [];
      if (Array.isArray(data)) {
        txnData = data;
      } else if (data.transactions) {
        txnData = data.transactions;
      }

      const mappedTransactions = txnData.map((txn, index) => ({
        collect_id: txn.collect_id || txn._id || `txn-${index}`,
        school_id: txn.school_id || "N/A",
        gateway: txn.gateway_name || txn.gateway || "N/A",
        order_amount: txn.order_amount || txn.transaction_amount || 0,
        transaction_amount: txn.transaction_amount,
        status: txn.status || "unknown",
        custom_order_id: txn.custom_order_id || txn._id || `txn-${index}`,
        payment_time: txn.payment_time || txn.createdAt || null,
      }));

      setTransactions(mappedTransactions);
    } catch (err) {
      console.error("Error fetching transactions by school:", err.message, err.response?.data);
      setError("Failed to fetch transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when page, sort, or order changes
  useEffect(() => {
    if (schoolId) fetchTransactions();
  }, [page, sort, order]);

  const handleSort = (key, direction) => {
    setSort(key);
    setOrder(direction);
    setPage(1); // reset to first page on sort
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">Transactions by School</h2>

      <div className="flex gap-2 mb-6 justify-center">
        <input
          type="text"
          placeholder="Enter School ID"
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          className="border p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => { setPage(1); fetchTransactions(); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Fetch Transactions
        </button>
      </div>

      {loading && <p className="text-center text-gray-600">Loading transactions...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && transactions.length === 0 && !error && (
        <p className="text-center text-gray-600">No transactions found.</p>
      )}

      {transactions.length > 0 && (
        <>
          <TransactionTable
            transactions={transactions}
            page={page}
            limit={limit}
            onSort={handleSort}
          />
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
        </>
      )}
    </div>
  );
}

export default TransactionDetailsBySchool;
