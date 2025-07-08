import "./Signup.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  return (
    <>
      <div className="modal-overlay auth">
        <div className="modal-content auth-content">
          <h3>Register</h3>
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
    </>
  );
}

export default Signup;
