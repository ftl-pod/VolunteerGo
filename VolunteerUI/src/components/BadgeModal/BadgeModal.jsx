import React from "react";
import './BadgeModal.css';

export default function BadgeModal({ badge, onClose }) {
  if (!badge) return null;
  console.log("badge!", badge)
  return (
    <div className="modal-backdrop" onClick={onClose}>
    <div className="badge-modal badge-modal-enter" onClick={e => e.stopPropagation()}>
        <img src={badge.imageUrl} alt={badge.name} className="badge-image" />
        <h2>Congrats! You earned a new badge:</h2>
        <h3>{badge.name}</h3>
        <p>{badge.description}</p>
        <button onClick={onClose} className="btn-primary">Close</button>
      </div>
    </div>
  );
}
