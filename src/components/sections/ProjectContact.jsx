'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SiGithub, SiInstagram } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa6';
import { Mail, ArrowUpRight } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import styles from './ProjectContact.module.css';

// --- MAIN WRAPPER COMPONENT ---
export const ProjectContact = ({ isLowPowerMode }) => {
    return (
        <section className={styles.section}>

            {/* Ambient Background Glow */}
            {!isLowPowerMode && (
                <div className={styles.ambientGlow} />
            )}

            <div className={styles.cardContainer}>
                <BlockInTextCard
                    tag="/ Let's Connect"
                    isLowPowerMode={isLowPowerMode}
                    text={
                        <>
                            <strong>Ready to build something robust?</strong> whether it's enterprise APIs, microservices, or scalable backends. I'm always open to discussing new engineering challenges.
                        </>
                    }
                    examples={[
                        "Looking for a Backend Developer?",
                        "Need a software solution for your business?",
                        "Just want to say hi?",
                    ]}
                />
            </div>

            <div className={styles.cardContainer}>
                <LogoRolodex
                    isLowPowerMode={isLowPowerMode}
                    items={[
                        // GitHub - White/Black
                        <LogoItem key={1} className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
                            <SiGithub />
                        </LogoItem>,
                        // LinkedIn - Blue
                        <LogoItem key={2} className="bg-blue-600 text-white">
                            <FaLinkedin />
                        </LogoItem>,
                        // Instagram - Gradient-ish (Pink/Orange)
                        <LogoItem key={4} className="bg-gradient-to-br from-purple-500 to-orange-500 text-white">
                            <SiInstagram />
                        </LogoItem>
                    ]}
                />
            </div>
        </section>
    );
};

// --- LEFT TEXT CARD COMPONENT ---
const BlockInTextCard = ({
    tag,
    text,
    examples,
    isLowPowerMode,
}) => {
    return (
        <div className={styles.cardWrapper}>
            <div>
                <p className={styles.tag}>{tag}</p>
            </div>

            <div className={styles.title}>
                {text}
            </div>

            <div className={styles.formSection}>
                <Typewrite examples={examples} isLowPowerMode={isLowPowerMode} />

                <div className={styles.emailLinkRow}>
                    <a
                        href={`mailto:${portfolioData.personal.email}`}
                        className={styles.emailLink}
                    >
                        <span className={styles.emailLabel}>
                            Send Message
                        </span>
                        <div className={styles.arrowWrapper}>
                            <ArrowUpRight className={styles.arrowIcon} />
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

// --- TYPEWRITER COMPONENT ---
const LETTER_DELAY = 0.025;
const BOX_FADE_DURATION = 0.125;
const FADE_DELAY = 5;
const MAIN_FADE_DURATION = 0.25;
const SWAP_DELAY_IN_MS = 5500;

const Typewrite = ({ examples, isLowPowerMode }) => {
    const [exampleIndex, setExampleIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setExampleIndex((pv) => (pv + 1) % examples.length);
        }, SWAP_DELAY_IN_MS);

        return () => clearInterval(intervalId);
    }, [examples]);

    return (
        <div className={styles.typewriteRow}>
            <span className={isLowPowerMode ? styles.pulseDot : styles.pulseDotAnimated} />
            <div className={styles.typewriteBody}>
                <p className={styles.topicLabel}>
                    DISCUSSION TOPIC:
                </p>
                <div className={styles.topicContent}>
                    {isLowPowerMode ? examples[exampleIndex] : examples[exampleIndex].split("").map((l, i) => (
                        <motion.span
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{
                                delay: FADE_DELAY,
                                duration: MAIN_FADE_DURATION,
                                ease: "easeInOut",
                            }}
                            key={`${exampleIndex}-${i}`}
                            className="relative"
                        >
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * LETTER_DELAY, duration: 0 }}
                            >
                                {l}
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{
                                    delay: i * LETTER_DELAY,
                                    times: [0, 0.1, 1],
                                    duration: BOX_FADE_DURATION,
                                    ease: "easeInOut",
                                }}
                                className={styles.swapCursor}
                            />
                        </motion.span>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- ORIGAMI LOGO ROLODEX ---
const DELAY_IN_MS = 2500;
const TRANSITION_DURATION_IN_SECS = 1.5;

const LogoRolodex = ({ items, isLowPowerMode }) => {
    const intervalRef = useRef(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setIndex((pv) => pv + 1);
        }, isLowPowerMode ? DELAY_IN_MS * 1.5 : DELAY_IN_MS);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isLowPowerMode]);

    return (
        <div
            style={{
                transformStyle: "preserve-3d",
            }}
            className={styles.rolodexWrapper}
        >
            <AnimatePresence mode="sync">
                <motion.div
                    style={{
                        y: "-50%",
                        x: "-50%",
                        clipPath: isLowPowerMode ? "none" : "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
                        zIndex: -index,
                        backfaceVisibility: "hidden",
                    }}
                    key={index}
                    transition={{
                        duration: isLowPowerMode ? 0.5 : TRANSITION_DURATION_IN_SECS,
                        ease: "easeInOut",
                    }}
                    initial={isLowPowerMode ? { opacity: 0 } : { rotateX: "0deg" }}
                    animate={isLowPowerMode ? { opacity: 1 } : { rotateX: "0deg" }}
                    exit={isLowPowerMode ? { opacity: 0 } : { rotateX: "-180deg" }}
                    className="absolute left-1/2 top-1/2"
                >
                    {items[index % items.length]}
                </motion.div>
                {!isLowPowerMode && (
                    <motion.div
                        style={{
                            y: "-50%",
                            x: "-50%",
                            clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                            zIndex: index,
                            backfaceVisibility: "hidden",
                        }}
                        key={(index + 1) * 2}
                        initial={{ rotateX: "180deg" }}
                        animate={{ rotateX: "0deg" }}
                        exit={{ rotateX: "0deg" }}
                        transition={{
                            duration: TRANSITION_DURATION_IN_SECS,
                            ease: "easeInOut",
                        }}
                        className="absolute left-1/2 top-1/2"
                    >
                        {items[index % items.length]}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const LogoItem = ({
    children,
    className,
}) => {
    return (
        <div
            className={`${styles.logoItem} ${className || ''}`}
        >
            {children}
        </div>
    );
};
