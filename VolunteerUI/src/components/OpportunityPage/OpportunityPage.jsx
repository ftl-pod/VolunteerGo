import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DraggableCard from '../DraggableCard/DraggableCard';
import PopupPill from '../PopupPill/PopupPill';
import { useAuth } from "../../hooks/useAuth";

const OpportunityPage = () => {
  const { id } = useParams();
  const [opps, setOpps] = useState([]);
  const {isSignedIn, isLoaded} = useAuth();

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

  const opportunity = opps.find(op => op.id === Number(id));

  if (!opportunity) {
    return <div>Loading opportunity...</div>;
  }

  return (
    <>
    <DraggableCard
      opportunity={opportunity}
      formatDate={(date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    />
    </>
  );
};
export default OpportunityPage;
