import { useState, useEffect } from 'react'
import { ProfileProvider } from "../../contexts/ProfileContext";
import { LeaderboardProvider } from "../../contexts/LeaderboardContext";
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
import Onboarding from '../Onboarding/Onboarding'
import { OpportunityProvider } from '../../contexts/OpportunityContext';

import { useAuth } from "../../hooks/useAuth";
import './App.css'

function App() {
  const { user, loading } = useAuth();

  return (
    <OpportunityProvider>
      <ProfileProvider>
        <LeaderboardProvider>
          <Router>  
            <div className="App">        
              <NavBar user={user}/>
              {/* Routes */}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage/>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/profile" element={<ProfilePage user={user} />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/saved" element={<SavedPage />} />
                <Route path="/opportunity/:id" element={<OpportunityPage />} />
                <Route path="/map" element={<LocationPage/>} />
                <Route path="/onboarding" element={<Onboarding/>} />
              </Routes>
            </div>
          </Router>
        </LeaderboardProvider>
      </ProfileProvider>
    </OpportunityProvider>
  )
}

export default App
