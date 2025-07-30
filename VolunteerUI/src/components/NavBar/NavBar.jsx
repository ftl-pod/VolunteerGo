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
    const handleLevelUp = () => {
      triggerLevelUpAnimation();
    };

    const handleShowGif = () => {
      setShowGif(true);
      setTimeout(() => setShowGif(false), 3000); 
    };

    // const handleKeyPress = (event) => {
    //   if (event.key.toLowerCase() === 'l') {
    //     window.dispatchEvent(new CustomEvent("levelUp"));
    //   }
    // };

    window.addEventListener("levelUp", handleLevelUp);
    window.addEventListener("showPointsGif", handleShowGif);
    // window.addEventListener("keydown", handleKeyPress); 

    return () => {
      window.removeEventListener("levelUp", handleLevelUp);
      window.removeEventListener("showPointsGif", handleShowGif);
      // window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);


  const triggerLevelUpAnimation = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Add level up class to navbar
    navbar.classList.add('level-up-active');

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'level-up-overlay';
    
    // Create level up text
    const levelUpText = document.createElement('div');
    levelUpText.className = 'level-up-text';
    levelUpText.textContent = 'LEVEL UP!';
    overlay.appendChild(levelUpText);
    
    navbar.appendChild(overlay);

    // Create sparkles
    const createSparkles = () => {
      const sparkleCount = 15;
      for (let i = 0; i < sparkleCount; i++) {
        setTimeout(() => {
          const sparkle = document.createElement('div');
          sparkle.className = 'level-up-sparkle';
          sparkle.style.left = Math.random() * 100 + '%';
          sparkle.style.top = Math.random() * 100 + '%';
          sparkle.style.animationDelay = Math.random() * 0.5 + 's';
          overlay.appendChild(sparkle);
          
          // Remove sparkle after animation
          setTimeout(() => {
            if (sparkle.parentNode) {
              sparkle.parentNode.removeChild(sparkle);
            }
          }, 2000);
        }, i * 100);
      }
    };

  // Create floating leaves
  const createLeaves = () => {
    const leafCount = 8;
    const leafColors = ['leaf-color-1', 'leaf-color-2', 'leaf-color-3'];
    
    for (let i = 0; i < leafCount; i++) {
      setTimeout(() => {
        const leaf = document.createElement('div');
        leaf.className = `level-up-leaf ${leafColors[Math.floor(Math.random() * leafColors.length)]}`;
        leaf.style.left = Math.random() * 100 + '%';
        leaf.style.top = '100%';
        leaf.style.animationDelay = Math.random() * 0.3 + 's';
        overlay.appendChild(leaf);
        
        // Remove leaf after animation
        setTimeout(() => {
          if (leaf.parentNode) {
            leaf.parentNode.removeChild(leaf);
          }
        }, 3000);
      }, i * 150);
    }
  };

  // Start effects with slight delays
  setTimeout(createSparkles, 200);
  setTimeout(createLeaves, 400);

  // Clean up after animation completes
  setTimeout(() => {
    navbar.classList.remove('level-up-active');
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }, 3000);
};



// To trigger the animation from anywhere in your app:
// window.dispatchEvent(new CustomEvent("levelUp"));
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
          {/* <NavLink to="/map" className="nav-link">Map</NavLink> */}
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
        {/* <NavLink to="/map" className="nav-link">Map</NavLink> */}
      </div>
      <div className="navbar-right">
        {isLoaded && isSignedIn && (
          <>
          <div className="user-points">
          <div className="gif-media">
            {showGif ? 
            <img src="https://i.postimg.cc/6QZjyGQc/organic-ezgif-com-effects.gif" className="gif-media"/> : 
            <img src="https://i.postimg.cc/RZbpC6ks/organic-removebg-preview.png" className="gif-media"/>
            }
            <div>{points}</div>
        </div>
        </div>
        <ProgressBar points={points} size="small"/>
        </>
        )}
        <div className="profile-menu">
      </div>

        {isSignedIn ? (
          <>
            <NavLink to="/profile" className="profile-icon">
              <img
                src={profile?.avatarUrl || "https://i.ibb.co/rf6XN61Q/plant.png"}
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
