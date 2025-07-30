import "./Leaderboard.css";
import { useLeaderboard } from "../../contexts/LeaderboardContext";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

function Leaderboard() {
  const { users, loading } = useLeaderboard();
  const { user, isLoaded } = useAuth();

  if (loading || !isLoaded) {
    return <div className="page"><div className="title">Loading leaderboard...</div></div>;
  }

  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  const currentUserIndex = sortedUsers.findIndex(u => u.firebaseUid === user?.uid);

  // Debug logs (remove if you want)
  console.log('Current user:', user);
  console.log('User index:', currentUserIndex);
  console.log('Looking for uid:', user?.uid);

  return (
    <div className="page">
      <div className="title">Community Leaderboard</div>

      <div className="list">
        {users.length === 0 ? (
          <div>No users yet. Be the first to sign up!</div>
        ) : (
          sortedUsers.map((u, index) => (
            <div
              className={`list-item ${
                u.firebaseUid === user?.uid ? "current-user-highlight" : ""
              }`}
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
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
