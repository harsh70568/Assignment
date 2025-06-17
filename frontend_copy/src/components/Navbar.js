import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Student Progress
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;