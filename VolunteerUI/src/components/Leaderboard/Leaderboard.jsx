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
                {/* <div className="list-item">
                    <div className="rank">
                        rank
                    </div>
                    <div className="name">

                        volunteer
                    </div>
                    <div className="points">points</div>
                </div> */}
                {
                    users.sort((a, b) => a.leaderboardRank - b.leaderboardRank).map((u)=>{
                        return (
                            <div className="list-item" key={u.id}>
                                <div className="rank">
                                    <div className="circle">{u.leaderboardRank}</div>
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
                        )
                    })
                }
            </div>
        </div>
        </>
    );
}

export default Leaderboard