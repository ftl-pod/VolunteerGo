import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PublicProfile.css";
import { IoLocationSharp, IoCalendarSharp } from "react-icons/io5";
import { MdCake } from "react-icons/md";
import { GiThreeLeaves } from "react-icons/gi";
import { FaBarsProgress } from "react-icons/fa6";
import { BiSolidDonateHeart } from "react-icons/bi";
import ProgressBar from "../ProgressBar/ProgressBar";

function PublicProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/by-uid/${userId}`
        );
        setProfile(response.data);
      } catch {
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return <div className="page-container">Loading profile...</div>;
  }

  if (error) {
    return <div className="page-container">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="page-container">User not found.</div>;
  }

  const {
    username,
    avatarUrl,
    location,
    points,
    level,
    interests = [],
    organizations = [],
    badges = [],
  } = profile;

  return (
    <div className="page-container public-profile">
      <div className="public-profile-header">
        <div className="profile-img-container">
          <img src={avatarUrl} alt="Profile" className="profile-img" />
        </div>
        <div className="profile-basic-info">
          <h2 className="username">{username}</h2>
          
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <GiThreeLeaves className="icon" />
          <span>Points: {points || 0}</span>
        </div>
        <div className="stat-item">
          <FaBarsProgress className="icon" />
          <span>Level: {level || "1"}</span>
        </div>
      </div>

      <div className="profile-details">
        <div className="section">
          <h3>Interests</h3>
          <div className="section-content">
            {interests.length ? (
              interests.map((interest, index) => (
                <div key={index} className="interest-item">{interest}</div>
              ))
            ) : (
              <div>No interests listed.</div>
            )}
          </div>
        </div>

        <div className="section">
          <h3>Organizations Supported</h3>
          <div className="section-content">
            {organizations.length ? (
              organizations.map((org, index) => (
                <div key={index} className="organization-item">{org}</div>
              ))
            ) : (
              <div>No organizations supported yet.</div>
            )}
          </div>
        </div>

        <div className="section">
          <h3>Badges Earned</h3>
          <div className="badges-grid">
            {badges.length ? (
              badges.map((badge) => (
                <div key={badge.id} className="badge earned">
                  <img
                    src={badge.imageUrl}
                    alt={badge.name}
                    className="badge-img"
                  />
                  <div className="badge-name">{badge.name}</div>
                </div>
              ))
            ) : (
              <div>No badges earned yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicProfile;
