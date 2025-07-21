import "./Leaderboard.css";
import { useEffect, useState } from "react";

function Leaderboard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const url = `${import.meta.env.VITE_API_BASE_URL}/users`;
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                const data = await res.json();
                console.log(data); // Log the fetched user data
                setUsers(data);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            }
        }
        fetchUsers();
    }, []);
    return (
    <>
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
    </>
    );
}
export default Leaderboard