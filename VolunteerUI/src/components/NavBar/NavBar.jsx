import './NavBar.css'

function NavBar() {
    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="logo">OpportunityHub</div>
                <ul className="nav-links">
                    <li><a href="#">Home</a></li>
                    <li><a href="#search">Search</a></li>
                    <li><a href="#login">Login</a></li>
                    <li><a href="#signup">Signup</a></li>
                    <li><a href="#profile">Profile</a></li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar
