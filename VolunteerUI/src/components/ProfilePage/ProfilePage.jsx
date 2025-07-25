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
function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, isLoaded } = useAuth();
  const { profile, loading, error } = useProfile();
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
    avatarUrl,
    createdAt,
    opportunities,
  } = profile || {};

  let opps = [];
  if (isLoaded && Array.isArray(opportunities)) {
    opps = opportunities.map((o) => o.name);
  }

  // Mock badges data - replace with actual badge data from your backend
const badges = [
  {
    id: 1,
    name: "Animal Advocate",
    image: "https://i.postimg.cc/vDy8pfBr/1-removebg-preview.png",
    color: "#6fbf92",
    earned: true
  },
  {
    id: 2,
    name: "Planet Protector",
    image: "https://i.postimg.cc/KRvGYbt4/2-removebg-preview.png",
    color: "#b0a46c",
    earned: true
  },
  {
    id: 3,
    name: "Heart of the Community",
    image: "https://i.postimg.cc/RWWvcTsB/3-removebg-preview.png",
    color: "#d88a99",
    earned: true
  },
  {
    id: 4,
    name: "Volunteer Connector",
    image: "https://i.postimg.cc/dhgwnTpT/4-removebg-preview.png",
    color: "#85c9d6",
    earned: true
  },
  {
    id: 5,
    name: "Impact Leader",
    image: "https://i.postimg.cc/QB5szdZY/5-removebg-preview.png",
    color: "#d4a855",
    earned: true
  },
  {
    id: 6,
    name: "First Steps",
    image: "https://i.postimg.cc/nM1VZrj6/6-removebg-preview.png",
    color: "#cc6c5b",
    earned: true
  },
  {
    id: 7,
    name: "Newcomer Badge",
    image: "https://i.postimg.cc/4mLJ701P/7-removebg-preview.png",
    color: "#b4aee8",
    earned: false
  }
];

  const earnedBadges = badges.filter(badge => badge.earned);
  const lockedBadges = badges.filter(badge => !badge.earned);
  const renderOverview = () => (
    <>
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

        <div className="box org-box">
          <div className="box-header">
            <BiSolidDonateHeart className="icon" />
            <b>You Have Made A Difference With</b>
          </div>
          <div className="box-content">
            {opps.map((name, index) => (<div key={index}> {name} </div>))}
          </div>
      </div>
      </div>
      </div>
    </>
  );

  const renderBadges = () => (
    <div className="badges-container">
      <div className="badges-section">
        <h3>Earned Badges ({earnedBadges.length})</h3>
        <div className="badges-grid">
          {earnedBadges.map((badge) => (
            <div key={badge.id} className="badge earned">
              <div className="badge-icon" style={{ color: badge.color }}>
                <img src={badge.image} alt={badge.name} className="badge-img" />
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
              <div className="badge-icon" style={{ color: badge.color }}>
                <img src={badge.image} alt={badge.name} className="badge-img locked-img" />
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

        <div className="profile-content">
          {/* Navigation Tabs */}
          
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
          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="section">
                {renderOverview()}
              </div>
            )}
            {activeTab === 'badges' && renderBadges()}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;