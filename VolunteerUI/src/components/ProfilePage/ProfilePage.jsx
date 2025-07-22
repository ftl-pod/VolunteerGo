import "./ProfilePage.css";
import { IoLocationSharp, IoCalendarSharp } from "react-icons/io5";
import { MdCake } from "react-icons/md";
import { GiThreeLeaves } from "react-icons/gi";
import { FaBarsProgress, FaFireFlameCurved } from "react-icons/fa6";
import { BsBookmarkHeartFill } from "react-icons/bs";
import { TbTargetArrow } from "react-icons/tb";
import { PiCertificateFill } from "react-icons/pi";
import { BiSolidDonateHeart } from "react-icons/bi";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../contexts/ProfileContext"; // Import profile context
import { useNavigate } from "react-router-dom";
import { useLeaderboard } from "../../contexts/LeaderboardContext"; // Import leaderboard context

function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading, error } = useProfile(); // Use context for profile data, loading, and error
  const navigate = useNavigate();
  const { users = [] } = useLeaderboard();
  const currentUser = users.find(u => u.firebaseUid === user?.uid);

  const leaderboardRank = currentUser?.leaderboardRank;
  if (!user) {
    return (
      <div className="page-container">
        <div className="section">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="section">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="section">
          <p>Error loading profile: {error}</p>
        </div>
      </div>
    );
  }


  // Destructure profile fields
const {
  location,
  name = user?.displayName || "Unnamed User",
  age,
  points = 0,
  level = "1",
  skills = [],
  training = [],
  interests = [],
  avatarUrl ,
  createdAt,
} = profile || {}; 

  return (
    <div className="page-container">
      <div className="section">
        <div className="profile">
          <div className="name">{name}</div>
          <div className="img-container">
            <img
              src={avatarUrl || "https://i.postimg.cc/wT6j0qvg/Screenshot-2025-07-09-at-3-46-05-PM.png"}
              alt="Profile"
              className="profile-img"
            />
          </div>
          <div className="bio">
            <div className="info">
              <div>
                <IoLocationSharp className="icon" />
                <b>Location</b>
              </div>
              <div>
                <MdCake className="icon" />
                <b>Age</b>
              </div>
              <div>
                <GiThreeLeaves className="icon" />
                <b>Points</b>
              </div>
              <div>
                <FaBarsProgress className="icon" />
                <b>Level</b>
              </div>
              <div>
                <IoCalendarSharp className="icon" />
                <b>Joined</b>
              </div>
            </div>
            <div className="info">
              <div>{location || "Not set"}</div>
              <div>{age || "Unknown"}</div>
              <div>{points || 0}</div>
              <div>{level || "1"}</div>
              <div>
                {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
              </div>
            </div>
          </div>
          <button
            className="btn-primary profile-button"
            onClick={() => navigate("/onboarding")}
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="section">
        <div className="box">
          <div className="box-header">
            <BsBookmarkHeartFill className="icon" />
            <b>Interests</b>
          </div>
          <div className="box-content">
            {interests.length ? (
              interests.map((i, index) => <div key={index}>{i}</div>)
            ) : (
              <div>No interests listed.</div>
            )}
          </div>
        </div>

        <div className="box">
          <div className="box-header">
            <TbTargetArrow className="icon" />
            <b>Skills</b>
          </div>
          <div className="box-content">
            {skills.length ? (
              skills.map((skill, index) => <div key={index}>{skill}</div>)
            ) : (
              <div>No skills listed.</div>
            )}
          </div>
        </div>

        <div className="box">
          <div className="box-header">
            <PiCertificateFill className="icon" />
            <b>Certifications</b>
          </div>
          <div className="box-content">
            {training.length ? (
              training.map((t, index) => <div key={index}>{t}</div>)
            ) : (
              <div>No certifications listed.</div>
            )}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="box">
          <div className="box-header">
            <FaFireFlameCurved className="icon" />
            <b>Leaderboard status</b>
          </div>
          <div className="box-content">
            <div className="rank-label">
              Leaderboard Rank: #{leaderboardRank || "N/A"}
            </div>
          </div>
        </div>

        <div className="section2">
          <div className="s2-header">
            <BiSolidDonateHeart className="icon" />
            <b>You Have Made A Difference With</b>
          </div>
          <div className="s2-content"></div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
