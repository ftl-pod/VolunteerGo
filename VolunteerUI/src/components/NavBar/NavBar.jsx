import './NavBar.css'
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaUserCircle } from "react-icons/fa";



function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <nav className="navbar">
        <div className="navbar-links">
            <NavLink to="/" exact className="nav-link">Home</NavLink>
            <NavLink to="/search" className="nav-link">Search</NavLink>
            <NavLink to="/saved" className="nav-link">Saved</NavLink>
            <NavLink to="/leaderboard" className="nav-link">Leaderboard</NavLink>
            <NavLink to="/map" className="nav-link">Map</NavLink>
        </div>

        <div className="profile-menu">
            {isLoggedIn ? (
            <>
                <NavLink to="/profile" className="profile-icon">
                <FaUserCircle size={40} />
                </NavLink>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </>
            ) : (
            <>
                <NavLink to="/login" className="nav-link">Login</NavLink>
                <NavLink to="/signup" className="nav-link">Sign Up</NavLink>
            </>
            )}
        </div>
        </nav>
    );
    }

export default Navbar;
