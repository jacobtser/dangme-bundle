import React from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Header from './components/Header/Header'; 
import Home from './pages/Home'; 
import Videos from './pages/Videos'; 
import Premium from './pages/Premium'; 
import Dashboard from './pages/Dashboard'; 
import Payment from './pages/Payment'; 
import Login from './components/Auth/Login'; 
import Register from './components/Auth/Register'; 
 
function App() { 
  return ( 
    <Router> 
      <div> 
        <Header /> 
        <main> 
          <Routes> 
            <Route path="/" element={<Home />} /> 
            <Route path="/videos" element={<Videos />} /> 
            <Route path="/premium" element={<Premium />} /> 
            <Route path="/login" element={<Login />} /> 
            <Route path="/register" element={<Register />} /> 
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/payment" element={<Payment />} /> 
          </Routes> 
        </main> 
      </div> 
    </Router> 
  ); 
} 
 
export default App; 
