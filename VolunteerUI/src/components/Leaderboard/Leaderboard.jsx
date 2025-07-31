import "./Leaderboard.css";
import { useLeaderboard } from "../../contexts/LeaderboardContext";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaRubleSign } from "react-icons/fa6";

function Leaderboard() {
  const { users, loading } = useLeaderboard();
  const { user, isLoaded, token } = useAuth();
  const [mode, setMode] = useState("community")
  const [friends, setFriends] = useState([]);
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  const fullCurrentUser = users.find((u) => u.firebaseUid === user.uid);

      useEffect(() => {
        const getFriendsAPI = async (token) => {
          try {
              const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/friends/list`, {
              headers: { Authorization: `Bearer ${token}` },
              });
              return response.data;
          } catch (error) {
              console.error("Error fetching friends:", error);
              throw error;
          }
        };
        if (!token) return;
        const fetchFriendsData = async () => {
          try {
            const friendsData = await getFriendsAPI(token);
            setFriends([...friendsData, fullCurrentUser]);
            console.log("my friends", friendsData);
          } catch (error) {
            console.error("error fetching friends", error);
          }
        };
        fetchFriendsData();
      }, [token, user, users]);
      const sortedFriends = [...friends].sort((a, b) => b.points - a.points);

    if (loading || !isLoaded) {
      return <div className="page"><div className="title">Loading leaderboard...</div></div>;
    }
  const renderCommunity = () => (
    users.length === 0 ? (
      <div>No users yet. Be the first to sign up!</div>
    ) : 
      sortedUsers.map((u, index) => (
        <div
          className={`list-item ${u.firebaseUid === user?.uid ? 'current-user-highlight' : ''}`}
          key={u.firebaseUid || u.id || index}
        >
          <div className="rank">
            <div className="circle">{index + 1}</div>
          </div>
          <div className="user-name">
            <Link
                  to={`/public-profile/${u.firebaseUid}`}
                  className="user-link"
                >
                  <div className="pfp">
                    <div className="circle">
                      <img
                        className="pfp-img"
                        src={u.avatarUrl}
                        alt="Profile"
                      />
                    </div>
                  </div>
                </Link>
                <Link
                  to={`/public-profile/${u.firebaseUid}`}
                  className="user-link"
                >
                  <div className="leaderboard-username">{u.username}</div>
                </Link>
          </div>
          <div className="points">{u.points}</div>
        </div>
    ))
  );

  const renderFriends = () => (
  sortedFriends
    .filter((u) => u && u.firebaseUid) // filter out invalid users
    .map((u, index) => (
      <div
        className={`list-item ${u.firebaseUid === user?.uid ? 'current-user-highlight' : ''}`}
        key={u.firebaseUid || u.id || index}
      >
        <div className="rank">
          <div className="circle">{index + 1}</div>
        </div>
        <div className="user-name">
          <Link
                  to={`/public-profile/${u.firebaseUid}`}
                  className="user-link"
                >
                  <div className="pfp">
                    <div className="circle">
                      <img
                        className="pfp-img"
                        src={u.avatarUrl}
                        alt="Profile"
                      />
                    </div>
                  </div>
                </Link>
                <Link
                  to={`/public-profile/${u.firebaseUid}`}
                  className="user-link"
                >
                  <div className="leaderboard-username">{u.username}</div>
                </Link>
        </div>
        <div className="points">{u.points}</div>
      </div>
    ))
);
 
  return (
    <div className="page">
      <div className="LBsquiggly-bg">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`LBsquiggly-line line-${i}`}
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            d="
              M0,50 
              C80,0 160,100 240,50 
              S400,0 480,50 
              S640,100 720,50 
              S880,0 960,50 
              S1120,100 1200,50 
              S1360,0 1440,50"
            fill="none"
            stroke="#374f37"
            strokeWidth="3"
          />
        </svg>
      ))}
      </div>
      <div className="mode-toggle">
        
        <button className={`mode-btn ${mode === "community" ? "active" : ""}`}
        onClick={() => setMode("community")}>
        Community
        </button>

        <button className={`mode-btn ${mode === "friends" ? "active" : ""}`}
        onClick={() => setMode("friends")}
        >Friends</button>

      </div>
      <div className="list">
        {mode === "community" && renderCommunity()}
        {mode === "friends" && renderFriends()}
      </div>
    </div>
  );
}

export default Leaderboard;
