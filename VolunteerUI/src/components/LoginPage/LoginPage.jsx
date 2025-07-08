import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();
  return (
    <>
    <div className="auth-page-container">
    <div className="auth-left">
        <div className="auth-logo-placeholder">
            PLACEHOLDER FOR LOGO?
        </div>
    </div>
      <div className="auth-right">
        <div className="auth-content">
          <h1 className="login">Login</h1>
          <form>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                className="email"
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
