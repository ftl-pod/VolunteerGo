import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {useEffect, useState } from "react";
function LoginPage({ onLogin }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/login`, {
          username,
          password,
        });

        const { token, user } = res.data;

        // Save token in localStorage or context
        localStorage.setItem('token', token);

        // Let app know the user is logged in
        console.log("Login Successful")
        onLogin(user);
        navigate("/")

      } catch (err) {
        console.error('Login failed:', err.response?.data || err.message);
      }
    };

  return (
    <>
      <div className="auth-page-container">
        <div className="auth-left">
            <img src="src/assets/Screenshot 2025-07-08 at 11.09.00 AM.png" alt="logo-placeholder" className="logo-placeholder"/>
        </div>
        <div className="auth-right">
          <div className="auth-content">
            <h1 className="login">Login</h1>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  required
                  className="username"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  className="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Login
                </button>
              </div>
            </form>

            <div className="login-footer">
              <a href="http://localhost:5173/signup">New User?</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
