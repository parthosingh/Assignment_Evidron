import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Routes from './components/Routes';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (
    <div>
      <Navbar token={token} />
      <div className="container mx-auto p-6">
        <Routes setToken={setToken} />
      </div>
    </div>
  );
}

export default App;