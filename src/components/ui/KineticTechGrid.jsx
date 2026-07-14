import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { usePerformance } from '@/hooks/usePerformance';
import { cn } from '@/lib/utils';
import styles from './KineticTechGrid.module.css';

const techDescriptions = {
    'Python': 'High-performance AI modeling and automation.',
    'TypeScript': 'Type-safe scalable application logic.',
    'JavaScript': 'Dynamic and interactive web development.',
    'Solidity': 'Immutable blockchain smart contracts.',
    'React': 'Interactive component-based user interfaces.',
    'Next.js': 'Production-grade React application framework.',
    'Node.js': 'Scalable asynchronous server-side execution.',
    'TensorFlow': 'Deep learning and neural network architectures.',
    'Scikit-learn': 'Predictive data analysis and machine learning.',
    'Pandas': 'High-performance data manipulation and analysis.',
    'NumPy': 'Fundamental scientific computing capabilities.',
    'Tailwind CSS': 'Rapid utility-first styling and design.',
    'Redis': 'In-memory data structure store and caching.',
    'PostgreSQL': 'Robust relational database architecture.',
    'Kubernetes': 'Automated container deployment and scaling.',
    'Docker': 'Standardized containerized environments.',
    'Terraform': 'Infrastructure as code provisioning.',
    'LangChain': 'Large language model application orchestration.',
    'PyTorch': 'Dynamic neural networks for research and production.',
    'OpenCV': 'Real-time computer vision capabilities.',
    '.NET Core': 'High-performance cross-platform backend framework.',
    'C#': 'Type-safe object-oriented enterprise programming.',
    'SQL Server': 'Enterprise-grade relational database management.',
    'HTML5': 'Semantic and accessible web structuring.',
    'Java': 'Robust, platform-independent enterprise development.',
    'C': 'Low-level performance and systems programming.',
    'CSS3': 'Advanced styling, animations, and responsive layouts.',
    'Dart': 'Client-optimized language for fast UI development.',
    'ASP.NET Core': 'High-performance framework for modern web APIs.',
    'Blazor': 'Full-stack web UI using C# instead of JavaScript.',
    'Flutter': 'Cross-platform native mobile and web development.',
    'Bootstrap 5': 'Responsive, mobile-first frontend component library.',
    'Flask': 'Lightweight WSGI web application framework.',
    'MySQL': 'Reliable, scalable open-source relational database.',
    'Oracle Database': 'Enterprise-grade, secure, and scalable data management.',
    'SQLite': 'Lightweight, embedded relational database engine.',
};

export const KineticTechGrid = ({ items, className }) => {
    const containerRef = useRef(null);
    const { isLowPowerMode } = usePerformance();

    return (
        <div ref={containerRef} className={className}>
            <div className={styles.grid}>
                {items.map((tech, idx) => (
                    <TechCard
                        key={`${tech.name}-${idx}`}
                        tech={tech}
                        idx={idx}
                        isLowPowerMode={isLowPowerMode}
                    />
                ))}
            </div>
        </div>
    );
};

const TechCard = ({ tech, idx, isLowPowerMode }) => {
    const cardRef = useRef(null);

    const description = techDescriptions[tech.name] || `Builds cutting-edge ${tech.name} architectures.`;

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
            whileHover={{ 
                scale: 1.02, 
                zIndex: 10,
                transition: { type: 'spring', stiffness: 400, damping: 30 }
            }}
            className={styles.card}
        >
            <div className={styles.glow} />

            <div className={styles.iconContainer}>
                <div className={styles.iconRelative}>
                    <Image
                        src={tech.icon}
                        alt={tech.name}
                        fill
                        className={styles.img}
                        unoptimized
                        loading="lazy"
                    />
                </div>
            </div>

            <div className={styles.textContainer}>
                <span className={styles.name}>
                    {tech.name}
                </span>
                <span className={styles.desc}>
                    {description}
                </span>
            </div>
        </motion.div>
    );
};
