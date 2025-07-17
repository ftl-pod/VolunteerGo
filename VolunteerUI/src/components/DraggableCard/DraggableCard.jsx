import { useState, useRef, useEffect } from 'react';
import '../OpportunityPage/OpportunityPage.css'
import { SignedIn, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const DraggableCard = ({ opportunity, onSwipeLeft, onSwipeRight, formatDate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [dragDistanceX, setDragDistanceX] = useState(0);
  const [dragDistanceY, setDragDistanceY] = useState(0);
  const cardRef = useRef(null);
  const [direct, setDirect] = useState("search") // update for application functionality
  const {user, isLoaded, isSignedIn} = useUser();


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
    <div 
      ref={cardRef}
      className={`opportunity-page ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
        touchAction: 'none'
      }}
    >
      <div className="opportunity-image">
        <img
          src="https://picsum.photos/1000/500"
          alt="Random image"
          draggable={false}
        />
      </div>
      <div className="opportunity-info">
        <button className="back-button" onClick={() => window.history.back()}>← Back</button>
        <h1>{opportunity?.name || 'Sample Opportunity'}</h1>
        <p className="organization">By: {opportunity?.organization.name || 'Sample Organization'}</p>
        <p className="location-date">
          {opportunity?.location || 'Sample Location'} | {formatDate ? formatDate(opportunity?.date) : 'Jan 1, 2024'}
        </p>

        <div className="tags">
          {(opportunity?.tags || ['Environment', 'Community', 'Education']).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <p className="description">{opportunity?.description || 'This is a sample opportunity description. Help make a difference in your community by participating in this meaningful project.'}</p>

        <div className="actions">
          <Link to={`/${direct}`}>
            <button className="btn-primary">I Want to Help</button>
          </Link>
          <button className="btn-secondary">Save</button>
        </div>
      </div>
      
    </div>
  );
};

export default DraggableCard;