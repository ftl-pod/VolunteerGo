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
      setError(err.message);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-left">
        <div className="left-pic">
          <img
            src="https://i.postimg.cc/fWvtkTqv/image.jpg"
            alt="logo-placeholder"
            className="logo-placeholder"
          />
        </div>
      </div>
      <div className="auth-right">
        <form
          className="w-full h-full flex flex-col items-center justify-center"
          onSubmit={handleLogin}
        >
          <h2>Login</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button type="submit">Sign In</button>
          <p>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{ color: "blue", cursor: "pointer" }}
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
