import './OpportunityGrid.css'
import { Link } from 'react-router-dom';
import {useEffect, useState} from 'react';
function OpportunityGrid() {
    const [opps, setOpps] = useState([]);
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
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

    return (
        <div className="opportunities-section">
            <div className="opportunity-grid">
                {opps.map(opportunity => (
                    <Link to={`/opportunity/${opportunity.id}`}>
                        <div key={opportunity.id} className="opportunity-card">
                            <div className="card-header">
                                <div className="card-header-left">
                                    <h3 className="card-title">{opportunity.name}</h3>
                                    <p className="card-org">{opportunity.organization.name}</p>
                                </div>
                            </div>
                            <div className="card-details">
                                <span> {opportunity.location} | </span>
                                <span> {formatDate(opportunity.date)}</span>
                            </div>

                            <p className="card-description">{opportunity.description}</p>
                            
                            
                            <div className="card-tags">
                                {opportunity.tags.map(tag => (
                                    <span key={tag} className="card-tag">{tag}</span>
                                ))}
                            </div>
                            
                            <div className="card-actions">
                                <button className="btn-primary">I Want to Help</button>
                                <button className="btn-secondary">Save</button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default OpportunityGrid
