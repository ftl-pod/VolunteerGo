import "./RemoveModal.css";
import { motion } from 'framer-motion';
import { GiRecycle } from "react-icons/gi";

function RemoveModal({ show, closeModal, onConfirm }) {
    if (!show) {
        return null;
    }
    const SpinningIcon = motion(GiRecycle);
    return (
        <>
            <div className="faded-background" onClick={closeModal}></div>
            <div className="modal">
                <SpinningIcon
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    size={90}
                    color="#647c6e"
                />
                <div>
                    <h3>Are you sure you want to remove this saved opportunity?</h3>
                </div>
                <div className="modal-buttons">
                    <button className="btn-primary" onClick={() => { onConfirm(); }}>Confirm</button>
                    <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                </div>
            </div>
        </>
    );
}

export default RemoveModal;
