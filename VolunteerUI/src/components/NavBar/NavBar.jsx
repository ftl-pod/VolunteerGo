import './NavBar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { useUser, useClerk } from '@clerk/clerk-react';

function Navbar() {
    const navigate = useNavigate();
    const { signOut } = useClerk();
    const { user } = useUser();

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
                <NavLink to="/saved" className="nav-link">Saved</NavLink>
                <NavLink to="/leaderboard" className="nav-link">Leaderboard</NavLink>
                <NavLink to="/map" className="nav-link">Map</NavLink>
                                <NavLink to="/onboarding" className="nav-link">Onboarding</NavLink>

            </div>

            <div className="profile-menu">
                {isLoggedIn ? (
                    <>
                        <NavLink to="/profile" className="profile-icon">
                            {user.imageUrl ? (
                                <img 
                                    src={user.imageUrl} 
                                    alt={`${user.username || 'User'}'s avatar`} 
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
