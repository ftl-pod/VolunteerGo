import "./OpportunityGrid.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import ApplyModal from '../ApplyModal/ApplyModal';

function OpportunityGrid({ searchResults }) {
  const { user, isSignedIn, openSignIn } = useUser();

  const [opps, setOpps] = useState([]);
  const [savedOpps, setSavedOpps] = useState([]);
  const [prismaUserId, setPrismaUserId] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

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

  // Fetch Prisma user and saved opps
  useEffect(() => {
    const fetchPrismaUserId = async () => {
      if (!user) return;
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/users/by-clerk/${user.id}`;
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

  // Handle Save/Unsave logic
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
        setSavedOpps((prev) =>
          isSaved ? prev.filter((id) => id !== oppId) : [...prev, oppId]
        );
      } else {
        console.error("Failed to update saved opportunities:", data);
      }
    } catch (error) {
      console.error("Error updating saved opportunities:", error);
    }
  };

  // Fetch opportunities when search term changes
  useEffect(() => {
    const fetchOpps = async () => {
      try {
        const query = new URLSearchParams();
        if (searchResults) query.append("keyword", searchResults);

        const url = `${import.meta.env.VITE_API_BASE_URL}/opportunities?${query.toString()}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setOpps(data);
      } catch (err) {
        console.error("Failed to fetch opportunities:", err);
      }
    };
    fetchOpps();
  }, [searchResults]);

  return (
    <>
      <div className="opportunities-section">
        <div className="opportunity-grid">
          {opps.map((opportunity) => (
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
                >
                  {savedOpps.includes(opportunity.id) ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
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
