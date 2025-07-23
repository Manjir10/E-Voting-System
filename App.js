// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import VoterDashboard from './components/VoterDashboard';
import VoterRegister from './components/VoterRegister';
import AdminRegister from './pages/AdminRegister'; 
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';
import AuditLog from './pages/AuditLog';


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/voter-dashboard" element={<VoterDashboard />} />
        <Route path="/voter-register" element={<VoterRegister />} />
        <Route path="/adminregister" element={<AdminRegister />} />
        <Route path="/vote" element={<VotePage />} /> {/* updated here */}
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/audit/:voterId" element={<AuditLog />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />



      </Routes>
    </Router>
  );
};

export default App;
