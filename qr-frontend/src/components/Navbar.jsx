import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  

const ExternalLink = ({ to, children }) => (
  <a href={to} target="_blank" rel="noopener noreferrer" className="nav-link">
    {children}
  </a>
);

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container-fluid">
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <Link className="navbar-brand" to="/">KASC</Link>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <ExternalLink to="/">Home</ExternalLink>
          </li>
          <li className="nav-item">
            <ExternalLink to="/staff">Staff</ExternalLink>
          </li>
          <li className="nav-item">
            <ExternalLink to="/admin">Admin</ExternalLink>
          </li>
          <li className="nav-item">
            <ExternalLink to="/studentlogin">Student</ExternalLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
