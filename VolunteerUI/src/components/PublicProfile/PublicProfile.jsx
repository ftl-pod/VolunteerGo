import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PublicProfile.css";
import { GiThreeLeaves } from "react-icons/gi";
import { FaBarsProgress } from "react-icons/fa6";

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
    return (
      <div className="public-profile-page-container">Loading profile...</div>
    );
  }

  if (error) {
    return <div className="public-profile-page-container">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="public-profile-page-container">User not found.</div>;
  }

  const {
    username,
    avatarUrl,
    points,
    level,
    interests = [],
    opportunities = [],
    badges = [],
  } = profile;

  return (
    <div className="public-profile-page-container">
      <div className="public-profile-header-section">
        <div className="public-profile-img-container">
          <img src={avatarUrl} alt="Profile" className="public-profile-img" />
        </div>
        <div className="public-profile-basic-info">
          <h2 className="public-profile-username">{username}</h2>
        </div>
      </div>

      <div className="public-profile-stats">
        <div className="public-profile-stat-item">
          <GiThreeLeaves className="public-profile-icon" />
          <span>Points: {points || 0}</span>
        </div>
        <div className="public-profile-stat-item">
          <FaBarsProgress className="public-profile-icon" />
          <span>Level: {level || "1"}</span>
        </div>
      </div>

      <div className="public-profile-details">
        <div className="public-profile-section">
          <h3>Interests</h3>
          <div className="public-profile-section-content">
            {interests.length ? (
              interests.map((interest, index) => (
                <div key={index} className="public-profile-interest-item">
                  {interest}
                </div>
              ))
            ) : (
              <div>No interests listed.</div>
            )}
          </div>
        </div>

        <div className="public-profile-section">
          <h3>Organizations Supported</h3>
          <div className="public-profile-section-content">
            {opportunities.length ? (
              opportunities.map((org, index) => (
                <div key={index} className="public-profile-organization-item">
                  {org.name || org}
                </div>
              ))
            ) : (
              <div>No organizations supported yet.</div>
            )}
          </div>
        </div>

        <div className="public-profile-section">
          <h3>Badges Earned</h3>
          <div className="public-profile-badges-grid">
            {badges.length ? (
              badges.map((badge) => (
                <div key={badge.id} className="public-profile-badge earned">
                  <img
                    src={badge.imageUrl}
                    alt={badge.name}
                    className="public-profile-badge-img"
                  />
                  <div className="public-profile-badge-name">{badge.name}</div>
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
