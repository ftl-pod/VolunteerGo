import "./Leaderboard.css";
import { useLeaderboard } from "../../contexts/LeaderboardContext";

function Leaderboard() {
  const { users, loading} = useLeaderboard();

  if (loading) {
    return <div className="page"><div className="title">Loading leaderboard...</div></div>;
  }

  return (
    <div className="page">
      <div className="title">Community Leaderboard</div>
      <div className="list">
        {users.length === 0 ? (
          <div>No users yet. Be the first to sign up!</div>
        ) : (
          [...users]
            .sort((a, b) => b.points - a.points)
            .map((u, index) => (
              <div className="list-item" key={u.id}>
                <div className="rank">
                  <div className="circle">{index + 1}</div>
                </div>
                <div className="user-name">
                  <div className="pfp">
                    <div className="circle">
                      <img className="pfp-img" src={u.avatarUrl} alt="Profile" />
                    </div>
                  </div>
                  {u.username}
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
