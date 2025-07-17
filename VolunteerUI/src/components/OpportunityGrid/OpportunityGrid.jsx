import "./OpportunityGrid.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

function OpportunityGrid({ searchResults }) {
  const { user, isSignedIn, openSignIn, isLoaded } = useUser();
    const [direct, setDirect] = useState("search") // will update when we figure out application functionality
  const [opps, setOpps] = useState([]);
  const [savedOpps, setSavedOpps] = useState([]);
  const [prismaUserId, setPrismaUserId] = useState(null);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchPrismaUserId = async () => {
      if (!user) return;
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/users/by-clerk/${
          user.id
        }`;
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
        setSavedOpps((prev) => {
          if (isSaved) {
            return prev.filter((id) => id !== oppId);
          } else {
            return [...prev, oppId];
          }
        });
      } else {
        console.error("Failed to update saved opportunities:", data);
      }
    } catch (error) {
      console.error("Error updating saved opportunities:", error);
    }
  };
    
  useEffect(() => {
    // cant sign up for opp if not logged in
    if (!isSignedIn) {
        setDirect("login")
    }
    const fetchOpps = async () => {
      try {
        const query = new URLSearchParams();
        if (searchResults) query.append("keyword", searchResults);

        const url = `${
          import.meta.env.VITE_API_BASE_URL
        }/opportunities?${query.toString()}`;
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
              <p className="card-description">{opportunity.description}</p>
            </Link>

            <div className="card-tags">
              {opportunity.tags.map((tag) => (
                <span key={tag} className="card-tag">
                  {tag}
                </span>
              ))}
            </div>

            <div className="card-actions">
                                <Link to={`/${direct}`}>
                  <button className="btn-primary">I Want to Help</button>
                                </Link>
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
  );
}

export default OpportunityGrid;
