import React from 'react';
import Signup from './routes/signup';
import Signin from './routes/signin';
import Dashboard from './routes/dashboard';
import Transaction from './routes/transaction';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/transaction' element={<Transaction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
