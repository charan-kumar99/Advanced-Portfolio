import React, { useRef, useState, useEffect, useCallback } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame,
} from "framer-motion";
import Image from "next/image";
import { portfolioData } from "@/data/portfolio";
import { usePerformance } from "@/hooks/usePerformance";
import styles from "./ExperienceMarquee.module.css";

function ParallaxText({ children, baseVelocity = 100, isLowPowerMode = false }) {
    const baseX = useMotionValue(0);
    const contentRef = useRef(null);
    const [contentWidth, setContentWidth] = useState(0);

    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400,
    });

    const velocityFactor = useTransform(smoothVelocity, (latest) => {
        return (Math.abs(latest) / 1000) * 5;
    });

    const measure = useCallback(() => {
        if (contentRef.current) {
            setContentWidth(contentRef.current.scrollWidth);
        }
    }, []);

    useEffect(() => {
        measure();
        window.addEventListener("resize", measure);
        const t1 = setTimeout(measure, 300);
        const t2 = setTimeout(measure, 1000);
        return () => {
            window.removeEventListener("resize", measure);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [measure]);

    const x = useTransform(baseX, (v) => {
        if (contentWidth <= 0) return "0px";
        const mod = ((v % contentWidth) + contentWidth) % contentWidth;

        if (baseVelocity > 0) {
            return `${-contentWidth + mod}px`;
        } else {
            return `${-mod}px`;
        }
    });

    const isHovered = useRef(false);

    useAnimationFrame((_t, delta) => {
        if (isHovered.current || isLowPowerMode) return;

        const clampedDelta = Math.min(delta, 50);
        let moveBy = Math.abs(baseVelocity) * (clampedDelta / 1000);

        const vf = velocityFactor.get();
        if (vf > 0) {
            moveBy += moveBy * vf;
        }

        baseX.set(baseX.get() + moveBy);
    });

    if (isLowPowerMode) {
        return (
            <div className={styles.parallaxTextContainer}>
                <div
                    className={
                        baseVelocity > 0
                            ? styles.animateMarqueeReverse
                            : styles.animateMarquee
                    }
                >
                    <div className={styles.contentBlock}>{children}</div>
                    <div className={styles.contentBlock}>{children}</div>
                    <div className={styles.contentBlock}>{children}</div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={styles.parallaxTextContainer}
            onMouseEnter={() => (isHovered.current = true)}
            onMouseLeave={() => (isHovered.current = false)}
        >
            <motion.div
                className={styles.parallaxTextInner}
                style={{ x, willChange: "transform" }}
            >
                <div ref={contentRef} className={styles.contentBlock}>
                    {children}
                </div>
                <div className={styles.contentBlock}>{children}</div>
                <div className={styles.contentBlock}>{children}</div>
            </motion.div>
        </div>
    );
}

const GalleryItem = ({ item }) => {
    return (
        <div className={styles.galleryItem}>
            <div className={styles.iconWrapper}>
                <Image
                    src={item.icon}
                    alt={item.name}
                    fill
                    sizes="64px"
                    priority
                    unoptimized
                    className={styles.icon}
                />
            </div>
            <span className={styles.label}>
                {item.name}
            </span>
        </div>
    );
};

export default function ExperienceMarquee() {
    const { isLowPowerMode } = usePerformance();
    const row1 = portfolioData.techStack;
    const row2 = portfolioData.tools;

    const ensureLength = (items) => {
        if (!items || items.length === 0) return [];
        let repeated = [...items];
        while (repeated.length < 12) {
            repeated = [...repeated, ...items];
        }
        return repeated;
    };

    return (
        <section className={styles.section}>
            <div className={styles.fogTop} />
            <div className={styles.fogBottom} />

            <div className={styles.rowContainer}>
                <ParallaxText baseVelocity={40} isLowPowerMode={isLowPowerMode}>
                    {ensureLength(row1).map((item, idx) => (
                        <GalleryItem key={`r1-${idx}`} item={item} />
                    ))}
                </ParallaxText>

                <ParallaxText baseVelocity={-40} isLowPowerMode={isLowPowerMode}>
                    {ensureLength(row2).map((item, idx) => (
                        <GalleryItem key={`r2-${idx}`} item={item} />
                    ))}
                </ParallaxText>
            </div>
        </section>
    );
}
