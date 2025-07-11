import "./HomeHeader.css";
import { FaRegPaperPlane } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function HomeHeader() {
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
      <div className="buttons-for-access header-right">
        <NavLink to="/login" className="nav-link">
          <button className="login">L O G I N</button>
        </NavLink>
        <NavLink to="/signup" className="nav-link">
          <button className="register">Register</button>
        </NavLink>
      </div>
    </div>
  );
}


export default HomeHeader;
