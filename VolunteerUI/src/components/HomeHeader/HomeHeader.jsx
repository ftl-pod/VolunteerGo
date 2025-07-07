import "./HomeHeader.css";
import { FaRegPaperPlane } from "react-icons/fa";

function HomeHeader() {
  return (
    <div className="home-header">
      <div className="header-left">
        <div className="logo-placeholder">
          <FaRegPaperPlane />
        </div>
        <div className="org-name">
          <h1>VolunteerGo</h1>
        </div>
      </div>
      <div className="buttons-for-access header-right">
        <button className="login">L O G I N</button>
        <button className="register">Register</button>
      </div>
    </div>
  );
}


export default HomeHeader;
