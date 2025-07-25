import "./BadgeModal.css";
import { getBadgeById } from "../utils/badgeData";

export default function BadgeModal({ badgeId, onClose }) {
  const badge = getBadgeById(badgeId);

  return (
    <div className="badge-modal-backdrop" onClick={onClose}>
      <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
        <h2>🎉 You earned a badge!</h2>
        <img src={badge.image} alt={badge.name} className="badge-img" />
        <h3>{badge.name}</h3>
        <p>{badge.description}</p>
        <button onClick={onClose} className="btn-primary">Awesome!</button>
      </div>
    </div>
  );
}
