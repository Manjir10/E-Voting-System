// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.homeContainer}>
      <h1>Welcome to the E-Voting System</h1>
      <div className={styles.buttonContainer}>
        <Link to="/voter-register" className={styles.registerButton}>
          Register as Voter
        </Link>
      </div>
    </div>
  );
}

export default Home;
