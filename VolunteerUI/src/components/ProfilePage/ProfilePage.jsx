import "./ProfilePage.css";
import { IoLocationSharp, IoCalendarSharp } from "react-icons/io5";
import { MdCake, MdEmojiEvents } from "react-icons/md";
import { GiThreeLeaves } from "react-icons/gi";
import { FaBarsProgress, FaFireFlameCurved, FaMedal, FaTrophy, FaStar } from "react-icons/fa6";
import { BsBookmarkHeartFill, BsAwardFill } from "react-icons/bs";
import { TbTargetArrow } from "react-icons/tb";
import { PiCertificateFill } from "react-icons/pi";
import { BiSolidDonateHeart } from "react-icons/bi";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../contexts/ProfileContext";
import { useNavigate } from "react-router-dom";
import { useLeaderboard } from "../../contexts/LeaderboardContext";
import { useEffect, useState } from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import axios from "axios";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, isLoaded } = useAuth();
  const { profile, loading, error } = useProfile();
  const navigate = useNavigate();
  const { users = [] } = useLeaderboard();
  const currentUser = users.find(u => u.firebaseUid === user?.uid);
  const leaderboardRank = currentUser?.leaderboardRank;
  const [allBadges, setAllBadges] = useState([]);
  
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/badges`)
      .then(res => setAllBadges(res.data))
      .catch(err => console.error("Error fetching all badges:", err));
  }, []);

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
    avatarUrl,
    createdAt,
    opportunities,
    badges = [],
  } = profile || {};

  let opps = [];
  if (isLoaded && Array.isArray(opportunities)) {
    opps = opportunities.map((o) => o.name);
  }

  const earnedBadgeIds = new Set(badges.map(b => b.id));
  const earnedBadges = allBadges.filter(badge => earnedBadgeIds.has(badge.id));
  const lockedBadges = allBadges.filter(badge => !earnedBadgeIds.has(badge.id));
  
  const renderOverview = () => (
    <div className="section-grid">
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
              <div> No interests listed.</div>
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
            <b>Leaderboard Status</b>
          </div>
          <div className="box-content">
            <div className="rank-label">
              Leaderboard Rank #{leaderboardRank || "N/A"}
            </div>
          </div>
        </div>

        <div className="box org-box">
          <div className="box-header">
            <BiSolidDonateHeart className="icon" />
            <b>Organizations Supported</b>
          </div>
          <div className="box-content">
            {opps.length ? (
              opps.map((name, index) => <div key={index}>{name}</div>)
            ) : (
              <div>No organizations supported yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBadges = () => (
    <div className="badges-container">
      <div className="badges-section">
        <h3>Earned Badges ({earnedBadges.length})</h3>
        <div className="badges-grid">
          {earnedBadges.map((badge) => (
            <div key={badge.id} className="badge earned">
              <div className="badge-icon">
                <img src={badge.imageUrl} alt={badge.name} className="badge-img" />
              </div>
              <div className="badge-name">{badge.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="badges-section">
        <h3>Locked Badges ({lockedBadges.length})</h3>
        <div className="badges-grid">
          {lockedBadges.map((badge) => (
            <div key={badge.id} className="badge locked">
              <div className="badge-icon">
                <img src={badge.imageUrl} alt={badge.name} className="badge-img locked-img" />
              </div>
              <div className="badge-name">{badge.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="profile-layout">
        {/* Left Side - Profile */}
        <div className="profile-sidebar">
          <div className="profile">
            <div className="name">{name}</div>
            <div className="img-container">
              <img
                src={avatarUrl || "https://i.postimg.cc/wT6j0qvg/Screenshot-2025-07-09-at-3-46-05-PM.png"}
                alt="Profile"
                className="profile-img"
              />
            </div>
            
            {/* Grid-based Bio Layout */}
            <div className="bio">
              <div className="info-label">
                <IoLocationSharp className="icon" />
                <span>Location</span>
              </div>
              <div className="info-value">{location || "Not set"}</div>
              
              <div className="info-label">
                <MdCake className="icon" />
                <span>Age</span>
              </div>
              <div className="info-value">{age || "Unknown"}</div>
              
              <div className="info-label">
                <GiThreeLeaves className="icon" />
                <span>Points</span>
              </div>
              <div className="info-value">{points || 0}</div>
              
              <div className="info-label">
                <FaBarsProgress className="icon" />
                <span>Level</span>
              </div>
              <div className="info-value">{level || "1"}</div>
              
              <div className="info-label">
                <IoCalendarSharp className="icon" />
                <span>Joined</span>
              </div>
              <div className="info-value">
                {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
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

        {/* Right Content Area */}
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-nav">
              <button
                className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`nav-tab ${activeTab === 'badges' ? 'active' : ''}`}
                onClick={() => setActiveTab('badges')}
              >
                Badges
              </button>
            </div>
            <ProgressBar points={points} size="normal" />
          </div>
          
          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'badges' && renderBadges()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;