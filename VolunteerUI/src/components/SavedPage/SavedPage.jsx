import './SavedPage.css';
import { useProfile } from '../../contexts/ProfileContext';
import RemoveModal from '../RemoveModal/RemoveModal';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SavedPage() {
  const { profile, setProfile } = useProfile();
  const [showModal, setShowModal] = useState(false);
  const [oppToRemove, setOppToRemove] = useState(null);
  const [removing, setRemoving] = useState(false); // loading state
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const [allSmartSuggestions, setAllSmartSuggestions] = useState([]); // store all the top 15 suggestions for now, might change the value later idk

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

  const handleRemoveSuggestion = (opportunity) => {
    setSmartSuggestions((prev) => {
      const filtered = prev.filter((opp) => opp.id !== opportunity.id);
      // if we have more suggestions in allSmartSuggestions, add next one to keep 3 visible
      if (filtered.length < 3 && allSmartSuggestions.length > filtered.length) {
        const nextSuggestion = allSmartSuggestions.find(
          (opp) => !filtered.some((f) => f.id === opp.id) && opp.id !== opportunity.id
        );
        if (nextSuggestion) {
          return [...filtered, nextSuggestion];
        }
      }
      return filtered;
    });
  };

  const handleRemoveClick = (opportunity) => {
    setOppToRemove(opportunity);
    setShowModal(true);
  };

  useEffect(() => {
    if (!profile) return;

    const fetchRecommendations = async () => {
      try {
        const url = "http://localhost:8000/search";
        const body = {
          search_prompt: "",
          user_profile: {
            skills: profile.skills || [],
            training: profile.training || [],
            interests: profile.interests || [],
            saved_opportunities: profile.savedOpportunities?.map((opp) => opp.id) || [],
          },
        };
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        console.log(data);
        // taking the top 15 recommendations for testing
        const top15 = data.recommendations.slice(0, 15);
        setAllSmartSuggestions(top15);
        // show first 3 suggestions first, idk
        setSmartSuggestions(top15.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [profile]);

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

      <div className="suggested-section">
        <h2>Suggested For You</h2>
        <div className="suggested-grid">
          {smartSuggestions.length === 0 ? (
            <p>You have no suggestions at the moment.</p>
          ) : (
            smartSuggestions.map((opportunity) => (
              <div className="suggested-card" key={opportunity.id}>
                <Link to={`/opportunity/${opportunity.id}`}>
                  <div className="suggested-card-header">
                    <div className="suggested-card-header-left">
                      <h3 className="suggested-card-title">
                        {opportunity.name}
                      </h3>
                      <p className="suggested-card-org">
                        {opportunity.organization?.name}
                      </p>
                    </div>
                  </div>
                  <div className="suggested-card-details">
                    <span>{opportunity.location} | </span>
                    <span>
                      {opportunity?.date
                        ? formatDate
                          ? formatDate(opportunity.date)
                          : opportunity.date
                        : "Flexible schedule"}
                    </span>
                  </div>
                </Link>

                <p
                  className="suggested-card-description"
                  title={opportunity.description}
                >
                  {opportunity.description?.length > 150
                    ? opportunity.description.slice(0, 150) + "..."
                    : opportunity.description}
                </p>

                <div className="tags">
                  {opportunity.tags.map((tag) => (
                    <span key={tag} className="suggested-card-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="suggested-card-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => handleRemoveSuggestion(opportunity)}
                  >
                    Remove
                  </button>
                  <Link to={`/opportunity/${opportunity.id}`}>
                    <button className="btn-primary">I Want to Help</button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
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
                    <span>
                      {opportunity?.date
                        ? formatDate
                          ? formatDate(opportunity.date)
                          : opportunity.date
                        : "Flexible schedule"}
                    </span>
                  </div>
                </Link>

                <p
                  className="saved-card-description"
                  title={opportunity.description}
                >
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
                  <button
                    className="btn-secondary"
                    onClick={() => handleRemoveClick(opportunity)}
                    disabled={removing && oppToRemove?.id === opportunity.id}
                  >
                    {removing && oppToRemove?.id === opportunity.id
                      ? "Removing..."
                      : "Remove"}
                  </button>
                  <Link to={`/opportunity/${opportunity.id}`}>
                    <button className="btn-primary">I Want to Help</button>
                  </Link>
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
