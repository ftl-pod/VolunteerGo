import './NavBar.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useProfile } from "../../contexts/ProfileContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { user, isSignedIn, isLoaded } = useAuth();
  const { profile, loading } = useProfile();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const avatarUrl =
    profile?.avatarUrl ||  // From backend DB (shared context)
    user?.photoURL ||      // Fallback to Firebase photoURL
    "https://i.postimg.cc/wT6j0qvg/Screenshot-2025-07-09-at-3-46-05-PM.png"; // Final fallback

  // Show a placeholder or spinner avatar while profile is loading
  if (loading) {
    return (
      <nav className="navbar">
        <div className="navbar-links">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/search" className="nav-link">Search</NavLink>
          {isLoaded && isSignedIn && (
            <NavLink to="/saved" className="nav-link">Saved</NavLink>
          )}
          <NavLink to="/leaderboard" className="nav-link">Leaderboard</NavLink>
          <NavLink to="/map" className="nav-link">Map</NavLink>
        </div>
        <div className="profile-menu">
          {isSignedIn ? (
            <>
              <div
                className="profile-icon"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  border: '3px solid #63806f',
                  backgroundColor: '#ccc', // simple placeholder background
                  display: 'inline-block',
                }}
                aria-label="Loading profile"
              />
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            !isHomePage && (
              <>
                <NavLink to="/login" className="nav-link">Login</NavLink>
                <NavLink to="/signup" className="nav-link">Sign Up</NavLink>
              </>
            )
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/search" className="nav-link">Search</NavLink>
        {isLoaded && isSignedIn && (
          <NavLink to="/saved" className="nav-link">Saved</NavLink>
        )}
        <NavLink to="/leaderboard" className="nav-link">Leaderboard</NavLink>
        <NavLink to="/map" className="nav-link">Map</NavLink>
      </div>

      <div className="profile-menu">
        {isSignedIn ? (
          <>
            <NavLink to="/profile" className="profile-icon">
              <img
                src={avatarUrl}
                alt="User avatar"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  border: '3px solid #63806f',
                  objectFit: 'cover',
                }}
              />
            </NavLink>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          !isHomePage && (
            <>
              <NavLink to="/login" className="nav-link">Login</NavLink>
              <NavLink to="/signup" className="nav-link">Sign Up</NavLink>
            </>
          )
        )}
      </div>
    </nav>
  );
}

export default Navbar;
