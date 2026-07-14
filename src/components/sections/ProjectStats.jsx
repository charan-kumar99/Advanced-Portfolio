'use client';

import { motion } from 'framer-motion';
import { Code2, Award, Sparkles, TrendingUp } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { Counter } from '@/components/ui/Counter';
import styles from './ProjectStats.module.css';

// Calculate metrics from portfolio data
const calculateMetrics = () => {
    const totalProjects = portfolioData.projects?.length || 0;
    const completedProjects = portfolioData.projects?.filter(p => p.status === 'completed').length || 0;
    const totalTechStack = portfolioData.techStack?.length || 0;
    const totalTools = portfolioData.tools?.length || 0;

    // Calculate dynamic experience
    const startDate = new Date("2025-09-11");
    const currentDate = new Date();
    const totalMonths = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + (currentDate.getMonth() - startDate.getMonth());
    
    let yearsExpStr = "";
    let isMonths = false;
    if (totalMonths < 12) {
        yearsExpStr = `${Math.max(0, totalMonths)}`;
        isMonths = true;
    } else {
        yearsExpStr = (totalMonths / 12).toFixed(1);
    }

    return {
        projects: 4,
        completed: 4,
        techCount: 20,
        yearsExp: yearsExpStr,
        isMonths: isMonths,
        impactScore: '15+',
        satisfaction: '98%'
    };
};

const StatCard = ({ value, label, icon, delay, gradient, isLowPowerMode }) => {
    return (
        <motion.div
            initial={isLowPowerMode ? { opacity: 0, y: 10 } : { opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: isLowPowerMode ? 0.4 : 0.6, delay: isLowPowerMode ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
            className={styles.cardGroup}
        >
            <motion.div
                className={styles.cardInner}
                whileHover={isLowPowerMode ? {} : { scale: 1.05, y: -8 }}
                transition={{ duration: 0.3 }}
            >
                {/* Card Content */}
                <div className={styles.cardContent}>
                    {/* Value */}
                    <motion.div
                        className={styles.cardValue}
                        animate={isLowPowerMode ? {} : {
                            backgroundPosition: ["0%", "100%", "0%"]
                        }}
                        transition={isLowPowerMode ? {} : {
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            backgroundSize: isLowPowerMode ? "100% 100%" : "200% 200%"
                        }}
                    >
                        <Counter
                            value={parseFloat(value.replace(/[^0-9.]/g, ''))}
                            decimal={value.includes('.') ? 1 : 0}
                        />
                        {value.includes('+') ? '+' : ''}
                        {value.includes('%') ? '%' : ''}
                    </motion.div>

                    {/* Label */}
                    <p className={styles.cardLabel}>
                        {label}
                    </p>
                </div>

                {/* Hover Glow - Subtle */}
                {!isLowPowerMode && (
                    <motion.div
                        className={styles.cardGlow}
                        style={{
                            background: `radial-gradient(circle at center, ${gradient.split(',')[0]}20, transparent 70%)`
                        }}
                    />
                )}
            </motion.div>
        </motion.div>
    );
};

export default function ProjectStats({ isLowPowerMode }) {
    const metrics = calculateMetrics();

    const stats = [
        {
            value: `${metrics.projects}+`,
            label: 'Projects Built',
            icon: <Code2 className="w-6 h-6 text-primary" />,
            gradient: 'rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3)'
        },
        {
            value: `${metrics.yearsExp}+`,
            label: metrics.isMonths ? 'Months Experience' : 'Years Experience',
            icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
            gradient: 'rgba(16, 185, 129, 0.3), rgba(6, 182, 212, 0.3), rgba(16, 185, 129, 0.3)'
        },
        {
            value: `${metrics.techCount}+`,
            label: 'Tech Stack',
            icon: <Code2 className="w-6 h-6 text-violet-500" />,
            gradient: 'rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3), rgba(139, 92, 246, 0.3)'
        },
        {
            value: metrics.impactScore,
            label: 'APIs Integrated',
            icon: <Award className="w-6 h-6 text-amber-500" />,
            gradient: 'rgba(245, 158, 11, 0.3), rgba(251, 146, 60, 0.3), rgba(245, 158, 11, 0.3)'
        }
    ];

    return (
        <section className={styles.section}>

            <div className={styles.container}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className={styles.header}
                >
                    <motion.div
                        className={styles.badge}
                        animate={isLowPowerMode ? {} : { scale: [1, 1.05, 1] }}
                        transition={isLowPowerMode ? {} : { duration: 2, repeat: Infinity }}
                    >
                        <Sparkles className={styles.badgeIcon} />
                        <span className={styles.badgeText}>
                            Project Impact
                        </span>
                    </motion.div>

                    <h2 className={styles.title}>
                        Architecting Reliable Systems
                    </h2>

                    <p className={styles.desc}>
                        Transforming complex business logic into scalable backend APIs and robust infrastructure
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className={styles.grid}>
                    {stats.map((stat, index) => (
                        <StatCard
                            key={stat.label}
                            {...stat}
                            delay={index * 0.1}
                            isLowPowerMode={isLowPowerMode}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
