import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import opportunities from '../../data/opportunities';
import './OpportunityPage.css';

function OpportunityPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentId = Number(id);
  const currentIndex = opportunities.findIndex(op => op.id === currentId);
  const opportunity = opportunities[currentIndex];

  const dragStartX = useRef(null);
  const isDragging = useRef(false);

  // Track drag offset for visual translateX
  const [dragOffset, setDragOffset] = useState(0);

  const minDragDistance = 100;

  const onTouchStart = (e) => {
    dragStartX.current = e.touches[0].clientX;
    setDragOffset(0);
  };

  const onTouchMove = (e) => {
    if (dragStartX.current === null) return;
    const currentX = e.touches[0].clientX;
    setDragOffset(currentX - dragStartX.current);
  };

  const onTouchEnd = (e) => {
    if (dragStartX.current === null) return;
    const dragDistance = e.changedTouches[0].clientX - dragStartX.current;
    handleSwipe(dragDistance);
    dragStartX.current = null;
    setDragOffset(0);
  };

  const onMouseDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    setDragOffset(0);
  };

  const onMouseMove = (e) => {
    if (!isDragging.current || dragStartX.current === null) return;
    const currentX = e.clientX;
    setDragOffset(currentX - dragStartX.current);
  };

  const onMouseUp = (e) => {
    if (!isDragging.current || dragStartX.current === null) return;
    isDragging.current = false;
    const dragDistance = e.clientX - dragStartX.current;
    dragStartX.current = null;
    setDragOffset(0);
    handleSwipe(dragDistance);
  };

  const handleSwipe = (distance) => {
    if (Math.abs(distance) < minDragDistance) return;

    if (distance < 0) {
      // dragged/swiped left → next
      goToNext();
    } else {
      // dragged/swiped right → previous
      goToPrevious();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevId = opportunities[currentIndex - 1].id;
      navigate(`/opportunity/${prevId}`);
    }
  };

  const goToNext = () => {
    if (currentIndex < opportunities.length - 1) {
      const nextId = opportunities[currentIndex + 1].id;
      navigate(`/opportunity/${nextId}`);
    }
  };

  if (!opportunity) {
    return (
      <div className="opportunity-page">
        <h2>Opportunity Not Found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className="opportunity-page"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={{
        userSelect: 'none',
        cursor: isDragging.current ? 'grabbing' : 'grab',
        transform: `translateX(${dragOffset}px)`,
        transition: isDragging.current ? 'none' : 'transform 0.3s ease',
      }}
    >
      <div className="opportunity-image">
        <img src="https://picsum.photos/600/1200" alt="Random" />
      </div>
      <div className="opportunity-info">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>{opportunity.title}</h1>
        <p className="organization">By: {opportunity.organization}</p>
        <p className="location-date">
          {opportunity.location} | {formatDate(opportunity.date)}
        </p>

        <div className="tags">
          {opportunity.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <p className="description">{opportunity.description}</p>

        <div className="actions">
          <button className="btn-primary">I Want to Help</button>
          <button className="btn-secondary">Save</button>
        </div>
      </div>
    </div>
  );
}

export default OpportunityPage;
