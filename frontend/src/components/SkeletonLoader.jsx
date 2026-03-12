import { motion } from 'framer-motion';

const SkeletonLoader = () => {
    return (
        <div className="skeleton-container">
            <div className="skeleton-grid">
                <div className="skeleton-card large shimmer"></div>
                <div className="skeleton-card medium shimmer"></div>
                <div className="skeleton-card wide shimmer"></div>
                <div className="skeleton-card small shimmer"></div>
            </div>
        </div>
    );
};

export default SkeletonLoader;
