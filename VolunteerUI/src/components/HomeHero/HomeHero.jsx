import React, { useState, useEffect } from 'react';
import './HomeHero.css';
import { useNavigate } from 'react-router-dom';

export default function HomeHero() {
  const [sparkles, setSparkles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

  // Create sparkles on mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      if (Math.random() > 0.92) {
        const newSparkle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 6 + 3,
          color: Math.random() > 0.5 ? '#7ea68a' : '#a8916b'
        };
        
        setSparkles(prev => [...prev.slice(-10), newSparkle]);
        
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
        }, 2000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCTAClick = (e) => {
    e.preventDefault();
        navigate('/signup');
  };

  return (
    <div className="volunteer-hero">


      {/* Background Pattern */}
      <div className="hero-background-pattern"></div>

      {/* Floating Leaves */}
      <div className="floating-leaf leaf-1"></div>
      <div className="floating-leaf leaf-2"></div>
      <div className="floating-leaf leaf-3"></div>
      <div className="floating-leaf leaf-4"></div>
      <div className="floating-leaf leaf-5"></div>
      <div className="floating-leaf leaf-6"></div>

      
      {/* Squiggly Lines */}
      <svg className="squiggly-line line-1" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,50 C80,0 160,100 240,50 S400,0 480,50 S640,100 720,50 S880,0 960,50 S1120,100 1200,50 S1360,0 1440,50" 
              fill="none" stroke="rgba(241,239,238,0.4)" strokeWidth="3"/>
      </svg>
      <svg className="squiggly-line line-2" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,30 C120,80 200,10 320,60 S500,90 600,40 S780,10 880,70 S1040,90 1140,30 S1320,10 1440,60" 
              fill="none" stroke="rgba(209,200,193,0.3)" strokeWidth="2"/>
      </svg>
      <svg className="squiggly-line line-3" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,70 C100,20 180,90 280,40 S420,10 520,80 S700,90 800,30 S920,10 1020,70 S1200,90 1300,40 L1440,60" 
              fill="none" stroke="rgba(246,244,243,0.2)" strokeWidth="4"/>
      </svg>
      
      {/* Swirly Decorations */}
      <div className="swirl-decoration swirl-1">
        <svg viewBox="0 0 100 100">
          <path d="M20,50 Q50,20 80,50 Q50,80 20,50" fill="none" stroke="rgba(209,200,193,0.4)" strokeWidth="2"/>
        </svg>
      </div>
      <div className="swirl-decoration swirl-2">
        <svg viewBox="0 0 100 100">
          <path d="M10,30 Q30,10 50,30 Q70,50 50,70 Q30,50 10,30" fill="none" stroke="rgba(241,239,238,0.3)" strokeWidth="3"/>
        </svg>
      </div>
      <div className="swirl-decoration swirl-3">
        <svg viewBox="0 0 100 100">
          <path d="M25,25 Q75,25 75,75 Q25,75 25,25" fill="none" stroke="rgba(246,244,243,0.2)" strokeWidth="2"/>
        </svg>
      </div>

      {/* Mouse Sparkles
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="mouse-sparkle"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            background: sparkle.color,
            boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`
          }}
        />
      ))} */}

      {/* Main Content */}
      <div className="hero-content">
        <h1 className="hero-title">Volunteer Go</h1>
        <p className="hero-subtitle">Do good, level up</p>
        <button 
          href="#" 
          className="hero-cta"
          onClick={handleCTAClick}
        >
          Start Your Journey
        </button>
      </div>

      <div className="hero-badges-text">
        Earn badges, unlock achievements, make a difference
      </div>
    </div>
  );
}