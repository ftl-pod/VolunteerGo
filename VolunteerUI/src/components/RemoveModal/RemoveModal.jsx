import "./RemoveModal.css";
import { motion } from 'framer-motion';
import { GiRecycle } from "react-icons/gi";

function RemoveModal({ show, closeModal, onConfirm, loading }) {
    if (!show) return null;

    const SpinningIcon = motion(GiRecycle);

    return (
        <>
            <div className="faded-background" onClick={!loading ? closeModal : undefined}></div>
            <div className="modal">
                <SpinningIcon
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    size={90}
                    color="#647c6e"
                />
                <div>
                    <h3>
                        {loading
                            ? "Removing saved opportunity..."
                            : "Are you sure you want to remove this saved opportunity?"}
                    </h3>
                </div>
                <div className="modal-buttons">
                    <button
                        className="btn-primary"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Removing..." : "Confirm"}
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={closeModal}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </>
    );
}

export default RemoveModal;
