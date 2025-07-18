import { useState, useRef, useEffect } from 'react';
import '../OpportunityPage/OpportunityPage.css'
import { SignedIn, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
  import ApplyModal from '../ApplyModal/ApplyModal';

const DraggableCard = ({ opportunity, onSwipeLeft, onSwipeRight, formatDate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [dragDistanceX, setDragDistanceX] = useState(0);
  const [dragDistanceY, setDragDistanceY] = useState(0);
  const cardRef = useRef(null);
  const { user, isSignedIn, openSignIn, isLoaded } = useUser();
  const [opps, setOpps] = useState([]);
  const [savedOpps, setSavedOpps] = useState([]);
  const [prismaUserId, setPrismaUserId] = useState(null);
  const [direct, setDirect] = useState("search") // update for application functionality
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
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

  useEffect(() => {
    if (!isSignedIn) {
      setDirect("login");
    } else {
      setDirect("search");
    }
  }, [isSignedIn]);

  useEffect(() => {
    const fetchPrismaUserId = async () => {
      if (!user) return;
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/users/by-clerk/${
          user.id
        }`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setPrismaUserId(data.id);
        setSavedOpps(data.savedOpportunities.map((opp) => opp.id));
      } catch (error) {
        console.error("Failed to fetch Prisma user ID:", error);
      }
    };
    fetchPrismaUserId();
  }, [user]);
  const handleSavedClick = async (e, oppId) => {
    e.stopPropagation();
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    if (!prismaUserId) {
      console.error("Prisma user ID not available");
      return;
    }
    try {
      const isSaved = savedOpps.includes(oppId);
      const url = `${
        import.meta.env.VITE_API_BASE_URL
      }/users/${prismaUserId}/saved-opportunities/${
        isSaved ? "remove" : "add"
      }`;
      const method = "POST";
      const body = JSON.stringify({ opportunityId: oppId });
      const headers = { "Content-Type": "application/json" };

      const res = await fetch(url, { method, headers, body });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setSavedOpps((prev) => {
          if (isSaved) {
            return prev.filter((id) => id !== oppId);
          } else {
            return [...prev, oppId];
          }
        });
      } else {
        console.error("Failed to update saved opportunities:", data);
      }
    } catch (error) {
      console.error("Error updating saved opportunities:", error);
    }
  };

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
            src={opportunity.imageUrl || "https://picsum.photos/1000/500"}
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
            <div className="skills">
              <h2>Skills</h2>
              <ul className="skills-list">
                {(
                  opportunity?.skills || ["Environment", "Community", "Education"]
                ).map((skill) => (
                  <li key={skill}>
                    {skill
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </li>
                ))}
              </ul>
            </div>
          </div>
      </div>
      <div className="opportunity-info">
        <button className="back-button" onClick={() => window.history.back()}>
          ← Back
        </button>
        <h1>{opportunity?.name || "Sample Opportunity"}</h1>
        <p className="organization">
          By: {opportunity?.organization.name || "Sample Organization"}
        </p>
        <p className="location-date">
          {opportunity?.location || "Sample Location"} |{" "}
          {formatDate ? formatDate(opportunity?.date) : "Jan 1, 2024"}
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
            <button className="btn-primary" onClick={() => handleApplyClick(opportunity)}>I Want to Help</button>
          <button
            className="btn-secondary"
            onClick={(e) => handleSavedClick(e, opportunity.id)}
          >
            {savedOpps.includes(opportunity.id) ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
    <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={handleCloseModal}
        opportunity={opportunity}
    />
    </>
  );
};

export default DraggableCard;