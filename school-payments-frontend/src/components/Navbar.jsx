import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ token }) {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <ul className="flex space-x-4">
        <li><Link to="/transactions" className="hover:text-gray-300">Transactions</Link></li>
        <li><Link to="/transaction-details" className="hover:text-gray-300">Transaction Details</Link></li>
        <li><Link to="/transaction-status" className="hover:text-gray-300">Check Status</Link></li>
      </ul>
      {!token && <Link to="/" className="text-blue-300 hover:text-blue-100">Signup</Link>}
    </nav>
  );
}

export default Navbar;