"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import styles from "./ManifestoHero.module.css";

export default function ManifestoHero({ isLowPowerMode }) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const yTransform = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const y = isLowPowerMode ? 0 : yTransform;
    const opacity = isLowPowerMode ? 1 : opacityTransform;

    return (
        <section ref={containerRef} className={styles.section}>
            <div className={styles.stickyWrapper}>

                {/* Background Noise/Grain */}
                {!isLowPowerMode && (
                    <div className={styles.noiseOverlay} />
                )}

                <motion.div style={{ y, opacity }} className={styles.contentInner}>

                    {/* The Narrative (Kinetic Typography) */}
                    <div className={styles.narrativeGrid}>
                        <div className={styles.overflowWrapper}>
                            <motion.h1
                                initial={isLowPowerMode ? { opacity: 0 } : { y: 100, opacity: 0 }}
                                animate={isLowPowerMode ? { opacity: 1 } : { y: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className={styles.title}
                            >
                                <span className={styles.titleLightText}>The</span> Code
                            </motion.h1>
                        </div>

                        <div className={styles.metaRow}>
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                                className={styles.dividerLine}
                            />
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.8 }}
                                className={styles.metaText}
                            >
                                Is merely a vessel for
                            </motion.p>
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                                className={styles.dividerLine}
                            />
                        </div>

                        <div className={styles.overflowWrapper}>
                            <motion.h1
                                initial={isLowPowerMode ? { opacity: 0 } : { y: -100, opacity: 0 }}
                                animate={isLowPowerMode ? { opacity: 1 } : { y: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: isLowPowerMode ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className={styles.title}
                            >
                                Human <span className={styles.titleAccent}>Emotion.</span>
                            </motion.h1>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.2 }}
                        className={styles.descWrapper}
                    >
                        <p className={styles.desc}>
                            "We build systems not just to process data, but to feel something.
                            This archive is a collection of moments where logic met beauty."
                        </p>
                    </motion.div>

                </motion.div>

                {/* Scroll Prompt */}
                <motion.div
                    style={{ opacity }}
                    className={styles.scrollPrompt}
                >
                    <span className={styles.scrollPromptLabel}>See More</span>
                    <ArrowDown className={`${styles.scrollIcon} animate-bounce`} />
                </motion.div>

            </div>

        </section>
    );
}
