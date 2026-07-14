"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { GraduationCap, BookOpen, Star, Binary, Sparkles } from "lucide-react";
import styles from "./ExperienceStickyScroll.module.css";

export default function ExperienceStickyScroll({ isLowPowerMode = false }) {
    const journeyContent = [
        {
            label: "Higher Education • Current",
            title: "MIT, Jaipur",
            description: "Master of Computer Applications (MCA). Focused on advanced software engineering, system architecture, and modern application development.",
            content: (
                <div className={styles.journeyCard}>
                    <div className={styles.overlayBlue} />
                    <div className={styles.journeyContentInner}>
                        <div className={styles.iconContainer}>
                            <GraduationCap className={`${styles.journeyIcon} ${!isLowPowerMode ? styles.animatePulse : ''}`} />
                            <Binary className={`${styles.binaryIcon} ${!isLowPowerMode ? styles.animateBounce : ''}`} />
                        </div>
                        <div className={styles.tagContainer}>
                            {["MCA", "Software Engineering", "2025-Ongoing"].map(s => (
                                <span key={s} className={styles.tag}>
                                    {s}
                                </span>
                            ))}
                        </div>
                        <p className={styles.subLabel}>Advanced Engineering</p>
                    </div>
                </div>
            ),
        },
        {
            label: "Foundation • Undergraduate",
            title: "Mangalore University",
            description: "Bachelor of Computer Applications (BCA). Developed strong analytical foundations in software development and database management.",
            content: (
                <div className={styles.journeyCard}>
                    <div className={styles.overlayOrange} />
                    <div className={styles.journeyContentInner}>
                        <div className={styles.iconContainer}>
                            <BookOpen className={`${styles.journeyIcon} ${styles.hoverRotate}`} />
                            <Sparkles className={`${styles.sparklesIcon} ${!isLowPowerMode ? styles.animatePulseCustom : ''}`} />
                        </div>
                        <div className={styles.tagContainer}>
                            {["BCA", "Mangalore", "2022-2025"].map(s => (
                                <span key={s} className={styles.tag}>
                                    {s}
                                </span>
                            ))}
                        </div>
                        <p className={styles.subLabel}>Logical Foundation</p>
                    </div>
                </div>
            ),
        }
    ];

    return (
        <div className={styles.wrapper}>
            <StickyScroll content={journeyContent} isLowPowerMode={isLowPowerMode} />
        </div>
    );
}
