import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { BiSolidDonateHeart } from 'react-icons/bi';
import { auth } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../contexts/ProfileContext";
import { useLeaderboard } from "../../contexts/LeaderboardContext";
import './ApplyModal.css';

function ApplyModal({ isOpen, onClose, applicant, opportunity}) {
  const [message, setMessage] = useState('');
  const { profile, loading, refreshProfile } = useProfile();
  const { user, token, isLoaded } = useAuth();
  const points = profile?.points;
  const prismaUserId = profile?.id || null;
  const { refreshLeaderboard } = useLeaderboard();
 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const pointsUrl = `${import.meta.env.VITE_API_BASE_URL}/users/points`;
      const updatedPoints = points + 10;
      const pointsRes = await fetch(pointsUrl, {
        method : "PUT", 
        headers : {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,}, 
        body : JSON.stringify({points : updatedPoints})
      })
      if (!pointsRes.ok) {
        throw new Error(`Failed to update points: ${pointsRes.statusText}`);
      }
      const oppUrl = `${import.meta.env.VITE_API_BASE_URL}/users/${profile.id}/opportunities/add`;
      const oppRes = await fetch(oppUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body : JSON.stringify({ opportunityId: opportunity.id}),
      })
      if (!oppRes.ok) {
        throw new Error(`Failed to update user opportunities: ${oppRes.statusText}`);
      }
      
      const oppData = await oppRes.json();
      const pointsData = await pointsRes.json();
      await refreshProfile();
      await refreshLeaderboard();
    } catch (error) {
      console.error("Error Submitting Application", error)
    };

    onClose();
    window.dispatchEvent(new CustomEvent("showPointsGif"));
    if (message.trim()) {
      console.log('Submitting application:', {
        applicant : profile.name, // can change to the name the user inputs 
        opportunityId: opportunity?.id,
        opportunityName: opportunity?.name,
        organization: opportunity?.organization?.name,
        message: message.trim()
      });
      setMessage('');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !opportunity) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <BiSolidDonateHeart className="icon" />
            <span>Apply to Opportunity</span>
          </div>
          <button 
            className="close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <IoClose />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">          
              <h2>{opportunity.name} — {opportunity.organization?.name}</h2>

          <div className="form-group">
            <label>Applicant:</label>
            <input
              placeholder='Enter your name...'
              type="text"
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Why do you want to help?</label>
            <textarea
              id="message"
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the organization why you're interested..."
              className="form-textarea"
              rows="4"
              required
            />
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyModal;
