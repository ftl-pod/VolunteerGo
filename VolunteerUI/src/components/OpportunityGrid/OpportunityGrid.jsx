import "./OpportunityGrid.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ApplyModal from '../ApplyModal/ApplyModal';
import { BsBookmarkFill } from "react-icons/bs";
import { BsBookmark } from "react-icons/bs";
import { useProfile } from '../../contexts/ProfileContext';
import { useOpportunity } from '../../contexts/OpportunityContext'; 
import PopupPill from '../PopupPill/PopupPill';

function OpportunityGrid({ searchResults, overrideOpportunities = null }) {
  const { user, isSignedIn } = useAuth();
  const { profile, setProfile } = useProfile();
  const { opportunities, loading, fetchOpportunities } = useOpportunity();

  const [savingOppId, setSavingOppId] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const opportunitiesPerPage = 10;
  const [showSuccess, setShowSuccess] = useState(false);
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSave, setShowSave] = useState(false);

  // use profile ID and saved opportunities from context
  const prismaUserId = profile?.id || null;
  const savedOpps = profile?.savedOpportunities?.map((opp) => opp.id) || [];
  const resultsToShow =
    overrideOpportunities && overrideOpportunities.length > 0
      ? overrideOpportunities
      : opportunities;

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

  // fetch opportunities when searchResults change
  useEffect(() => {
    fetchOpportunities(searchResults);
  }, [
    searchResults.keyword,
    searchResults.city,
    searchResults.tag,
    searchResults.format,
    searchResults.skill,
    fetchOpportunities,
  ]);

  // filtering all the opportunities by tag if tag is selectedddd
  // handle Save/Unsave logic - update the profile context becuase we need it to be saved in the profile
  const handleSavedClick = async (e, oppId) => {
    e.stopPropagation();

    if (!prismaUserId) {
      console.error("Profile ID not available");
      return;
    }

    setSavingOppId(oppId); // start savinggg

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
        setProfile((prev) => {
          if (!prev) return prev;

          if (isSaved) {
            setShowUnsaved(true);
            return {
              ...prev,
              savedOpportunities: prev.savedOpportunities.filter(
                (opp) => opp.id !== oppId
              ),
            };
          } else {
            setShowSuccess(true);
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

  // const filteredResults = resultsToShow
  // .filter((opportunity) => {
  //   if (!searchResults.tag) return true;
  //   if (!opportunity.tags) return false;
  //   console.log("Smart Search results:", searchResults.city);
  //   return opportunity.tags.includes(searchResults.tag);
  // });

  const isVirtualAddress = (location) => {
    if (!location) return true;
    const virtualKeywords = ["virtual", "online", "remote", "zoom"];
    return virtualKeywords.some((kw) => location.toLowerCase().includes(kw));
  };


  const filteredResults = resultsToShow.filter((opportunity) => {
    if (
      searchResults.tag &&
      (!opportunity.tags || !opportunity.tags.includes(searchResults.tag))
    ) {
      return false;
    }
    if (
      searchResults.skill &&
      (!opportunity.skills || !opportunity.skills.includes(searchResults.skill))
    ) {
      return false;
    }
    const format = searchResults.format || "";
    if (!format || format === "") return true;

    if (format === "remote") {
      return !opportunity.location || isVirtualAddress(opportunity.location);
    }
    if (format === "in-person") {
      return (
        opportunity.location &&
        opportunity.date &&
        !isVirtualAddress(opportunity.location)
      );
    }
    if (format === "hybrid") {
      return (
        (opportunity.location &&
          !opportunity.date &&
          !isVirtualAddress(opportunity.location)) ||
        (!opportunity.location &&
          opportunity.date &&
          isVirtualAddress(opportunity.location))
      );
    }
    return true;
  });


  const totalPages = Math.ceil(filteredResults.length / opportunitiesPerPage);
  const startIndex = (currentPage - 1) * opportunitiesPerPage;
  const endIndex = startIndex + opportunitiesPerPage;
  const currentOpportunities = filteredResults.slice(startIndex, endIndex);

  return (
    <>
      <div className="opportunities-section">
        {loading ? (
          <div className>Loading opportunities...</div>
        ) : (
          <div className="opportunity-grid">
            {currentOpportunities
              // .filter((opportunity) => {
              //   if (!searchResults.tag) return true;
              //   if (!opportunity.tags) return false;
              //   return opportunity.tags.includes(searchResults.tag);
              // })
              .map((opportunity) => (
                <div key={opportunity.id} className="opportunity-card">
                  <Link to={`/opportunity/${opportunity.id}`}>
                    <div className="card-header">
                      <div className="card-header-left">
                        <h3 className="card-title">{opportunity.name}</h3>
                        <p className="card-org">
                          {opportunity.organization.name}
                        </p>
                      </div>
                    </div>
                    <div className="card-details">
                      <span>{opportunity.location} | </span>
                      <span>
                        {opportunity?.date
                          ? formatDate
                            ? formatDate(opportunity.date)
                            : opportunity.date
                          : "Flexible schedule"}
                      </span>
                    </div>

                    <p
                      className="card-description"
                      title={opportunity.description}
                    >
                      {opportunity.description &&
                      opportunity.description.length > 150
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
                    {profile?.opportunities?.some(
                      (opp) => opp.id === opportunity.id
                    ) ? (
                      <button className="btn-primary"> Applied </button>
                    ) : (
                      <button
                        className="btn-primary"
                        onClick={() => {
                          handleApplyClick(opportunity), setShowLogin(true);
                        }}
                      >
                        I Want to Help{" "}
                      </button>
                    )}
                    <button
                      className={`save-btn ${
                        savingOppId === opportunity.id ? "loading" : ""
                      }`}
                      onClick={(e) => {
                        handleSavedClick(e, opportunity.id), setShowSave(true);
                      }}
                      disabled={savingOppId === opportunity.id}
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
              ))}
          </div>
        )}
      </div>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {isSignedIn ? (
        <ApplyModal
          isOpen={isApplyModalOpen}
          onClose={handleCloseModal}
          applicant={user?.firstName || user?.fullName || "Anonymous"}
          opportunity={selectedOpportunity}
        />
      ) : null}

      {/* Saved popup */}
      <PopupPill
        message="Volunteer opportunity saved!"
        type="success"
        duration={3000}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        position="bottom-center"
      />

      {/* Unsaved popup */}
      <PopupPill
        message="Volunteer opportunity unsaved"
        type="success"
        duration={3000}
        isVisible={showUnsaved}
        onClose={() => setShowUnsaved(false)}
        position="bottom-center"
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
      {!isSignedIn ? (
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
}

export default OpportunityGrid;
