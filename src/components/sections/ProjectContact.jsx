'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { InteractiveRobotSpline } from '@/components/ui/interactive-3d-robot';
import styles from './ProjectContact.module.css';

export const ProjectContact = ({ isLowPowerMode }) => {
    const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

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
                <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden flex items-center justify-center [mask-image:radial-gradient(circle_at_center,black_40%,transparent_75%)] md:[mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]">
                    <div className="absolute inset-0 scale-[1.15] md:scale-110">
                        <InteractiveRobotSpline
                            scene={ROBOT_SCENE_URL}
                            className="w-full h-full"
                        />
                    </div>
                </div>
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
