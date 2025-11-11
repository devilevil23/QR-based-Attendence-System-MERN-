import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentSignInPage = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/Students/signin", {
        rollNumber,
        password,
      });

      const { token, studentDetails } = response.data;
      localStorage.setItem("studentToken", token);
      navigate(`/studentlogininfo/${studentDetails._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Error logging in. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%", borderRadius: "10px" }}>
        <div className="card-body text-center">
          <h2 className="card-title text-primary fw-bold mb-3">Student Sign In</h2>
          <p className="text-muted">Access your student portal</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label htmlFor="rollNumber" className="form-label fw-semibold">Roll Number</label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="rollNumber"
                placeholder="Enter your Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 text-start">
              <label htmlFor="password" className="form-label fw-semibold">Date of Birth (YYYY-MM-DD)</label>
              <input
                type="password"
                className="form-control form-control-lg"
                id="password"
                placeholder="Enter your Date of Birth"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="alert alert-danger text-center p-2">{error}</div>}

            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg">Sign In</button>
            </div>
          </form>

          <div className="mt-3">
            <small className="text-muted">Need help? <a href="#" className="text-primary">Contact support</a></small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignInPage;
