
import React, { useState, useMemo } from 'react';

function TransactionTable({ transactions, onSort, page, limit }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    onSort(key, direction);
  };

  const sortedTransactions = useMemo(() => {
    if (!sortConfig.key) return transactions;
    return [...transactions].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [transactions, sortConfig]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-blue-100">
            {['Sr.No', 'collect_id', 'school_id', 'gateway', 'order_amount', 'transaction_amount', 'status', 'custom_order_id', 'payment_time'].map((header) => (
              <th
                key={header}
                className="py-3 px-6 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort(header)}
              >
                {header} {sortConfig.key === header && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((transaction, index) => (
              <tr
                key={transaction.collect_id}
                className="group hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <td className="py-4 px-6 border-b border-gray-200 text-center text-sm group-hover:text-base">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 text-sm group-hover:text-base">
                  {transaction.collect_id}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 text-sm group-hover:text-base">
                  {transaction.school_id}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 text-sm group-hover:text-base">
                  {transaction.gateway}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 text-sm text-right group-hover:text-base">
                  {transaction.order_amount}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 text-sm text-right group-hover:text-base">
                  {transaction.transaction_amount}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 text-sm group-hover:text-base">
                  {transaction.status}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 text-sm group-hover:text-base">
                  {transaction.custom_order_id}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 text-sm group-hover:text-base">
                  {transaction.payment_time ? new Date(transaction.payment_time).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="py-4 text-center text-gray-500">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;