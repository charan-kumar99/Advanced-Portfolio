"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { NavigationShortcuts } from "@/components/sections/NavigationShortcuts";
import styles from "./ExpertiseSection.module.css";

export default function ExpertiseSection() {
    const sectionRef = useRef(null);

    return (
        <section ref={sectionRef} className={styles.section}>
            {/* Grid Pattern with organic fade */}
            <div className={styles.gridPatternLight} />
            <div className={styles.gridPatternDark} />

            <div className={styles.gridContainer}>
                <motion.div
                    initial={{ opacity: 1, scale: 1 }}
                    className={styles.shortcutsWrapper}
                >
                    <NavigationShortcuts />
                </motion.div>
            </div>
        </section>
    );
}
