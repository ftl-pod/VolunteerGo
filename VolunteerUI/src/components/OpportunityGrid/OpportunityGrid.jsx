import "./OpportunityGrid.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ApplyModal from '../ApplyModal/ApplyModal';
import { BsBookmarkFill } from "react-icons/bs";
import { BsBookmark } from "react-icons/bs";
import { useProfile } from '../../contexts/ProfileContext';
import { useOpportunity } from '../../contexts/OpportunityContext'; // Import OpportunityContext

function OpportunityGrid({ searchResults }) {
  const { user } = useAuth();
  const { profile, setProfile } = useProfile();
  const { opportunities, loading, fetchOpportunities } = useOpportunity(); // Use OpportunityContext

  const [savingOppId, setSavingOppId] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // Use profile ID and saved opportunities from context
  const prismaUserId = profile?.id || null;
  const savedOpps = profile?.savedOpportunities?.map((opp) => opp.id) || [];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleApplyClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsApplyModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsApplyModalOpen(false);
  };

  // Fetch opportunities when searchResults change
useEffect(() => {
  fetchOpportunities(searchResults);
}, [searchResults.keyword, searchResults.city, fetchOpportunities]);

  // Handle Save/Unsave logic - update profile context
  const handleSavedClick = async (e, oppId) => {
    e.stopPropagation();

    if (!prismaUserId) {
      console.error("Profile ID not available");
      return;
    }

    setSavingOppId(oppId); // start saving

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
            const oppToAdd = opportunities.find((opp) => opp.id === oppId);
            if (!oppToAdd) return prev;

            return {
              ...prev,
              savedOpportunities: [...prev.savedOpportunities, oppToAdd],
            };
          }
        });
      } else {
        console.error("Failed to update saved opportunities:", data);
      }
    } catch (error) {
      console.error("Error updating saved opportunities:", error);
    } finally {
      setSavingOppId(null); // done saving
    }
  };

  return (
    <>
      <div className="opportunities-section">
        {loading ? (
          <div className="loading-spinner">Loading opportunities...</div>
        ) : (
          <div className="opportunity-grid">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="opportunity-card">
                <Link to={`/opportunity/${opportunity.id}`}>
                  <div className="card-header">
                    <div className="card-header-left">
                      <h3 className="card-title">{opportunity.name}</h3>
                      <p className="card-org">{opportunity.organization.name}</p>
                    </div>
                  </div>
                  <div className="card-details">
                    <span>{opportunity.location} | </span>
                    <span>{formatDate(opportunity.date)}</span>
                  </div>
                  <p className="card-description" title={opportunity.description}>
                    {opportunity.description && opportunity.description.length > 150
                      ? opportunity.description.slice(0, 150) + "..."
                      : opportunity.description}
                  </p>
                </Link>

                <div className="card-tags">
                  {opportunity.tags.map((tag) => (
                    <span key={tag} className="card-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="card-actions">
                  <button
                    className="btn-primary"
                    onClick={() => handleApplyClick(opportunity)}
                  >
                    I Want to Help
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={(e) => handleSavedClick(e, opportunity.id)}
                    disabled={savingOppId === opportunity.id}
                  >
                    {savingOppId === opportunity.id
                      ? savedOpps.includes(opportunity.id)
                        ? <BsBookmark className="save-icon"/>
                        : <BsBookmarkFill className="save-icon"/>
                      : savedOpps.includes(opportunity.id)
                      ? <BsBookmarkFill className="save-icon"/>
                      : "Save"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={handleCloseModal}
        applicant={user?.firstName || user?.fullName || 'Anonymous'}
        opportunity={selectedOpportunity}
      />
    </>
  );
}

export default OpportunityGrid;
