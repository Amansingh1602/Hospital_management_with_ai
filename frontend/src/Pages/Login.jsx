import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, useNavigate, Navigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all fields!");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match!");
      return;
    }
    
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user-demo/login-demo",
        { email, password, confirmPassword, role: "Patient" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      
      toast.success(response.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z"
                  fill="url(#gradient1)"
                />
                <path
                  d="M17.08 14.15C14.29 12.29 9.74 12.29 6.93 14.15C5.66 15 4.96 16.15 4.96 17.38C4.96 18.61 5.66 19.75 6.92 20.59C8.32 21.53 10.16 22 12 22C13.84 22 15.68 21.53 17.08 20.59C18.34 19.74 19.04 18.6 19.04 17.36C19.03 16.13 18.34 14.99 17.08 14.15Z"
                  fill="url(#gradient2)"
                />
                <defs>
                  <linearGradient
                    id="gradient1"
                    x1="7.25"
                    y1="2"
                    x2="16.75"
                    y2="11.49"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#0066cc" />
                    <stop offset="1" stopColor="#00a86b" />
                  </linearGradient>
                  <linearGradient
                    id="gradient2"
                    x1="4.96"
                    y1="14.15"
                    x2="19.04"
                    y2="22"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#0066cc" />
                    <stop offset="1" stopColor="#00a86b" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2>Welcome Back!</h2>
            <p className="login-subtitle">Sign in to access your patient portal</p>
          </div>

          <form onSubmit={handleLogin} className="login-form-content">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-submit-btn">
              Sign In
            </button>
          </form>

          <div className="login-footer">
            <p>
              New to MediCare Plus?{" "}
              <Link to="/register" className="register-link">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <div className="login-features">
          <div className="feature-item">
            <div className="feature-icon">📋</div>
            <h4>Medical Records</h4>
            <p>Access your complete medical history anytime</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📅</div>
            <h4>Appointments</h4>
            <p>Book and manage your appointments easily</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔬</div>
            <h4>Test Results</h4>
            <p>View your lab reports and test results</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
