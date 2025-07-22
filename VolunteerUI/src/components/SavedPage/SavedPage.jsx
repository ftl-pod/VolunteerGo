import './SavedPage.css';
import { useProfile } from '../../contexts/ProfileContext';
import RemoveModal from '../RemoveModal/RemoveModal';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function SavedPage() {
  const { profile, setProfile } = useProfile();
  const [showModal, setShowModal] = useState(false);
  const [oppToRemove, setOppToRemove] = useState(null);
  const [removing, setRemoving] = useState(false); // loading state

  const savedOpps = profile?.savedOpportunities || [];

  const closeModal = () => {
    if (!removing) {
      setShowModal(false);
      setOppToRemove(null);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleRemoveClick = (opportunity) => {
    setOppToRemove(opportunity);
    setShowModal(true);
  };

  const confirmRemove = async () => {
    if (!oppToRemove || !profile?.id) return;

    setRemoving(true); // begin loading

    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/users/${profile.id}/saved-opportunities/remove`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: oppToRemove.id }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();

      if (data.success) {
        setProfile((prev) => ({
          ...prev,
          savedOpportunities: prev.savedOpportunities.filter(
            (opp) => opp.id !== oppToRemove.id
          ),
        }));
        closeModal();
      } else {
        console.error("Failed to remove saved opportunity:", data);
      }
    } catch (error) {
      console.error("Error removing saved opportunity:", error);
    } finally {
      setRemoving(false); // end loading
    }
  };

  return (
    <div className="saved-section">
      <RemoveModal
        show={showModal}
        closeModal={closeModal}
        onConfirm={confirmRemove}
        loading={removing} // ← pass loading state
      />

      <div className="saved-cards-section">
        <h2>Your Saved Cards</h2>
        <div className="saved-grid">
          {savedOpps.length === 0 ? (
            <p>You have no saved opportunities.</p>
          ) : (
            savedOpps.map((opportunity) => (
              <div className="saved-card" key={opportunity.id}>
                <Link to={`/opportunity/${opportunity.id}`}>
                  <div className="saved-card-header">
                    <div className="saved-card-header-left">
                      <h3 className="saved-card-title">{opportunity.name}</h3>
                      <p className="saved-card-org">
                        {opportunity.organization?.name}
                      </p>
                    </div>
                  </div>
                  <div className="saved-card-details">
                    <span>{opportunity.location} | </span>
                    <span>{formatDate(opportunity.date)}</span>
                  </div>
                </Link>

                <p className="saved-card-description" title={opportunity.description}>
                  {opportunity.description?.length > 150
                    ? opportunity.description.slice(0, 150) + "..."
                    : opportunity.description}
                </p>

                <div className="tags">
                  {opportunity.tags.map((tag) => (
                    <span key={tag} className="saved-card-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="saved-card-actions">
                  <Link to={`/opportunity/${opportunity.id}`}>
                    <button className="btn-primary">I Want to Help</button>
                  </Link>
                  <button
                    className="btn-secondary"
                    onClick={() => handleRemoveClick(opportunity)}
                    disabled={removing && oppToRemove?.id === opportunity.id}
                  >
                    {removing && oppToRemove?.id === opportunity.id
                      ? "Removing..."
                      : "Remove"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SavedPage;
