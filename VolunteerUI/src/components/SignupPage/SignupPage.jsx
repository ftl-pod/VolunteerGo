import "./Signup.css";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const navigate = useNavigate();
  return (
    <>
        <div className="auth-page-container">
        <div className="auth-left">
            <img src="src/assets/Screenshot 2025-07-08 at 11.09.00 AM.png" alt="logo-placeholder" className="logo-placeholder"/>
        </div>
      <div className="auth-right">
        <div className="auth-content">
          <h1>Register</h1>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="name"
                id="name"
                name="name"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
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
                Register
              </button>
            </div>
          </form>

          <div className="login-footer">
            <a href="http://localhost:5173/login">Already have an account?</a>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default SignupPage;
