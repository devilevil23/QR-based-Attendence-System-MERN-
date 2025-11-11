import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StaffSignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/Staffauth/signin", { email, password });

      const { token } = response.data;
      localStorage.setItem("stafftoken", token);
      localStorage.setItem("staffemail", email);

      navigate("/staff");
    } catch (err) {
      setError(err.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%", borderRadius: "10px" }}>
        <div className="card-body text-center">
          <h2 className="card-title text-primary fw-bold mb-3">Staff Sign In</h2>
          <p className="text-muted">Access your staff dashboard</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label htmlFor="email" className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 text-start">
              <label htmlFor="password" className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                id="password"
                placeholder="Enter your password"
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

export default StaffSignInPage;
