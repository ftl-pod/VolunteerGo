import './NavBar.css'
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaUserCircle } from "react-icons/fa";



function Navbar({setUser, user}) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);                 
        navigate('/login');               
    };
    
    const isLoggedIn = !!user;

    return (
        <nav className="navbar">
        <div className="navbar-links">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/search" className="nav-link">Search</NavLink>
            <NavLink to="/saved" className="nav-link">Saved</NavLink>
            <NavLink to="/leaderboard" className="nav-link">Leaderboard</NavLink>
            <NavLink to="/map" className="nav-link">Map</NavLink>
        </div>

        <div className="profile-menu">
            {isLoggedIn ? (
            <>
                <NavLink to="/profile" className="profile-icon">
                {user.avatarUrl ? (
                    <img 
                    src={user.avatarUrl} 
                    alt={`${user.username}'s avatar`} 
                    style={{ width: 60, height: 60, borderRadius: '50%' }} 
                    />
                ) : (
                    <FaUserCircle size={60} />
                )}
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
