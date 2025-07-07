import './NavBar.css'
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // TEMP for example
    const navigate = useNavigate();

    const handleLogout = () => {
        // TODO: Call your actual logout logic (e.g. clear token, reset auth context)
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <nav className="navbar">
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/search" className="nav-link">Search</NavLink>
        <NavLink to="/leaderboard" className="nav-link">Leaderboard</NavLink>

        {isLoggedIn ? (
            <>
            <NavLink to="/profile" className="profile-icon">
                <FaUserCircle size={20} />
            </NavLink>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            </>
        ) : (
            <>
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/signup" className="nav-link">Sign Up</NavLink>
            </>
        )}
        </nav>
    );
    }

export default Navbar;
