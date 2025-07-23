// src/pages/Login.js
import React, { useState } from 'react';
import styles from './Login.module.css';

const Login = () => {
  const [voterId, setVoterId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!voterId || !password) {
      setError('Both fields are required.');
    } else {
      setError('');
      // TODO: Handle actual login logic
      console.log('Logging in with:', voterId, password);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Voter Login</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Voter ID</label>
          <input
            type="text"
            className={styles.input}
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            placeholder="Enter your Voter ID"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
  );
};

export default Login;
