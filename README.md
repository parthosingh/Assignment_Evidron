School Payment Frontend
A responsive React-based frontend for the School Payment and Dashboard application. It integrates with the backend APIs to display and manage transactions, including paginated lists, filters, and status checks.
Table of Contents


# Overview
This frontend app provides a user-friendly interface for viewing transactions, filtering by school or status, and checking payment statuses. Built with React, Tailwind CSS, Axios for API calls, and React Router for navigation
The app fetches data from the backend at https://assignment-evidron-school-payment-backend.onrender.com

# Features

Paginated transaction list with sorting (e.g., by payment_time).
Multi-select filters for status and school IDs.
Date-wise transaction filtering.
Transaction details page by school.
Status check form for custom_order_id.

# Setup Instructions

Node.js (v18+)
npm or yarn
Backend server running on https://assignment-evidron-school-payment-backend.onrender.com
Installation

Clone the repository:
git clone https://github.com/parthosingh/Assignment_Evidron.git
cd school-payment-frontend


Install dependencies:
npm install


Set up environment variables:

Create a .env file in the root: VITE_BACKEND_URL=https://assignment-evidron-school-payment-backend.onrender.com/api


Adjust REACT_APP_API_URL for production.


Start the development server:
npm start


The app will run on https://payment-eight-zeta.vercel.app


Build for production:
npm run build


Use the included Postman collection (if any) or Thunder Client to test API integrations.

# API Integration
The app integrates with the backend APIs:

GET /transactions: Fetches paginated transactions with filters (status, school_id, date).
GET /transactions/school/:schoolId: Fetches transactions for a school.
GET /transaction-status/:custom_order_id: Checks status by order ID.
Axios is used for all calls, with error handling and loading states.

Example API call in code (from src/services/api.js):
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'https://assignment-evidron-school-payment-backend.onrender.com/api',
  headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
});

export const getTransactions = async (params, token) => {
    try {
    console.log('API params sent:', params); // Debug log
    const response = await api.get('/payments/transactions', { params: { ...params, token } });
    console.log('API response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error.message, error.response?.status, error.response?.data);
    throw error;
  }
};

# Pages and Functionality
1. Transactions Overview (/transactions)

Description: Displays a searchable, paginated table of all transactions.
Functionality:
Columns: collect_id, school_id, gateway, order_amount, transaction_amount, status, custom_order_id.
Filters: Multi-select for status (Success, Pending, Failed) and school IDs.
Sorting: sort transactions by payment_time in descending order (newest to oldest).
Pagination: Previous/Next buttons with page numbers.


Components: TransactionTable (reusable table with sorting/pagination), FilterDropdown (multi-select filters).
State Management: useState for filters

2. Transaction Details by School (/transaction-details/:schoolId)

Description: Shows transactions for a selected school.
Functionality:
Dropdown or search to select school_id.
Filtered table with pagination and sorting.
Back button to return to overview.


Components: SchoolDetailTable (filtered TransactionTable variant).

3. Transaction Status Check (/status-check)

Description: Allows checking status by custom_order_id.
Functionality:
Input form for custom_order_id.
Button to fetch and display status (e.g., "SUCCESS" or "PENDING" or "FAILURE").
Error handling for invalid IDs.


Components: StatusCheckForm (form with Axios call).


Real-time Visualization: Chart.js bar chart for transaction amounts by status (in Transactions Overview).

# Deployment
Vercel (Recommended)

Install Vercel CLI:npm i -g vercel


Login:vercel login


Deploy:vercel


Follow prompts: Link to GitHub, set root directory to ./, build command npm run build, output directory build/.


The app will be live at https://payment-eight-zeta.vercel.app


This project was built for the Software Developer Assessment. Backend repo: school-payment-backend.
