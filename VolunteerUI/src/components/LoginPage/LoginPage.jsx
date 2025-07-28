import "./LoginPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // adjust path to your firebase config file

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (err) {
      console.error("Login Error:", err.code, err.message);

      let message = "An unexpected error occurred. Please try again.";

      switch (err.code) {
        case "auth/invalid-credential":
          message =
            "Incorrect email or password. Please double-check your login details.";
          break;
        default:
          message = "An unexpected error occurred. Please try again.";
      }

      setError(message);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-left">
        <div className="left-pic">
          <img
            src="https://i.postimg.cc/LsgmDdpv/1-copy-2.jpg"
            alt="logo-placeholder"
            className="logo-placeholder"
          />
        </div>
      </div>
      <div className="auth-right">
        <form
          onSubmit={handleLogin}
        >
          <h2>Login</h2>
          {error && <p style={{ color: "white" }}>{error}</p>}
          
          <div className="form-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          
          <button type="submit">Sign In</button>
          <p>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{ color: "white", cursor: "pointer" }}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;