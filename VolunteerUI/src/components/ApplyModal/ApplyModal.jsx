import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { BiSolidDonateHeart } from 'react-icons/bi';
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../contexts/ProfileContext";
import { useLeaderboard } from "../../contexts/LeaderboardContext";
import badgeService from '../../utils/badgeService'; 
import BadgeModal from "../BadgeModal/BadgeModal";  
import './ApplyModal.css';

function ApplyModal({ isOpen, onClose, applicant, opportunity}) {
  const [message, setMessage] = useState('');
  const [name, setName] = useState("")
  const { profile, loading, refreshProfile } = useProfile();
  const { user, token, isLoaded } = useAuth();
  const points = profile?.points || 0;
  const { refreshLeaderboard } = useLeaderboard();
  const [applyLoading, setApplyLoading] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApplyLoading(true);
    try {
      // Update points
      const pointsUrl = `${import.meta.env.VITE_API_BASE_URL}/users/points`;
      const updatedPoints = points + 10;
      const pointsRes = await fetch(pointsUrl, {
        method : "PUT", 
        headers : {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }, 
        body : JSON.stringify({points : updatedPoints})
      });
      if (!pointsRes.ok) throw new Error(`Failed to update points: ${pointsRes.statusText}`);
      
      const userOpportunitiesCount = profile.opportunities?.length || 0; 

      const oppUrl = `${import.meta.env.VITE_API_BASE_URL}/users/${profile.id}/opportunities/add`;
      const oppRes = await fetch(oppUrl, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body : JSON.stringify({ opportunityId: opportunity.id}),
      });
      if (!oppRes.ok) throw new Error(`Failed to update user opportunities: ${oppRes.statusText}`);

      
      await refreshProfile();
      await refreshLeaderboard();


      await badgeService.checkFirstApplication(user.uid, userOpportunitiesCount, (badge) => {
        if (badge) {
          setEarnedBadge(badge);
        }
      });

      // Send confirmation email
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/send-confirmation-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: user.email,
          subject: 'VolunteerGo Application Confirmation!',
          text: `Thank you for serving the community and making your mark! We have sent this over to ${opportunity.organization?.name}, they will reach out to you via the email associated with your account. 
                Here is a copy of your VolunteerGo application: ${message} Thank you from VolunteerGo — the platform where you do good and level up!`,
          html: `
                <p>Thank you for serving the community and making your mark!</p>
                <p>We have sent this over to <strong>${opportunity.organization?.name}</strong>, they will reach out to you via the email associated with your account.</p>
                <p>Here is a copy of your VolunteerGo application:</p>
                <p>${message}</p>
                <br />
                <p>Thank you from VolunteerGo — the platform where you do good and level up!</p>
              `
        }),
      });

    } catch (error) {
      console.error("Error Submitting Application", error)
      alert("Failed to submit application. Please try again.");
    }
    finally {
      setApplyLoading(false);
    }

    window.dispatchEvent(new CustomEvent("showPointsGif"));
    if (message.trim()) {
      console.log('Submitting application:', {
        applicant : profile.name, 
        opportunityId: opportunity?.id,
        opportunityName: opportunity?.name,
        organization: opportunity?.organization?.name,
        message: message.trim(),
        name : name.trim()
      });
      setMessage('');
      setName('');
    }

    if (!earnedBadge) {
      onClose();  
    }
  };

  const handleBadgeModalClose = () => {
    setEarnedBadge(null);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (applyLoading) return; 
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !opportunity) return null;

  return (
    <>
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
              disabled={applyLoading}
            >
              <IoClose />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="modal-form">          
            <h2>{opportunity.name} — {opportunity.organization?.name}</h2>

            <div className="form-group">
              <label>Applicant:</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder='Enter your name...'
                type="text"
                className="form-input"
                required
                disabled={applyLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Why do you want to help?</label>
              <textarea
                id="message"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                placeholder="Tell the organization why you're interested..."
                className="form-textarea"
                rows="4"
                required
                disabled={applyLoading}
              />
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={onClose}
                disabled={applyLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={applyLoading}
              >
                {applyLoading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {earnedBadge && (
        <BadgeModal
          badge={earnedBadge}
          onClose={handleBadgeModalClose}
        />
      )}
    </>
  );
}

export default ApplyModal;
