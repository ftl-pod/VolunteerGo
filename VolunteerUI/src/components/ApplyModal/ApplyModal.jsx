import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { BiSolidDonateHeart } from 'react-icons/bi';
import './ApplyModal.css';

function ApplyModal({ isOpen, onClose, applicant, opportunity }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
    if (message.trim()) {
      console.log('Submitting application:', {
        applicant,
        opportunityId: opportunity?.id,
        opportunityName: opportunity?.name,
        organization: opportunity?.organization?.name,
        message: message.trim()
      });

      setMessage('');
      onClose();
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
        
        <form onSubmit={onClose} className="modal-form">          
              <h2>{opportunity.name} — {opportunity.organization?.name}</h2>

          <div className="form-group">
            <label>Applicant:</label>
            <input
              placeholder='Enter your name...'
              type="text"
              className="form-input"
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
              type="button" 
              className="btn-primary"
            onClick={onClose}
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
