import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { usePerformance } from '@/hooks/usePerformance';

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
    'C#': 'Type-safe object-oriented enterprise programming.',
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
    'SQL Server': 'Enterprise-grade relational database management.',
    'HTML5': 'Semantic and accessible web structuring.',
};

export const KineticTechGrid = ({ items, className }) => {
    const containerRef = useRef(null);
    const { isLowPowerMode } = usePerformance();

    return (
        <div ref={containerRef} className={className}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
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
            className="group relative rounded-[20px] bg-white dark:bg-card border border-gray-100 dark:border-border/50 flex flex-row items-center gap-4 p-3 transition-all hover:border-gray-200 dark:hover:border-primary/50 hover:shadow-lg dark:hover:bg-muted/55 shadow-sm"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[20px]" />

            <div className="w-[60px] h-[60px] rounded-[14px] flex-shrink-0 flex items-center justify-center bg-gray-50 dark:bg-background relative overflow-hidden transition-all group-hover:bg-white dark:group-hover:bg-background/80 shadow-inner group-hover:shadow-md">
                <div className="w-8 h-8 relative">
                    <Image
                        src={tech.icon}
                        alt={tech.name}
                        fill
                        className="object-contain grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300 unoptimized"
                        unoptimized
                        loading="lazy"
                    />
                </div>
            </div>

            <div className="flex flex-col flex-grow text-left justify-center pr-2 relative z-10 overflow-hidden">
                <span className="text-[13px] sm:text-sm font-bold text-gray-900 dark:text-foreground group-hover:text-primary transition-colors truncate">
                    {tech.name}
                </span>
                <span className="text-[11px] sm:text-xs text-gray-500 dark:text-muted-foreground mt-[2px] leading-snug line-clamp-2">
                    {description}
                </span>
            </div>
        </motion.div>
    );
};
