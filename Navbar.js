// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => (
  <nav className={styles.navbar}>
    <ul className={styles.navList}>
      <li><Link to="/">Home</Link></li>
      <Link to="/voter-register">Register as Voter</Link>
      
      <li><Link to="/adminlogin">Admin Login</Link></li> {/* ✅ This is the new link */}



    </ul>
  </nav>
);

export default Navbar;
