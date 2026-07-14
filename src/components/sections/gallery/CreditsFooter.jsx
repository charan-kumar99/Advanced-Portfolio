"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import styles from "./CreditsFooter.module.css";

export default function CreditsFooter() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const credits = [
        {
            role: "Directed By",
            name: "Charan Kumar"
        },
        {
            role: "Visual Engineering",
            name: "React Three Fiber"
        },
        {
            role: "Motion Systems",
            name: "Framer Motion"
        },
        {
            role: "Styling Architecture",
            name: "CSS Modules"
        },
        {
            role: "Typography",
            name: "Geist & Inter"
        }
    ];

    return (
        <section className={styles.section}>

            {/* The "The End" vibe */}
            <div className={styles.contentWrapper}>

                {credits.map((credit, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                    >
                        <p className={styles.creditRole}>
                            {credit.role}
                        </p>
                        <h3 className={styles.creditName}>
                            {credit.name}
                        </h3>
                    </motion.div>
                ))}

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className={styles.replayWrapper}
                >
                    <p className={styles.copyrightText}>
                        Production © 2024
                    </p>

                    <button
                        onClick={scrollToTop}
                        className={styles.replayBtn}
                    >
                        <div className={styles.replayIconWrapper}>
                            <ArrowUp className={`${styles.replayIcon} animate-bounce`} />
                        </div>
                        <span className={styles.replayText}>Replay Sequence</span>
                    </button>
                </motion.div>

            </div>

            {/* Grain Overlay */}
            <div className={styles.grainOverlay} />

        </section>
    );
}
