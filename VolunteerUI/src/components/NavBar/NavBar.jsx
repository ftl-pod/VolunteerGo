import './NavBar.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { useUser, useClerk } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    const { signOut } = useClerk();
    const { user, isSignedIn, isLoaded } = useUser();
    const [show, setShow] = useState(null);

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const isLoggedIn = !!user;

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <NavLink to="/" className="nav-link">Home</NavLink>
                <NavLink to="/search" className="nav-link">Search</NavLink>
                {!isLoaded ? null : isSignedIn ? (
                    <NavLink to="/saved" className="nav-link">Saved</NavLink>
                ) : null}
                <NavLink to="/leaderboard" className="nav-link">Leaderboard</NavLink>
                <NavLink to="/map" className="nav-link">Map</NavLink>

            </div>

            <div className="profile-menu">
                {isLoggedIn ? (
                    <>
                    <NavLink to="/profile" className="profile-icon">
                        {user?.publicMetadata?.avatarUrl ? (
                        <img 
                            src={user.publicMetadata.avatarUrl} 
                            alt={`${user.username || 'User'}'s avatar`} 
                            style={{ width: 60, height: 60, borderRadius: '50%', border: '3px solid #63806f' }} 
                        />
                        ) : (
                        <FaUserCircle size={60} />
                        )}
                    </NavLink>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
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
