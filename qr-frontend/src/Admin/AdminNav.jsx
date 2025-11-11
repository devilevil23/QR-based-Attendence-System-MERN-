import React from 'react';
import { Link, useNavigate } from 'react-router-dom';



const AdminNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/signin'); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">KASC Admin</Link>
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
              <Link className="nav-link" to="/admin">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/stafflist">Staff</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/adminstudentlist">Students</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/department">Departments</Link>
            </li>
            <li>
            <div className="d-flex">
          <button className="btn btn-danger ms-2" onClick={handleLogout}>
            Logout
          </button>
        </div>
            </li>
          </ul>
        </div>
        
      </div>
    </nav>
  );
};

export default AdminNav;
