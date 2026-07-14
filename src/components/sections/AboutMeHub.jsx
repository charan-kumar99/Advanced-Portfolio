"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Cpu, Briefcase, Rocket, Award } from 'lucide-react';
import styles from './AboutMeHub.module.css';

const PreviewCard = ({
    title,
    subtitle,
    description,
    href,
    icon: Icon,
    index
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className={styles.cardGroup}
        >
            <Link href={href} className={styles.previewCardLink}>
                <div className={styles.card}>
                    {/* Background Pattern */}
                    <div className={styles.cardBgPattern}>
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                            backgroundSize: '24px 24px'
                        }} />
                    </div>

                    <div className={styles.cardContent}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}>
                                <Icon className={styles.icon} />
                            </div>
                            <div className={styles.arrowWrapper}>
                                <ArrowUpRight className={styles.arrowIcon} />
                            </div>
                        </div>

                        <div className={styles.textSection}>
                            <span className={styles.subtitle}>
                                {subtitle}
                            </span>
                            <h3 className={styles.title}>
                                {title}
                            </h3>
                        </div>

                        <p className={styles.description}>
                            {description}
                        </p>

                        <div className={styles.footerDividerSection}>
                            <div className={styles.footerDividerRow}>
                                <div className={styles.dividerLine} />
                                <span className={styles.exploreText}>
                                    Explore Section
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default function AboutMeHub() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

    const items = [
        {
            title: "Competency",
            subtitle: "Tech Stack & Soft Skills",
            description: "A comprehensive matrix of my technical arsenal from AI/ML research to enterprise full-stack architectures.",
            href: "/skills",
            icon: Cpu
        },
        {
            title: "Trajectory",
            subtitle: "Professional Journey",
            description: "A detailed timeline of my evolution within CPS Lab, HUMIC Engineering, and high-impact industrial roles.",
            href: "/experience",
            icon: Briefcase
        },
        {
            title: "Production",
            subtitle: "Featured Engineering",
            description: "Deep-dives into my most significant builds across AI systems, Web3 protocols, and enterprise SaaS.",
            href: "/projects",
            icon: Rocket
        },
        {
            title: "Validation",
            subtitle: "Credentials & Honors",
            description: "A curated archive of global certifications, academic honors, and professional industry validation.",
            href: "/achievements",
            icon: Award
        }
    ];

    return (
        <section ref={sectionRef} className={styles.section}>
            {/* Background elements */}
            <div className={styles.bgPattern}>
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                    backgroundSize: '100px 100px'
                }} />
            </div>

            <div className="container-creative relative z-10 px-6 md:px-12 lg:px-24">
                <div className={styles.grid}>
                    {items.map((item, idx) => (
                        <PreviewCard key={item.title} {...item} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}
