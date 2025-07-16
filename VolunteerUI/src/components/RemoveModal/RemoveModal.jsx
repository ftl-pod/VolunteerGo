import "./RemoveModal.css";
import { useEffect } from "react";
import { motion } from 'framer-motion';
import { GiRecycle } from "react-icons/gi";

function RemoveModal({ show, closeModal }) {
    useEffect(() => {
        if (!show) return;

        const timer = setTimeout(() => {
            closeModal();
        }, 2000);

        return () => clearTimeout(timer); 
    }, [show, closeModal]);

    if (!show) {
        return null;
    }
    const SpinningIcon = motion(GiRecycle); //
    return (
        <>
        <div className="faded-background"></div>
        <div className="modal" >
            <SpinningIcon
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                size={90}
                color="#647c6e"
            />
            <div>
                <h3>Updating Your Preferences...</h3>
            </div>
        
        </div>
        </>
    );
}

export default RemoveModal;
