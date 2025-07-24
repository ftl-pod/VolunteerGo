import "./Signup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { useProfile } from "../../contexts/ProfileContext";

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      // Skip backend user creation

      // Redirect to onboarding
      navigate("/onboarding");

    } catch (err) {
      console.error(err);
      setError(err.message);
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
          className="w-full h-full flex flex-col items-center justify-center"
          onSubmit={handleSignup}
        >
          <h2>Sign Up</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
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
              autoComplete="new-password"
            />
          </div>
          
          <button type="submit">Sign Up</button>
          <p>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ color: "var(--primary-color)", cursor: "pointer" }}
            >
              Log In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
