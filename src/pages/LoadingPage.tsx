import { motion } from 'framer-motion';
import '../animations/animations.css'; // Assuming your CSS for animations is here

export default function LoadingPage() {
    return (
            <motion.div 
                className="d-flex align-items-center justify-content-center"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 1 }}
                exit={{ opacity: 0 }} 
            >
                <h1 className="text-white p-3">
                    LOGgains
                </h1>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </motion.div>
    );
}
