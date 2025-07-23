// src/pages/AdminRegister.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminRegister.module.css';

const AdminRegister = () => {
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adminData.name || !adminData.email || !adminData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminData),
      });

      if (res.ok) {
        alert("Admin registered successfully");
        navigate('/adminlogin');
      } else {
        const msg = await res.text();
        setError(msg || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred: " + err.message);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Admin Registration</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={adminData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={adminData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={adminData.password}
          onChange={handleChange}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default AdminRegister;
