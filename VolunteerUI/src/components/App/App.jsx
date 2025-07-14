import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HomePage from '../HomePage/HomePage'
import SearchPage from '../SearchPage/SearchPage'
import LoginPage from '../LoginPage/LoginPage'
import SignupPage from '../SignupPage/SignupPage'
import ProfilePage from '../ProfilePage/ProfilePage'
import Leaderboard from '../Leaderboard/Leaderboard'
import NavBar from '../NavBar/NavBar'
import OpportunityPage from '../OpportunityPage/OpportunityPage'
import LocationPage from '../LocationPage/LocationPage'
import SavedPage from '../SavedPage/SavedPage'
import './App.css'

function App() {
  const [user, setUser] = useState(null);

  // Ensure the user persists on page reload
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    alert(`Welcome ${user.username}!`);
  };

  return (
    <Router>  
      <div className="App">        
        <NavBar user={user} setUser={setUser}/>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/opportunity/:id" element={<OpportunityPage />} />
          <Route path="/map" element={<LocationPage/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
