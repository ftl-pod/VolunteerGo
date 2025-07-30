import "./ProfilePage.css";
import { IoLocationSharp, IoCalendarSharp } from "react-icons/io5";
import { MdCake, MdEmojiEvents } from "react-icons/md";
import { GiThreeLeaves } from "react-icons/gi";
import { FaBarsProgress, FaFireFlameCurved, FaMedal, FaTrophy, FaStar, FaCheck, FaX, FaUserPlus, FaUserClock, FaAddressBook, FaSistrix } from "react-icons/fa6";
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
import axios from "axios";
import FriendsSection from "../FriendsPage/FriendsPage";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [friendsView, setFriendsView] = useState('friends'); // 'friends', 'sent', 'received', 'search'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  
  const { user, isLoaded, token } = useAuth();
  const { profile, loading, error } = useProfile();
  const navigate = useNavigate();
  const { users = [] } = useLeaderboard();
  const currentUser = users.find(u => u.firebaseUid === user?.uid);
  const leaderboardRank = currentUser?.leaderboardRank;
  const [allBadges, setAllBadges] = useState([]);
  
  // Mock friends data - replace with actual API calls
  const [friends, setFriends] = useState([
    { id: 1, name: "Alice Johnson", points: 1250, avatarUrl: "https://i.ibb.co/rf6XN61Q/plant.png" },
    { id: 2, name: "Bob Smith", points: 980, avatarUrl: "https://i.ibb.co/rf6XN61Q/plant.png" },
    { id: 3, name: "Carol Davis", points: 1500, avatarUrl: "https://i.ibb.co/rf6XN61Q/plant.png" },
  ]);
  
  const [sentRequests, setSentRequests] = useState([
    { id: 4, name: "David Wilson", points: 750, avatarUrl: "https://i.ibb.co/rf6XN61Q/plant.png", sentDate: "2025-01-15" },
    { id: 5, name: "Emma Brown", points: 1100, avatarUrl: "https://i.ibb.co/rf6XN61Q/plant.png", sentDate: "2025-01-14" },
  ]);
  
  const [receivedRequests, setReceivedRequests] = useState([
    { id: 6, name: "Frank Miller", points: 890, avatarUrl: "https://i.ibb.co/rf6XN61Q/plant.png", receivedDate: "2025-01-16" },
    { id: 7, name: "Grace Lee", points: 1350, avatarUrl: "https://i.ibb.co/rf6XN61Q/plant.png", receivedDate: "2025-01-15" },
  ]);
  
  useEffect(() => {
    // Fetch all badges
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/badges`)
      .then(res => setAllBadges(res.data))
      .catch(err => console.error("Error fetching all badges:", err));
    
    // Fetch all users for search functionality
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const { data: users } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`);
      // Filter out current user and existing friends
      const filteredUsers = users.filter(u => 
        u.firebaseUid !== user?.uid && 
        !friends.some(friend => friend.firebaseUid === u.firebaseUid) &&
        !sentRequests.some(req => req.firebaseUid === u.firebaseUid) &&
        !receivedRequests.some(req => req.firebaseUid === u.firebaseUid)
      );
      setAllUsers(filteredUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
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

    // Filter users based on search query
    const filtered = allUsers.filter(user => 
      user.name?.toLowerCase().includes(query.toLowerCase()) ||
      user.location?.toLowerCase().includes(query.toLowerCase()) ||
      user.interests?.some(interest => 
        interest.toLowerCase().includes(query.toLowerCase())
      ) ||
      user.skills?.some(skill => 
        skill.toLowerCase().includes(query.toLowerCase())
      )
    );
    
    setSearchResults(filtered);
    setIsSearching(false);
  };

  const handleSendFriendRequest = (userId) => {
    // Find the user in search results or all users
    const userToAdd = searchResults.find(u => u.id === userId) || allUsers.find(u => u.id === userId);
    
    if (userToAdd) {
      // Add to sent requests
      const newRequest = {
        ...userToAdd,
        sentDate: new Date().toISOString().split('T')[0]
      };
      setSentRequests(prev => [...prev, newRequest]);
      
      // Remove from search results and all users
      setSearchResults(prev => prev.filter(u => u.id !== userId));
      setAllUsers(prev => prev.filter(u => u.id !== userId));
      
      // Here you would also make an API call to send the friend request
      // await axios.post(`${import.meta.env.VITE_API_BASE_URL}/friend-requests`, { recipientId: userId });
    }
  };

  // Friend request handlers
  const handleAcceptRequest = (requestId) => {
    const request = receivedRequests.find(r => r.id === requestId);
    if (request) {
      // Move to friends list
      setFriends(prev => [...prev, { ...request, id: Date.now() }]);
      // Remove from received requests
      setReceivedRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  const handleDenyRequest = (requestId) => {
    setReceivedRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleCancelSentRequest = (requestId) => {
    setSentRequests(prev => prev.filter(r => r.id !== requestId));
  };

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
    skills = [],
    training = [],
    interests = [],
    avatarUrl,
    createdAt,
    opportunities,
    badges = [],
  } = profile || {};

  let opps = [];
  if (isLoaded && Array.isArray(opportunities)) {
    opps = opportunities.map((o) => o.name);
  }

  const renderFriends = () => (
    <div className="friends-container">
      <div className="friends-toggle">
        <button
          className={`toggle-btn ${friendsView === 'friends' ? 'active' : ''}`}
          onClick={() => setFriendsView('friends')}
        >
          Friends ({friends.length})
        </button>
        <button
          className={`toggle-btn ${friendsView === 'received' ? 'active' : ''}`}
          onClick={() => setFriendsView('received')}
        >
          Received ({receivedRequests.length})
        </button>
        <button
          className={`toggle-btn ${friendsView === 'sent' ? 'active' : ''}`}
          onClick={() => setFriendsView('sent')}
        >
          Sent ({sentRequests.length})
        </button>
      </div>

      {friendsView === 'friends' && (
        <div className="friends-section">
          <h3>
            <FaAddressBook className="icon" />
            Your Friends
          </h3>
          <div className="friends-list">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div key={friend.id} className="friend-item">
                  <img src={friend.avatarUrl} alt={friend.name} className="friend-avatar" />
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

      {friendsView === 'received' && (
        <div className="friends-section">
          <h3>
            <FaUserPlus className="icon" />
            Received Requests
          </h3>
          <div className="friends-list">
            {receivedRequests.length > 0 ? (
              receivedRequests.map((request) => (
                <div key={request.id} className="friend-item">
                  <img src={request.avatarUrl} alt={request.name} className="friend-avatar" />
                  <div className="friend-info">
                    <div className="friend-name">{request.name}</div>
                    <div className="friend-points">
                      <GiThreeLeaves className="icon" />
                      {request.points} points
                    </div>
                    <div className="request-meta">
                      Received {new Date(request.receivedDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="friend-actions">
                    <button
                      className="action-btn accept-btn"
                      onClick={() => handleAcceptRequest(request.id)}
                      title="Accept Request"
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="action-btn deny-btn"
                      onClick={() => handleDenyRequest(request.id)}
                      title="Deny Request"
                    >
                        <FaX />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                No pending friend requests.
              </div>
            )}
          </div>
        </div>
      )}

      {friendsView === 'sent' && (
        <div className="friends-section">
          <h3>
            <FaUserClock className="icon" />
            Sent Requests
          </h3>
          <div className="friends-list">
            {sentRequests.length > 0 ? (
              sentRequests.map((request) => (
                <div key={request.id} className="friend-item">
                  <img src={request.avatarUrl} alt={request.name} className="friend-avatar" />
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
                      onClick={() => handleCancelSentRequest(request.id)}
                      title="Cancel Request"
                    >
                      <FaX />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                No sent friend requests.
              </div>
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
          ) : searchQuery === '' ? (
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
                    onClick={() => handleSendFriendRequest(user.id)}
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
  
  const earnedBadgeIds = new Set(badges.map(b => b.id));
  const earnedBadges = allBadges.filter(badge => earnedBadgeIds.has(badge.id));
  const lockedBadges = allBadges.filter(badge => !earnedBadgeIds.has(badge.id));
  
  const renderOverview = () => (
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
              <div >No interests listed.</div>
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
              <div >No skills listed.</div>
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
              <div >No certifications listed.</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="section">
        <div className="box">
          <div className="box-header">
            <FaFireFlameCurved className="icon" />
            <b>Leaderboard Status</b>
          </div>
          <div className="box-content">
            <div className="rank-label">
              Rank #{leaderboardRank || "N/A"}
            </div>
          </div>
        </div>

        <div className="box org-box">
          <div className="box-header">
            <BiSolidDonateHeart className="icon" />
            <b>Organizations Supported</b>
          </div>
          <div className="box-content">
            {opps.length ? (
              opps.map((name, index) => <div key={index}>{name}</div>)
            ) : (
              <div >No organizations supported yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBadges = () => (
    <div className="badges-container">
      <div className="badges-section">
        <h3>Earned Badges ({earnedBadges.length})</h3>
        <div className="badges-grid">
          {earnedBadges.map((badge) => (
            <div key={badge.id} className="badge earned">
              <div className="badge-icon">
                <img src={badge.imageUrl} alt={badge.name} className="badge-img" />
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
              <div className="badge-icon">
                <img src={badge.imageUrl} alt={badge.name} className="badge-img locked-img" />
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
                src={avatarUrl}
                alt="Profile"
                className="profile-img"
              />
            </div>
            
            {/* Grid-based Bio Layout */}
            <div className="bio">
              <div className="info-label">
                <IoLocationSharp className="icon" />
                <span>Location</span>
              </div>
              <div className="info-value">{location || "Not set"}</div>
              
              <div className="info-label">
                <MdCake className="icon" />
                <span>Age</span>
              </div>
              <div className="info-value">{age || "Unknown"}</div>
              
              <div className="info-label">
                <GiThreeLeaves className="icon" />
                <span>Points</span>
              </div>
              <div className="info-value">{points || 0}</div>
              
              <div className="info-label">
                <IoCalendarSharp className="icon" />
                <span>Joined</span>
              </div>
              <div className="info-value">
                {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
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

        {/* Right Content Area */}
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-nav">
              <button
                className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`nav-tab ${activeTab === 'friends' ? 'active' : ''}`}
                onClick={() => setActiveTab('friends')}
              >
                Friends
              </button>
              <button
                className={`nav-tab ${activeTab === 'badges' ? 'active' : ''}`}
                onClick={() => setActiveTab('badges')}
              >
                Badges
              </button>
            </div>
            <ProgressBar points={points} size="normal" />
          </div>
          
          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'friends' && <FriendsSection user={user} profile={profile} token={token} />}
            {activeTab === 'badges' && renderBadges()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;