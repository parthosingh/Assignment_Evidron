# School Payments & Dashboard Application

## Deployment Link of school-payments-frontend:-> https://assignment-evidron-mw7l.vercel.app/
## Deployment Link of school-payment-backend :-> https://assignment-evidron-school-payment-backend.onrender.com

# A MERN-based School Payment & Dashboard Application featuring secure JWT authentication, Payment Gateway Integration, Webhook support, and a modern React frontend. This project is divided into two parts:

- **Backend (Node.js + Express + MongoDB)** → Running at **https://assignment-evidron-school-payment-backend.onrender.com**

- **Frontend (React + Vite + TailwindCSS)** → Running at **https://assignment-evidron-mw7l.vercel.app/**

---

Got it! Since you've built your project using **Node.js, Express, and MongoDB Atlas** for the backend and **React + TailwindCSS** for the frontend, I’ll provide a tailored feature set similar to the sample you shared, aligning with your tech stack. I’ll focus on generating a comparable feature list without coding, as requested, and ensure it reflects a practical and relevant set of features for your project.

## 🚀 Features
### 🔒 Backend (Node.js, Express, MongoDB Atlas)
- ✅ User Authentication with JWT (Sign-up & Login)
- ✅ Payment Integration API (`/api/payments/create-payment`) with third-party gateways
- ✅ Webhook Listener (`/api/webhook`, POST) for real-time payment status updates
- ✅ Transactions API with Search, Filtering, and Pagination
- ✅ Environment variable management using `.env` for secure configuration
- ✅ Comprehensive error handling, input validation, and request logging
### 💻 Frontend (React + Vite + TailwindCSS)
- ✅ Dynamic Dashboard with paginated, searchable, and filterable transaction history (columns: collect_id, school_id, gateway, order_amount, transaction_amount, status, custom_order_id)
- ✅ Date-wise transaction filtering
- ✅ Transaction Status Tracker (search by custom_order_id)
- ✅ URL parameter persistence for sorting and filtering states
- ✅ Column sorting by clicking headers (e.g., payment_time in asc/desc order)
- ✅ Fully responsive UI styled with Tailwind CSS

--

## Project Structure

```
Assignment_Evidron/
│
├── school-payment-backend/              # Backend Service
│   ├── config/           # DB connection
│   │   └── db.js        # MongoDB connection logic
│   ├── middleware/       # JWT Auth
│   │   ├── auth.middleware.js # JWT authentication middleware
│   ├── models/           # Mongoose Schemas
│   │   ├── order.model.js    # Order Schema
│   │   ├── orderstatus.model.js # Order Status Schema
│   │   ├── user.model.js     # User Schema
│   │   └── webhooklog.model.js # Webhook Log Schema
│   ├── routes/                # API Routes
│   │   ├── auth.routes.js     # Signup, login routes
│   │   └── payment.routes.js  # Create-payment, transactions, status routes
│   │   └── webhook.routes.js  # Webhook route
│   ├── index.js        # Main entry point
│   └── .env             # Env variables (SALT_ROUNDS, JWT_SECRET, PORT, API_KEY, PG_KEY, SCHOOL_ID, MONGO_URL)
│
├── school-payments-frontend/            # React Frontend
│   ├── src/
│   │   ├── components/   # Navbar, Sidebar, Table, Cards
│   │   │   └── Navbar.jsx       # Navigation bar
│   │   │   └── Routes.jsx      # Routes bar
│   │   │   └── TransactionTable.jsx # Table with sorting/pagination
│   │   │   └── Login.jsx         # Login form
|   |   |   └── Signup.jsx        # Signup form
|   |   |   └── StatusModal.jsx   # Status check modal
│   │   ├── pages/        
│   │   │   └── TransactionsDetailsBySchool.jsx    # School-specific transactions
│   │   │   └── TransactionsOverview.jsx   # Transactions list   
│   │   │   └── TransactionStatus.jsx  # Status check page
|   |   ├── services/
|   |   |   └── api.js  # Axios API calls
│   │   ├── App.jsx       # Routes
│   │   └── main.jsx      # React Entry
│   └── tailwind.config.js # Tailwind setup
```
School Payment Frontend
A responsive React-based frontend for the School Payment and Dashboard application. It integrates with the backend APIs to display and manage transactions, including paginated lists, filters, and status checks.
Table of Contents

## ⚙️ Installation & Setup

### 🔹 1. Clone Repository
```bash
git clone https://github.com/parthosingh/Assignment_Evidron.git
cd Assignment_Evidron
```

### 🔹 2. Setup Backend
```bash
cd school-payment-backend
npm install
```

#### Create `.env` file inside `backend/`
```env
SALT_ROUNDS=No of Salt Rounds
PORT=8080 (Local Host)
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-jwt-secret
PG_KEY=edvtest01
PAYMENT_API_KEY=eyJhbGciOiJIUzI1NiIs...
SCHOOL_ID=65b0e6293e9f76a9694d84b4
```

#### Run Backend
```bash
npm run dev
```
Backend runs on 👉 **https://assignment-evidron-school-payment-backend.onrender.com**





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


The app will run on https://assignment-evidron-mw7l.vercel.app/


Build for production:
npm run build


Use the included Postman collection for  API integrations.

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

Sorting: Click on Payment time will sort transactions in ascending and descending order.

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


The app will be live at https://assignment-evidron-mw7l.vercel.app/


This project was built for the Software Developer Assessment. Backend repo: school-payment-backend.


![image alt](https://github.com/parthosingh/Assignment_Evidron/blob/8fb0f7f69201292061d29ee2b57a61750135867b/Screenshot%202025-09-20%20164552.png)
