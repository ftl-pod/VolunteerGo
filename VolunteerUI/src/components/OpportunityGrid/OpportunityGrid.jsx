import "./OpportunityGrid.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function OpportunityGrid() {
  const [opps, setOpps] = useState([]);
  const [savedOpps, setSavedOpps] = useState(() => {
    try {
      const saved = localStorage.getItem("savedOpportunities");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error(
        "Failed to load saved opportunities from localStorage:",
        error
      );
      return [];
    }
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSavedClick = (e, oppId) => {
    e.stopPropagation();
    setSavedOpps((prev) => {
      const newSavedOpps = prev.includes(oppId)
        ? prev.filter((id) => id !== oppId)
        : [...prev, oppId];

      // Save to localStorage
      try {
        localStorage.setItem(
          "savedOpportunities",
          JSON.stringify(newSavedOpps)
        );
      } catch (error) {
        console.error("Failed to save opportunities to localStorage:", error);
      }

      return newSavedOpps;
    });
  };

  useEffect(() => {
    const fetchOpps = async () => {
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/opportunities`;
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
  }, []);

  // Cleanup function to handle localStorage quota exceeded scenarios
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "savedOpportunities" && e.newValue) {
        try {
          const newSavedOpps = JSON.parse(e.newValue);
          setSavedOpps(newSavedOpps);
        } catch (error) {
          console.error(
            "Failed to parse saved opportunities from storage event:",
            error
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
              <button className="btn-primary">I Want to Help</button>
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
