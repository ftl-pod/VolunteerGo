import "./HomeHeader.css";
import { FaRegPaperPlane } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function HomeHeader() {
  const { user, loading } = useAuth();

  return (
    <div className="home-header">
      <div className="header-left">
        <div className="logo-placeholder-1">
          <img src="https://i.postimg.cc/QCP1hvbY/save-ezgif-com-effects.gif" className="earth-media" alt="logo-animation"/>
        </div>
        <div className="org-name">
          <h1>VolunteerGo</h1>
        </div>
      </div>

      {loading ? null : !user && (
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
