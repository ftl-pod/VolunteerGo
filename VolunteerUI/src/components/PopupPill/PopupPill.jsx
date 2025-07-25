import React, { useState, useEffect } from 'react';
import './PopupPill.css';

const PopupPill = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  isVisible, 
  onClose,
  position = 'bottom-center' 
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => onClose && onClose(), 300); // Wait for fade out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  if (!isVisible && !show) return null;

  return (
    <div className={`popup-pill-container ${position}`}>
      <div className={`popup-pill ${type} ${show ? 'show' : 'hide'}`}>
        <span className="popup-pill-icon">{getIcon()}</span>
        <span className="popup-pill-message">{message}</span>
        <button 
          onClick={() => {
            setShow(false);
            setTimeout(() => onClose && onClose(), 300);
          }}
          className="popup-pill-close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PopupPill;