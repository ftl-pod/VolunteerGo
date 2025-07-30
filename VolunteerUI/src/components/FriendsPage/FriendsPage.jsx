// src/components/FriendsSection/FriendsSection.jsx
import "../ProfilePage/ProfilePage.css";
import { useEffect, useState } from "react";
import {
  FaUserPlus,
  FaUserClock,
  FaAddressBook,
  FaX,
  FaCheck,
  FaSistrix,
} from "react-icons/fa6";
import { GiThreeLeaves } from "react-icons/gi";
import { IoLocationSharp } from "react-icons/io5";
import axios from "axios";

function FriendsSection({ user, profile, token }) {
  const [friendsView, setFriendsView] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  // Mock states (replace with backend calls)
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  useEffect(() => {
    fetchAllUsers();
    if (user && token) {
      fetchFriendsData(token);
    }
  }, [user, token]);

  const fetchAllUsers = async () => {
    try {
      const { data: users } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users`
      );
      const friendsData = await getFriendsAPI(token);
      const receivedRequests = await getReceivedFriendRequestsAPI(token);
      const sentRequests = await getSentFriendRequestsAPI(token);

      const friendIds = new Set(friendsData.map((f) => f.id));
      const pendingSenderIds = new Set(receivedRequests.map((r) => r.senderId));
      const pendingReceiverIds = new Set(sentRequests.map((r) => r.receiverId));

      const filteredUsers = users.filter(
        (u) =>
          u.id !== profile?.id &&
          !friendIds.has(u.id) &&
          !pendingSenderIds.has(u.id) &&
          !pendingReceiverIds.has(u.id)
      );

      setAllUsers(filteredUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchFriendsData = async (token) => {
    try {
      // Fetch friends list
      const friendsData = await getFriendsAPI(token);
      setFriends(friendsData);

      // Fetch received friend requests
      const receivedData = await getReceivedFriendRequestsAPI(token);
      setReceivedRequests(
        receivedData.map((req) => ({
          id: req.id,
          name: req.sender.name,
          points: req.sender.points,
          avatarUrl:
            req.sender.avatarUrl || "https://i.ibb.co/rf6XN61Q/plant.png",
          receivedDate: req.createdAt,
          firebaseUid: req.sender.firebaseUid,
        }))
      );

      // Fetch sent friend requests
      const sentData = await getSentFriendRequestsAPI(token);
      setSentRequests(
        sentData.map((req) => ({
          id: req.id,
          name: req.receiver.name,
          points: req.receiver.points,
          avatarUrl:
            req.receiver.avatarUrl || "https://i.ibb.co/rf6XN61Q/plant.png",
          sentDate: req.createdAt,
          firebaseUid: req.receiver.firebaseUid,
        }))
      );
    } catch (error) {
      console.error("Error fetching friends data:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(true);
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const filtered = allUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(query.toLowerCase()) ||
        u.location?.toLowerCase().includes(query.toLowerCase()) ||
        u.interests?.some((i) =>
          i.toLowerCase().includes(query.toLowerCase())
        ) ||
        u.skills?.some((s) => s.toLowerCase().includes(query.toLowerCase()))
    );

    setSearchResults(filtered);
    setIsSearching(false);
  };

  // API functions for friend operations
  const sendFriendRequestAPI = async (receiverId, token) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/friends/request`,
        { receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error sending friend request:", error);
      throw error;
    }
  };

  const getReceivedFriendRequestsAPI = async (token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/friends/received-requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching received friend requests:", error);
      throw error;
    }
  };

  const getSentFriendRequestsAPI = async (token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/friends/sent-requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching sent friend requests:", error);
      throw error;
    }
  };

  const acceptFriendRequestAPI = async (requestId, token) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/friends/accept`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error accepting friend request:", error);
      throw error;
    }
  };

  const rejectFriendRequestAPI = async (requestId, token) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/friends/reject`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      throw error;
    }
  };

  const cancelFriendRequestAPI = async (requestId, token) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/friends/cancel`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error cancelling sent friend request:", error);
      throw error;
    }
  };

  const getFriendsAPI = async (token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/friends/list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching friends:", error);
      throw error;
    }
  };

  // Handlers for friend operations

  const handleSendFriendRequest = async (userId, token) => {
    const userToAdd = allUsers.find((u) => u.id === userId);
    if (userToAdd) {
      // API returns the created friend request with its ID
      const newRequestData = await sendFriendRequestAPI(userToAdd.id, token);

      // Construct newRequest with correct id and user info
      const newRequest = {
        id: newRequestData.id, // <-- friend request ID from backend
        name: userToAdd.name,
        points: userToAdd.points || 0,
        avatarUrl: userToAdd.avatarUrl || "https://i.ibb.co/rf6XN61Q/plant.png",
        sentDate: new Date().toISOString(),
        firebaseUid: userToAdd.firebaseUid,
      };

      setSentRequests((prev) => [...prev, newRequest]);
      setSearchResults((prev) => prev.filter((u) => u.id !== userId));
      setAllUsers((prev) => prev.filter((u) => u.id !== userId));
      setFriendsView("sent");
    }
  };

  const handleAcceptRequest = async (requestId, token) => {
    const req = receivedRequests.find((r) => r.id === requestId);
    if (req) {
      await acceptFriendRequestAPI(requestId, token);
      setFriends((prev) => [...prev, req]);
      setReceivedRequests((prev) => prev.filter((r) => r.id !== requestId));
    }
  };

  const handleDenyRequest = async (requestId, token) => {
    try {
      await rejectFriendRequestAPI(requestId, token);
      setReceivedRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.error("Failed to reject friend request:", error);
    }
  };

  const handleCancelSentRequest = async (requestId, token) => {
    console.log("Cancel request clicked for request ID:", requestId);
    try {
      await cancelFriendRequestAPI(requestId, token);
      setSentRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.error("Failed to cancel sent friend request:", error);
    }
  };
  return (
    <div className="friends-container">
      <div className="friends-toggle">
        <button
          className={`toggle-btn ${friendsView === "friends" ? "active" : ""}`}
          onClick={() => setFriendsView("friends")}
        >
          Friends ({friends.length})
        </button>
        <button
          className={`toggle-btn ${friendsView === "received" ? "active" : ""}`}
          onClick={() => setFriendsView("received")}
        >
          Received ({receivedRequests.length})
        </button>
        <button
          className={`toggle-btn ${friendsView === "sent" ? "active" : ""}`}
          onClick={() => setFriendsView("sent")}
        >
          Sent ({sentRequests.length})
        </button>
      </div>

      {friendsView === "friends" && (
        <div className="friends-section">
          <h3>
            <FaAddressBook className="icon" />
            Your Friends
          </h3>
          <div className="friends-list">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div key={friend.id} className="friend-item">
                  <img
                    src={friend.avatarUrl}
                    alt={friend.name}
                    className="friend-avatar"
                  />
                  <div className="friend-info">
                    <div className="friend-name">{friend.name}</div>
                    <div className="friend-points">
                      <GiThreeLeaves className="icon" />
                      {friend.points} points
                    </div>
                  </div>
                  <div className="friend-status">Friends</div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                No friends yet. Send some friend requests to get started!
              </div>
            )}
          </div>
        </div>
      )}

      {friendsView === "received" && (
        <div className="friends-section">
          <h3>
            <FaUserPlus className="icon" />
            Received Requests
          </h3>
          <div className="friends-list">
            {receivedRequests.length > 0 ? (
              receivedRequests.map((request) => (
                <div key={request.id} className="friend-item">
                  <img
                    src={request.avatarUrl}
                    alt={request.name}
                    className="friend-avatar"
                  />
                  <div className="friend-info">
                    <div className="friend-name">{request.name}</div>
                    <div className="friend-points">
                      <GiThreeLeaves className="icon" />
                      {request.points} points
                    </div>
                    <div className="request-meta">
                      Received{" "}
                      {new Date(request.receivedDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="friend-actions">
                    <button
                      className="action-btn accept-btn"
                      onClick={() => handleAcceptRequest(request.id, token)}
                      title="Accept Request"
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="action-btn deny-btn"
                      onClick={() => handleDenyRequest(request.id, token)}
                      title="Deny Request"
                    >
                      <FaX />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No pending friend requests.</div>
            )}
          </div>
        </div>
      )}

      {friendsView === "sent" && (
        <div className="friends-section">
          <h3>
            <FaUserClock className="icon" />
            Sent Requests
          </h3>
          <div className="friends-list">
            {sentRequests.length > 0 ? (
              sentRequests.map((request) => (
                <div key={request.id} className="friend-item">
                  <img
                    src={request.avatarUrl}
                    alt={request.name}
                    className="friend-avatar"
                  />
                  <div className="friend-info">
                    <div className="friend-name">{request.name}</div>
                    <div className="friend-points">
                      <GiThreeLeaves className="icon" />
                      {request.points} points
                    </div>
                    <div className="request-meta">
                      Sent {new Date(request.sentDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="friend-actions">
                    <button
                      className="action-btn deny-btn"
                      onClick={() => handleCancelSentRequest(request.id, token)}
                      title="Cancel Request"
                    >
                      <FaX />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No sent friend requests.</div>
            )}
          </div>
        </div>
      )}

      <div className="friends-section">
        <h3>
          <FaSistrix className="icon" />
          Find Friends
        </h3>

        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search by name, location, interests, or skills..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        {/* Friend Search */}
        <div className="friends-list">
          {isSearching ? (
            <div className="loading-state">Searching...</div>
          ) : searchQuery && searchResults.length === 0 ? (
            <div className="empty-state">
              No users found matching "{searchQuery}"
            </div>
          ) : searchQuery === "" ? (
            <div className="empty-state">
              Start typing to search for friends...
            </div>
          ) : (
            searchResults.map((user) => (
              <div key={user.id} className="friend-item search-result">
                <img
                  src={user.avatarUrl || "https://i.ibb.co/rf6XN61Q/plant.png"}
                  alt={user.name}
                  className="friend-avatar"
                />
                <div className="friend-info">
                  <div className="friend-name">{user.name}</div>
                  <div className="friend-points">
                    <GiThreeLeaves className="icon" />
                    {user.points || 0} points
                  </div>
                  {user.location && (
                    <div className="friend-location">
                      <IoLocationSharp className="icon" />
                      {user.location}
                    </div>
                  )}
                  {user.interests && user.interests.length > 0 && (
                    <div className="friend-interests">
                      Interests: {user.interests.slice(0, 3).join(", ")}
                      {user.interests.length > 3 && "..."}
                    </div>
                  )}
                </div>
                <div className="friend-actions">
                  <button
                    className="action-btn send-request-btn"
                    onClick={() => handleSendFriendRequest(user.id, token)}
                    title="Send Friend Request"
                  >
                    <FaUserPlus />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendsSection;
