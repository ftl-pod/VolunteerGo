import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { BiSolidDonateHeart } from 'react-icons/bi';
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../contexts/ProfileContext";
import { useLeaderboard } from "../../contexts/LeaderboardContext";
import badgeService from '../../utils/badgeService';
import BadgeModal from "../BadgeModal/BadgeModal";
import './ApplyModal.css';
import { getLevelData } from "../ProgressBar/ProgressBar";
import PopupPill from '../PopupPill/PopupPill';

function ApplyModal({ isOpen, onClose, applicant, opportunity, setShowApplied, setShowAnimation }) {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);


  const { profile, refreshProfile } = useProfile();
  const { user, token } = useAuth();
  const { refreshLeaderboard } = useLeaderboard();
  const points = profile?.points || 0;

  // Close modal only after all badge modals are done
  useEffect(() => {
    if (hasSubmitted && earnedBadges.length === 0 && !applyLoading) {
      onClose();
      setHasSubmitted(false);
    }
  }, [earnedBadges, applyLoading, hasSubmitted, onClose]);

  const queueBadge = (badge) => {
    if (badge) {
      setEarnedBadges((prev) => [...prev, badge]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApplyLoading(true);
    setHasSubmitted(false);
    setShowApplied(true);
    setShowAnimation(true)


    try {
      const oldPoints = profile?.points || 0;
      const oldLevel = getLevelData(oldPoints).level;

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

      // Badge checks
      await badgeService.checkFirstApplication(user.uid, userOpportunitiesCount, queueBadge);
      if (opportunity.tags?.length) {
        await badgeService.checkCategoryBadge(user.uid, opportunity.tags, queueBadge);
      }
      await badgeService.checkLeaderboardBadge(user.uid, queueBadge);

      // Refresh user data
      await refreshProfile();
      await refreshLeaderboard();

      const newLevel = getLevelData(updatedPoints).level;

      if (newLevel > oldLevel) {
        window.dispatchEvent(new CustomEvent("levelUp"));
      }
      // Confirmation email
      // await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/send-confirmation-email`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     to: user.email,
      //     subject: 'VolunteerGo Application Confirmation!',
      //     text: `Thank you for serving the community and making your mark!
      //     We have sent this over to ${opportunity.organization?.name}, they will reach out to you via the email associated with your account.
      //     Here is a copy of your VolunteerGo application:
      //     ${message}
      //     Thank you from VolunteerGo -- the platform where you do good and level up!`,
      //      html: `
      //     <p>Thank you for serving the community and making your mark!</p>
      //     <p>We have sent this over to <strong>${opportunity.organization?.name}</strong>, they will reach out to you via the email associated with your account.</p>
      //     <p>Here is a copy of your VolunteerGo application:</p>
      //     <p>${message}</p>
      //     <p>Thank you from <strong>VolunteerGo</strong> — the platform where you do good and level up!</p>
      //   `,
      //   }),
      // });

      setHasSubmitted(true); 

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
    setEarnedBadges((prev) => prev.slice(1));
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
          key={earnedBadges[0].id || earnedBadges[0].name}
          badge={earnedBadges[0]}
          onClose={handleBadgeModalClose}
        />
      )}
    </>
  );
}

export default ApplyModal;
