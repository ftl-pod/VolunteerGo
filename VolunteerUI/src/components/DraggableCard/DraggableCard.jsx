import { useState, useRef, useEffect } from 'react';
import '../OpportunityPage/OpportunityPage.css'
import '../DraggableCard/DraggableCard.css'
import { useAuth } from "../../hooks/useAuth";
import { Link } from 'react-router-dom';
import ApplyModal from '../ApplyModal/ApplyModal';
import { useProfile } from "../../contexts/ProfileContext";
import { ArrowLeft } from "lucide-react";
import { getPexelsImage } from "../../utils/getImage";
import PopupPill from '../PopupPill/PopupPill';
import { BsBookmarkFill } from "react-icons/bs";
import { BsBookmark } from "react-icons/bs";

const DraggableCard = ({ opportunity, onSwipeLeft, onSwipeRight, formatDate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [dragDistanceX, setDragDistanceX] = useState(0);
  const [dragDistanceY, setDragDistanceY] = useState(0);
  const cardRef = useRef(null);
  const { user, isSignedIn } = useAuth();
  const [direct, setDirect] = useState("search") // update for application functionality
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const { profile, setProfile } = useProfile();
  const prismaUserId = profile?.id;
  const savedOpps = profile?.savedOpportunities?.map((opp) => opp.id) || [];
  const [savingOppId, setSavingOppId] = useState(null);
  const [loadingSave, setLoadingSave] = useState({});
  const [imageUrl, setImageUrl] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSave, setShowSave] = useState(false);



  const handleApplyClick = () => {
    setIsApplyModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsApplyModalOpen(false);
  };


  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    setStartX(clientX);
    setStartY(clientY);
    setCurrentX(clientX);
    setCurrentY(clientY);
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;
    
    setCurrentX(clientX);
    setCurrentY(clientY);
    const distanceX = clientX - startX;
    const distanceY = clientY - startY;
    setDragDistanceX(distanceX);
    setDragDistanceY(distanceY);
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translate(${distanceX}px, ${distanceY}px)`;
      cardRef.current.style.opacity = Math.max(0.7, 1 - Math.abs(distanceX) / 400);
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const distanceX = currentX - startX;
    const distanceY = currentY - startY;
    const threshold = 150;
    
    if (Math.abs(distanceX) > threshold) {
      // Swipe detected
      if (distanceX > 0) {
        // Swipe right
        if (cardRef.current) {
          cardRef.current.style.transform = 'translateX(100vw)';
          cardRef.current.style.opacity = '0';
        }
        setTimeout(() => onSwipeRight && onSwipeRight(), 300);
      } else {
        // Swipe left
        if (cardRef.current) {
          cardRef.current.style.transform = 'translateX(-100vw)';
          cardRef.current.style.opacity = '0';
        }
        setTimeout(() => onSwipeLeft && onSwipeLeft(), 300);
      }
    } else {
      // Snap back to center
      if (cardRef.current) {
        cardRef.current.style.transform = 'translate(0px, 0px)';
        cardRef.current.style.opacity = '1';
      }
    }
    
    setDragDistanceX(0);
    setDragDistanceY(0);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };


  const handleSavedClick = async (e, oppId) => {
    e.stopPropagation();

    if (!prismaUserId) {
      console.error("Prisma user ID not available");
      return;
    }

    setLoadingSave((prev) => ({ ...prev, [oppId]: true }));

    try {
      const isSaved = savedOpps.includes(oppId);
      const url = `${import.meta.env.VITE_API_BASE_URL}/users/${prismaUserId}/saved-opportunities/${isSaved ? "remove" : "add"}`;
      const method = "POST";
      const body = JSON.stringify({ opportunityId: oppId });
      const headers = { "Content-Type": "application/json" };

      const res = await fetch(url, { method, headers, body });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

    if (data.success) {
      setProfile((prev) => {
        if (!prev) return prev;

        if (isSaved) {
          return {
            ...prev,
            savedOpportunities: prev.savedOpportunities.filter((opp) => opp.id !== oppId),
          };
        } else {
          return {
            ...prev,
            savedOpportunities: [...prev.savedOpportunities, opportunity],
          };
        }
      });
    }
    } catch (error) {
      console.error("Error updating saved opportunities:", error);
    } finally {
      setLoadingSave((prev) => ({ ...prev, [oppId]: false }));
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
        const query = opportunity.name || opportunity.tags?.[0] || "volunteering";
        const fallbackImage = await getPexelsImage(query);
        setImageUrl(fallbackImage);
    };

    fetchImage();
  }, [opportunity]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, startX, startY]);

  return (
    <>
    <div
      ref={cardRef}
      className={`opportunity-page ${isDragging ? "dragging" : ""}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        transition: isDragging
          ? "none"
          : "transform 0.3s ease, opacity 0.3s ease",
          touchAction: "none",
        }}
    >
      <div className ="left-side">
        <div className="opportunity-image">
          <img
            src={imageUrl || "https://picsum.photos/1000/500"}
            alt="Random image"
            draggable={false}
            loading="lazy"
          />
        </div>
          <div className="needed">
            <div className="requirements">
              <h2>Requirements</h2>
              <ul className="requirements-list">
                {(
                  opportunity?.requirements || ["Environment", "Community", "Education"]
                ).map((requirement) => (
                  <li key={requirement}>
                    {requirement
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </li>
                ))}
              </ul>
            </div>
              {opportunity?.skills && opportunity.skills.length > 0 && (
                <div className="skills">
                  <h2>Skills</h2>
                  <ul className="skills-list">
                    {opportunity.skills.map((skill) => (
                      <li key={skill}>
                        {skill
                          .split(" ")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
      </div>
      <div className="opportunity-info">

        <h1>{opportunity?.name || "Sample Opportunity"}</h1>
        <p className="organization">
          By: {opportunity?.organization.name || "Sample Organization"}
        </p>
        <p className="location-date">
          {opportunity?.location || "Sample Location"} |{" "}
          {opportunity?.date ? (formatDate ? formatDate(opportunity.date) : opportunity.date) : "Flexible schedule"}
        </p>

        <div className="tags">
          {(opportunity?.tags || ["Environment", "Community", "Education"]).map(
            (tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            )
          )}
        </div>

        <p className="full-description">
          {opportunity?.description ||
            "This is a sample opportunity description. Help make a difference in your community by participating in this meaningful project."}
        </p>

        <div className="actions">
                  <button className="back-button" onClick={() => window.history.back()}>
            <ArrowLeft size={16} />  Back
        </button>
            <button className="btn-primary" onClick={() => 
              { isSignedIn?  handleApplyClick(opportunity) : setShowLogin(true)
              }}
              >I Want to Help</button>
            <button
              className="save-btn"
              onClick={(e) => 
                {isSignedIn? handleSavedClick(e, opportunity.id) : setShowSave(true)}}
              disabled={!!loadingSave[opportunity.id]}
            >
              {savingOppId === opportunity.id ? (
                <div className="loading-spinner"></div>
                  ) : savedOpps.includes(opportunity.id) ? (
                  <BsBookmarkFill className="save-icon" />
                  ) : (
                  <BsBookmark className="save-icon" />
                )}
            </button>
        </div>
      </div>
    </div>
    <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={handleCloseModal}
        opportunity={opportunity}
    />
    {!isSignedIn ? (
        <PopupPill
          message="Please Login To Apply"
          type="warning"
          duration={3000}
          isVisible={showLogin}
          onClose={() => setShowLogin(false)}
          position="bottom-center"
        />
      ) : null}
      {!isSignedIn? (
        <PopupPill
          message="Please Login To Save"
          type="warning"
          duration={3000}
          isVisible={showSave}
          onClose={() => setShowSave(false)}
          position="bottom-center"
        />
      ) : null}
    </>
  );
};

export default DraggableCard;