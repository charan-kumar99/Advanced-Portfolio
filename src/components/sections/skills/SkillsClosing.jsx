"use client";

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';
import { usePerformance } from '@/hooks/usePerformance';
import styles from "./SkillsClosing.module.css";

export const SkillsClosing = () => {
    const containerRef = useRef(null);
    const { isLowPowerMode } = usePerformance();

    const phases = [
        {
            time: "Stage 01",
            title: "Concept Audit",
            desc: "Analyzing project requirements, feasibility check, and establishing core technical objectives."
        },
        {
            time: "Stage 02",
            title: "Strategic Blueprint",
            desc: "Architecting the system design, choosing the stack, and finalizing the development roadmap."
        },
        {
            time: "Stage 03",
            title: "Launch & Scale",
            desc: "Full-scale development, rigorous testing, and initial deployment of the production system."
        }
    ];

    return (
        <section
            ref={containerRef}
            className={styles.section}
        >
            {/* SECTION FRAME */}
            <div className={styles.frameTop}>
                <div className={styles.frameInner} />
            </div>

            {/* BACKGROUND: Wireframe Landscape */}
            <div className={styles.wireframeLand} />

            {/* KINETIC TYPOGRAPHY */}
            <div className={styles.marqueeTop}>
                <motion.div
                    animate={isLowPowerMode ? {} : { x: ["0%", "-50%"] }}
                    transition={isLowPowerMode ? {} : { duration: 40, repeat: Infinity, ease: "linear" }}
                    className={styles.marqueeTrack}
                >
                    <span>System Architecture</span>
                    <span>System Architecture</span>
                </motion.div>
            </div>

            <div className={styles.marqueeBottom}>
                <motion.div
                    animate={isLowPowerMode ? {} : { x: ["-50%", "0%"] }}
                    transition={isLowPowerMode ? {} : { duration: 45, repeat: Infinity, ease: "linear" }}
                    className={styles.marqueeTrack}
                >
                    <span>Creative Engineering</span>
                    <span>Creative Engineering</span>
                </motion.div>
            </div>

            {/* CENTER CONTENT */}
            <div className={styles.grid}>

                {/* LEFT: Statement & Action */}
                <div className={styles.leftCol}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.leftColText}
                    >
                        <h2 className={styles.title}>
                            <span className={styles.titleLarge}>DRIVE</span>
                            <span className={styles.titleSub}>INNOVATION</span>
                        </h2>

                        <p className={styles.desc}>
                            Precision engineering meets <span className={styles.descHighlight}>unbound imagination</span>.
                            Let's transform ambitious ideas into production-ready solutions and construct a legacy of innovation.
                        </p>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <Link
                            href="/projects"
                            className={styles.ctaLink}
                        >
                            <span>More Projects</span>
                            <MoveRight className={styles.ctaLinkIcon} />
                        </Link>
                    </motion.div>
                </div>

                {/* RIGHT: Vertical Timeline */}
                <div className={styles.rightCol}>
                    {phases.map((phase, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 + idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className={styles.phaseCard}
                        >
                            {/* Connection Node */}
                            <div className={styles.phaseNode} />

                            {/* Glide Pill Marker */}
                            <div className={styles.phasePillMarker}>
                                <span className={styles.phaseTime}>
                                    {phase.time}
                                </span>
                            </div>

                            <div className={styles.phaseContent}>
                                <h4 className={styles.phaseTitle}>
                                    {phase.title}
                                </h4>
                                <p className={styles.phaseDesc}>
                                    {phase.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}

                    {/* Background Progress Line Glow */}
                    <div className={styles.timelineGlowLine} />
                </div>
            </div>

            {/* Background Glows */}
            <div className={styles.glowLeft} />
            <div className={styles.glowRight} />
        </section>
    );
};
