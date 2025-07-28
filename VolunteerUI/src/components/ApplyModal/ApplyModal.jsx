import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { BiSolidDonateHeart } from 'react-icons/bi';
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../contexts/ProfileContext";
import { useLeaderboard } from "../../contexts/LeaderboardContext";
import badgeService from '../../utils/badgeService';
import BadgeModal from "../BadgeModal/BadgeModal";
import './ApplyModal.css';

function ApplyModal({ isOpen, onClose, applicant, opportunity }) {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([]);

  const { profile, refreshProfile } = useProfile();
  const { user, token } = useAuth();
  const { refreshLeaderboard } = useLeaderboard();
  const points = profile?.points || 0;

  const queueBadge = (badge) => {
    if (badge) {
      setEarnedBadges((prev) => [...prev, badge]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApplyLoading(true);

    try {
      // Update points
      const pointsUrl = `${import.meta.env.VITE_API_BASE_URL}/users/points`;
      const updatedPoints = points + 10;
      const pointsRes = await fetch(pointsUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ points: updatedPoints }),
      });
      if (!pointsRes.ok) throw new Error("Failed to update points");

      // Update user opportunities
      const userOpportunitiesCount = profile.opportunities?.length || 0;
      const oppUrl = `${import.meta.env.VITE_API_BASE_URL}/users/${profile.id}/opportunities/add`;
      const oppRes = await fetch(oppUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ opportunityId: opportunity.id }),
      });
      if (!oppRes.ok) throw new Error("Failed to update opportunities");

      // Refresh user data
      await refreshProfile();
      await refreshLeaderboard();

      // Badge checks
      await badgeService.checkFirstApplication(user.uid, userOpportunitiesCount, queueBadge);
      if (opportunity.tags?.length) {
        await badgeService.checkCategoryBadge(user.uid, opportunity.tags, queueBadge);
      }
      await badgeService.checkLeaderboardBadge(user.uid, queueBadge);

      // Confirmation email
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/send-confirmation-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: user.email,
          subject: 'VolunteerGo Application Confirmation!',
          text: `Thank you for serving the community and making your mark! We have sent this over to ${opportunity.organization?.name}. Here's a copy of your message: ${message}`,
          html: `
            <p>Thank you for serving the community and making your mark!</p>
            <p>We have sent this over to <strong>${opportunity.organization?.name}</strong>.</p>
            <p>Your message:</p>
            <p>${message}</p>
          `,
        }),
      });

    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setApplyLoading(false);
    }

    window.dispatchEvent(new CustomEvent("showPointsGif"));
    if (message.trim()) {
      console.log("Application submitted:", {
        applicant: profile.name,
        opportunityId: opportunity.id,
        opportunityName: opportunity.name,
        organization: opportunity.organization?.name,
        message,
        name,
      });
      setMessage('');
      setName('');
    }

  };

const handleBadgeModalClose = () => {
  setEarnedBadges((prev) => {
    const [, ...remaining] = prev;
    if (remaining.length === 0) {
      onClose();
    }
    return remaining;
  });
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
            <button className="close-btn" onClick={onClose} disabled={applyLoading}>
              <IoClose />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <h2>{opportunity.name} — {opportunity.organization?.name}</h2>

            <div className="form-group">
              <label>Applicant:</label>
              <input
                type="text"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={applyLoading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Why do you want to help?</label>
              <textarea
                id="message"
                rows="4"
                placeholder="Tell the organization why you're interested..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={applyLoading}
                className="form-textarea"
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={applyLoading}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={applyLoading}>
                {applyLoading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {earnedBadges.length > 0 && (
        <BadgeModal
          badge={earnedBadges[0]}
          onClose={handleBadgeModalClose}
        />
      )}
    </>
  );
}

export default ApplyModal;
