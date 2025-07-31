import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PublicProfile.css";
import { GiThreeLeaves } from "react-icons/gi";
import { FaBarsProgress } from "react-icons/fa6";
import { FaUserPlus, FaCheck, FaHourglassHalf } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

function PublicProfile() {
  const { userId } = useParams();
  const { user, token, isSignedIn } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [friendStatus, setFriendStatus] = useState("not_friends"); // "not_friends", "request_sent", "request_received", "friends"
  const [loadingFriendStatus] = useState(false);
  const [friendActionLoading, setFriendActionLoading] = useState(false);
  const [receivedRequests, setReceivedRequests] = useState([]);

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

useEffect(() => {
  const fetchFriendStatus = async () => {
    if (!isSignedIn || !user || !token) return;
    try {
      const friendsRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/friends/list`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (friendsRes.data.some((f) => f.firebaseUid === userId)) {
        setFriendStatus("friends");
        return;
      }

      const sentRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/friends/sent-requests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (sentRes.data.some((r) => r.receiver?.firebaseUid === userId)) {
        setFriendStatus("request_sent");
        return;
      }
      const receivedRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/friends/received-requests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReceivedRequests(receivedRes.data);
      if (receivedRes.data.some((r) => r.sender?.firebaseUid === userId)) {
        setFriendStatus("request_received");
        return;
      }

      setFriendStatus("not_friends");
    } catch (err) {
      setFriendStatus("not_friends", err);
    }
  };

  fetchFriendStatus();
}, [userId, isSignedIn, user, token]);

  const showFriendButton = isSignedIn && user?.uid !== userId;


  const sendFriendRequest = async (receiverId, token) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/friends/request`,
        { receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setFriendActionLoading(false);
    }
  };

  const acceptFriendRequest = async () => {
    if (friendActionLoading) return;
    setFriendActionLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const request = receivedRequests.find(r => r.sender?.firebaseUid === userId);
      if (!request) {
        throw new Error("Friend request not found");
      }
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/friends/accept`,
        { requestId: request.id },
        config
      );
      setFriendStatus("friends");
    } catch (err) {
      console.error("Failed to accept friend request", err);
    } finally {
      setFriendActionLoading(false);
    }
  };

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
        <div className="public-profile-avatar-stack">
          <div className="public-profile-img-container">
            <img src={avatarUrl} alt="Profile" className="public-profile-img" />
          </div>
          {showFriendButton && (
            <div className="public-profile-friend-request-button-container">
              {loadingFriendStatus ? (
                <FaHourglassHalf
                  className="public-profile-friend-request-icon pending"
                  title="Loading friend status..."
                />
                ) : friendStatus === "not_friends" ? (
                <FaUserPlus
                  className="public-profile-friend-request-icon add"
                  title="Add Friend"
                  onClick={() => sendFriendRequest(profile.id, token)}
                  style={{
                    cursor: friendActionLoading ? "not-allowed" : "pointer",
                  }}
                />
              ) : friendStatus === "request_sent" ? (
                <FaUserPlus
                  className="public-profile-friend-request-icon sent"
                  title="Friend Request Sent"
                  style={{ cursor: "default", opacity: 0.5 }}
                />
              ) : friendStatus === "request_received" ? (
                <FaUserPlus
                  className="public-profile-friend-request-icon received"
                  title="Accept Friend Request"
                  onClick={acceptFriendRequest}
                  style={{
                    cursor: friendActionLoading ? "not-allowed" : "pointer",
                  }}
                />
              ) : friendStatus === "friends" ? (
                <FaCheck
                  className="public-profile-friend-request-icon friends"
                  title="Friends"
                />
              ) : null}
            </div>
          )}
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
