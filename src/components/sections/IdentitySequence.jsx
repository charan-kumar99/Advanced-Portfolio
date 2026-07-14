"use client";

import React, { useRef } from "react";
import { motion, useTransform, easeInOut } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { portfolioData } from "@/data/portfolio";
import { InfiniteMarquee } from "@/components/ui/InfiniteMarquee";
import { BrandScroller, BrandScrollerReverse } from "@/components/ui/brand-scroller";
import { ArrowUpRight } from "lucide-react";
import MagneticEffect from "@/components/ui/MagneticEffect";
import { Meteors } from "@/components/ui/meteors";
import styles from "./IdentitySequence.module.css";

export const IdentitySequence = ({ scrollYProgress, isVisible }) => {
    const t = useTranslations("about");

    const localProgress = useTransform(scrollYProgress, [0.4, 1], [0, 1]);

    // 1. Card Transformation (Entrance & Scaling)
    const cardScale = useTransform(localProgress, [0, 0.4], [0.8, 1], { ease: easeInOut });
    const cardY = useTransform(localProgress, [0, 0.4], ["60vh", "0vh"], { ease: easeInOut });
    const cardBorderRadius = useTransform(localProgress, [0.1, 0.4], ["60px", "0px"], { ease: easeInOut });

    // 2. Internal Content Scroll
    const contentY = useTransform(localProgress, [0.35, 1], ["0vh", "-80vh"], { ease: easeInOut });

    // 3. Elements specific animations
    const phase0Opacity = useTransform(localProgress, [0, 0.15], [1, 0]);
    const cardContentOpacity = useTransform(localProgress, [0.1, 0.3], [0, 1]);
    const textOpacity = useTransform(localProgress, [0.8, 1], [0, 1]);

    // 4. Background Color Transition
    const cardBg = useTransform(
        localProgress,
        [0.8, 1],
        ["#EBEBEB", "#FFFFFF"]
    );
    const cardBgDark = useTransform(
        localProgress,
        [0.8, 1],
        ["#18181b", "#000000"]
    );

    const { resolvedTheme } = useTheme();
    const cardBgValue = resolvedTheme === 'dark' ? cardBgDark : cardBg;

    const marqueeItems = [
        <span key="1" className={styles.marqueeTitle}>
            {portfolioData.personal.title}
        </span>,
        <div key="icon" className={styles.marqueeIconCircle}>
            <svg viewBox="0 0 100 100" className={styles.marqueeIconSvg}>
                <path d="M50 0 C60 30 100 40 100 50 C100 60 60 70 50 100 C40 70 0 60 0 50 C0 40 40 30 50 0" />
            </svg>
        </div>
    ];

    return (
        <div className={styles.container}>
            {/* Phase 0: The Lead-in UI */}
            <motion.div
                style={{ opacity: phase0Opacity }}
                className={styles.phase0}
            >
                {/* Visual Details */}
                <div className={styles.gridOverlay} />
                <div className={styles.centerGlow} />
                <Meteors number={25} angle={45} />

                {/* Center Unified Action */}
                <div className={styles.magneticGroup}>
                    <MagneticEffect>
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => window.scrollBy({ top: window.innerHeight * 1.2, behavior: 'smooth' })}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    window.scrollBy({ top: window.innerHeight * 1.2, behavior: 'smooth' });
                                }
                            }}
                            className={styles.triggerGroup}
                        >
                            <div className={styles.btnTextWrapper}>
                                <div className={styles.btnHoverBg} />
                                <div className={styles.btnTextScroll}>
                                    <div className={styles.btnTextTrack}>
                                        <span className={styles.btnText}>
                                            {t("leadIn.aboutMe")}
                                        </span>
                                        <span className={styles.btnText}>
                                            {t("leadIn.aboutMe")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.btnArrowWrapper}>
                                <div className={styles.btnHoverBg} />
                                <div className={styles.btnTextScroll}>
                                    <div className={styles.btnArrowTrack}>
                                        <ArrowUpRight className={styles.arrowIcon} />
                                        <ArrowUpRight className={styles.arrowIcon} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MagneticEffect>
                </div>

                {/* Unified Bottom Labels Layer */}
                <div className={styles.labelsLayer}>
                    <div className={styles.scrollIndicator}>
                        <motion.span
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className={styles.arrowDown}
                        >
                            ↓
                        </motion.span>
                        <span>{t("leadIn.scroll")}</span>
                    </div>

                    <div className={styles.storyText}>
                        {t("leadIn.shortStory")}
                    </div>
                </div>
            </motion.div>

            {/* The Main Card Container */}
            <motion.div
                style={{
                    scale: cardScale,
                    y: cardY,
                    borderRadius: cardBorderRadius,
                    backgroundColor: cardBgValue,
                    willChange: "transform, background-color",
                }}
                className={styles.card}
            >
                {/* Unified Scrolling Content Wrapper */}
                <motion.div
                    style={{ y: contentY }}
                    className={styles.scrollingWrapper}
                >
                    {/* Phase 1: Marquee Header */}
                    <div className={styles.marqueeHeaderSection}>
                        <motion.div style={{ opacity: cardContentOpacity }} className={styles.marqueeInner}>
                            <InfiniteMarquee
                                items={marqueeItems}
                                speed={18}
                                className="w-full"
                                itemClassName="py-12"
                            />
                        </motion.div>
                    </div>

                    {/* Phase 3: Final Layout Text */}
                    <motion.div
                        style={{ opacity: textOpacity }}
                        className={styles.textSection}
                    >
                        <div className={styles.textGrid}>
                            {/* Header Left */}
                            <div className={styles.titleCol}>
                                <h3
                                    className={styles.title}
                                    dangerouslySetInnerHTML={{ __html: t.raw("profile.title") }}
                                />
                            </div>

                            {/* Paragraph Right */}
                            <div className={styles.descCol}>
                                <p className={styles.desc}>
                                    {t("profile.narrative")} {t("profile.narrative2")}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Phase 4: Tech Stack & Tools Scrollers */}
                    <motion.div
                        style={{ opacity: textOpacity }}
                        className={styles.scrollerSection}
                    >
                        <div className={styles.scrollerHeadingWrapper}>
                            <h4 className={styles.scrollerHeading}>
                                Tech Stack & Ecosystem
                            </h4>
                        </div>
                        <BrandScroller />
                        <BrandScrollerReverse />
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};
