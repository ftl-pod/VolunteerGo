import './SavedPage.css'
import RemoveModal from '../RemoveModal/RemoveModal';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { useAuth } from "../../hooks/useAuth";

function SavedPage() {
    const { user } = useUser();
    const [showModal, setShowModal] = useState(false);
    const [savedOpps, setSavedOpps] = useState([]);
    const [oppToRemove, setOppToRemove] = useState(null);
    const [prismaUserId, setPrismaUserId] = useState(null);

    const closeModal = () => {
        setShowModal(false);
        setOppToRemove(null);
    };

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
                const url = `${import.meta.env.VITE_API_BASE_URL}/users/by-clerk/${user.id}`;
                const res = await fetch(url);

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();
                setPrismaUserId(data.id);
                setSavedOpps(data.savedOpportunities);
            } catch (err) {
                console.error("Failed to fetch Prisma user ID:", err);
            }
        };

        fetchPrismaUserId();
    }, [user]);

    const handleRemoveClick = (opportunity) => {
        setOppToRemove(opportunity);
        setShowModal(true);
    };

    const confirmRemove = async () => {
        if (!oppToRemove || !prismaUserId) return;

        try {
            const url = `${import.meta.env.VITE_API_BASE_URL}/users/${prismaUserId}/saved-opportunities/remove`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ opportunityId: oppToRemove.id }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();

            if (data.success) {
                setSavedOpps((prev) => prev.filter((opp) => opp.id !== oppToRemove.id));
                closeModal();
            } else {
                console.error("Failed to remove saved opportunity:", data);
            }
        } catch (error) {
            console.error("Error removing saved opportunity:", error);
        }
    };

    return (
      <div className="saved-section">
        <div>
          <RemoveModal
            show={showModal}
            closeModal={closeModal}
            onConfirm={confirmRemove}
          />
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
                      <span> {opportunity.location} | </span>
                      <span> {formatDate(opportunity.date)}</span>
                    </div>
                  </Link>

                  <p
                    className="saved-card-description"
                    title={opportunity.description}
                  >
                    {opportunity.description &&
                    opportunity.description.length > 150
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
                    >
                      Remove
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
