import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

import HomePage from '../HomePage/HomePage'
import SearchPage from '../SearchPage/SearchPage'
import LoginPage from '../LoginPage/LoginPage'
import SignupPage from '../SignupPage/SignupPage'
import ProfilePage from '../ProfilePage/ProfilePage'
import Leaderboard from '../Leaderboard/Leaderboard'
import NavBar from '../NavBar/NavBar'
import OpportunityPage from '../OpportunityPage/OpportunityPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>  
      <div className="App">        
        <NavBar/>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/opportunity/:id" element={<OpportunityPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
