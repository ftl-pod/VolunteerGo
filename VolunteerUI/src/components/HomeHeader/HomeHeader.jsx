import "./HomeHeader.css";
import { FaRegPaperPlane } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useUser, useClerk} from '@clerk/clerk-react';

function HomeHeader() {
  const {isSignedIn, isLoaded} = useUser();
  return (
    <div className="home-header">
      <div className="header-left">
        <div className="logo-placeholder-1">
          <FaRegPaperPlane />
        </div>
        <div className="org-name">
          <h1>VolunteerGo</h1>
        </div>
      </div>
      {!isLoaded ? null : isSignedIn ? null : (
  <div className="buttons-for-access header-right">
    <NavLink to="/login" className="nav-link">
      <button className="login">Login</button>
    </NavLink>
    <NavLink to="/signup" className="nav-link">
      <button className="register">Register</button>
    </NavLink>
  </div>
)}
      
    </div>
  
);
}


export default HomeHeader;
