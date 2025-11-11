import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./AdminNav";

const AdminPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0, staff: 0, departments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats"); // No token needed

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setStats(data);
        setLastUpdated(new Date().toLocaleString());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <div>
      <Nav />
      <div className="container mt-5">
        {/* Page Header */}
        <h1 className="mb-4 text-center fw-bold">Admin Dashboard</h1>
        <p className="text-center text-muted">
          Welcome to the Admin Dashboard. Here, you can manage students, staff, and departments efficiently.
        </p>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger text-center">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            {/* Dashboard Stats */}
            <div className="row text-center">
              <div className="col-md-4">
                <div className="card shadow p-4 border-0">
                  <h5 className="text-muted">Total Students</h5>
                  <p className="fs-2 fw-bold text-primary">{stats.students}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow p-4 border-0">
                  <h5 className="text-muted">Total Staff</h5>
                  <p className="fs-2 fw-bold text-success">{stats.staff}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow p-4 border-0">
                  <h5 className="text-muted">Total Departments</h5>
                  <p className="fs-2 fw-bold text-danger">{stats.departments}</p>
                </div>
              </div>
            </div>

            {/* Last Updated Timestamp */}
            <p className="text-center mt-3 text-muted">
              <small>Last updated: {lastUpdated}</small>
            </p>

            {/* Management Options */}
            <div className="row mt-5 text-center">
              <div className="col-md-4">
                <div className="card shadow p-4 border-0">
                  <h5 className="fw-bold">Manage Students</h5>
                  <p className="text-muted">View and update student details</p>
                  <button className="btn btn-primary mt-2 w-100" onClick={() => navigate("/adminstudentlist")}>
                    Go to Students
                  </button>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow p-4 border-0">
                  <h5 className="fw-bold">Manage Staff</h5>
                  <p className="text-muted">Add, edit, or remove staff members</p>
                  <button className="btn btn-success mt-2 w-100" onClick={() => navigate("/stafflist")}>
                    Go to Staff
                  </button>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow p-4 border-0">
                  <h5 className="fw-bold">Manage Departments</h5>
                  <p className="text-muted">Organize and modify department info</p>
                  <button className="btn btn-danger mt-2 w-100" onClick={() => navigate("/department")}>
                    Go to Departments
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-5 text-center">
              <h5 className="fw-bold">Need Help?</h5>
              <p className="text-muted">
                If you face any issues, contact the IT support team at <a href="mailto:support@example.com">support@example.com</a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
