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

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>  
      <div className="App">        
        {/* Navigation Links */}


        {/* {<nav>
          <Link to="/">HomePage</Link> |{' '}
          <Link to="/search">SearchPage</Link> |{' '}
          <Link to="/login">LoginPage</Link> |{' '}
          <Link to="/signup">SignupPage</Link> |{' '}
          <Link to="/profile">ProfilePage</Link> |{' '}
          <Link to="/leaderboard">Leaderboard</Link>
        </nav>} */}


        <NavBar/>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
