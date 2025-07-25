import './NavBar.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useProfile } from "../../contexts/ProfileContext";
import { useEffect, useState } from 'react';
import ProgressBar from '../ProgressBar/ProgressBar';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { user, isSignedIn, isLoaded } = useAuth();
  const { profile, loading, refreshProfile } = useProfile();
  const [showGif, setShowGif] = useState(false)
  const points =profile?.points;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };
  useEffect(() => {
  const handleShowGif = () => {
    setShowGif(true);
    setTimeout(() => setShowGif(false), 3000); 
  };

  window.addEventListener("showPointsGif", handleShowGif);
  return () => window.removeEventListener("showPointsGif", handleShowGif);
  }, []);

  const avatarUrl =
    profile?.avatarUrl ||  // From backend DB (shared context)
    user?.photoURL ||      // Fallback to Firebase photoURL
    "https://i.ibb.co/rf6XN61Q/plant.png"; // Final fallback

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
      {isLoaded && isSignedIn && (
        <div className="user-points">
        <div className="gif-media">
          {showGif ? 
           <img src="https://i.postimg.cc/6QZjyGQc/organic-ezgif-com-effects.gif" className="gif-media"/> : 
           <img src="https://i.postimg.cc/RZbpC6ks/organic-removebg-preview.png" className="gif-media"/>
           }
          <div>{points}</div>
       </div>
      </div>
      )}
      
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
