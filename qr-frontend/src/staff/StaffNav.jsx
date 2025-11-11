import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNav = () => {
  const navigate = useNavigate();


  const email = localStorage.getItem('staffemail');

  const handleLogout = () => {
    
    localStorage.removeItem('stafftoken');
    localStorage.removeItem('staffemail');
    navigate('/staffsignin');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">KASC Staff</Link>
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
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/staff">Home</Link>
            </li>
            <li> <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button></li>
          </ul>
        </div>
        
       
      </div>
    </nav>
  );
};

export default AdminNav;
