'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '@/data/portfolio';
import Image from 'next/image';
import { useState } from 'react';
import styles from "./SoftSkills.module.css";

const skillVisuals = {
    'Leadership': 'https://illustrations.popsy.co/white/team-idea.svg',
    'Communication': 'https://illustrations.popsy.co/white/communication.svg',
    'Problem Solving': 'https://illustrations.popsy.co/white/genius.svg',
    'Adaptability': 'https://illustrations.popsy.co/white/creative-work.svg',
    'Critical Thinking': 'https://illustrations.popsy.co/white/idea-launch.svg',
    'Public Speaking': 'https://illustrations.popsy.co/white/presentation.svg',
    'Teamwork': 'https://illustrations.popsy.co/white/shaking-hands.svg',
    'More': 'https://illustrations.popsy.co/white/abstract-art-6.svg',
};

const fallbackIcons = {
    'Critical Thinking': (
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full stroke-foreground/20 stroke-[0.5]" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
            <path d="M12 16V12M12 8H12.01" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    'Teamwork': (
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full stroke-foreground/20 stroke-[0.5]" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="7" r="4" />
            <path d="M17 21V19C17 17.9391 16.5786 17.0217 15.8284 16.2716M23 21V19C23 17.9391 22.5786 17.0217 21.8284 16.2716" />
            <path d="M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" />
        </svg>
    )
};

const EXTRA_SKILLS = [
    'Problem-Solving',
    'Analytical Thinking',
    'Critical Thinking',
    'Communication',
    'Teamwork & Collaboration',
    'Adaptability',
    'Attention to Detail',
    'Leadership'
];

export const SoftSkills = () => {
    const skills = portfolioData.softSkills.slice(0, 7);

    return (
        <section id="soft-skills" className={styles.section}>
            <div className={styles.containerInner}>
                {/* Header */}
                <div className={styles.header}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className={styles.title}
                    >
                        Strategic <br /> Directives
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 0.5 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className={styles.desc}
                    >
                        Interpersonal capabilities engineered for high-impact
                        leadership and systemic problem solving in complex environments.
                    </motion.p>
                </div>

                <div className={styles.grid}>
                    <BentoSkillCard skill={skills[0]} index={1} illustration={skillVisuals['Leadership']} />
                    <BentoSkillCard skill={skills[1]} index={2} illustration={skillVisuals['Critical Thinking']} />
                    <BentoSkillCard skill={skills[2]} index={3} illustration={skillVisuals['Public Speaking']} />

                    <BentoSkillCard
                        skill={skills[6]}
                        index={4}
                        className={styles.bentoCardWide}
                        illustration={skillVisuals['Adaptability']}
                        isWide
                    />

                    {/* Item 05: Problem Solving */}
                    <BentoSkillCard skill={skills[5]} index={5} illustration={skillVisuals['Problem Solving']} />

                    {/* Item 06: Communication */}
                    <BentoSkillCard skill={skills[4]} index={6} illustration={skillVisuals['Communication']} />

                    {/* Item 07: Teamwork */}
                    <BentoSkillCard skill={skills[3]} index={7} illustration={skillVisuals['Teamwork']} />

                    {/* Item 08: More */}
                    <BentoMoreCard index={8} />
                </div>
            </div>

            {/* Subtle background decoration */}
            <div className={styles.glowDecorator} />
        </section>
    );
};

const BentoSkillCard = ({
    skill,
    index,
    className,
    illustration,
    isWide
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={className || (isWide ? styles.bentoCardWide : styles.bentoCardNormal)}
        >
            {/* Top Area */}
            <div className={styles.bentoHeader}>
                <h3 className={styles.bentoTitle}>
                    {skill.name}
                </h3>
                <span className={styles.bentoNum}>#{String(index).padStart(2, '0')}</span>
            </div>

            {/* Illustration Area */}
            <div className={isWide ? styles.bentoIllustrationAreaWide : styles.bentoIllustrationAreaNormal}>
                {illustration ? (
                    <div className={styles.illuInner}>
                        <div className={styles.illuBgGlow} />
                        <Image
                            src={illustration}
                            alt={skill.name}
                            width={320}
                            height={320}
                            className={styles.illuImage}
                        />
                    </div>
                ) : (
                    <div className={styles.illuFallback}>
                        {fallbackIcons[skill.name] || fallbackIcons['Critical Thinking']}
                    </div>
                )}
            </div>

            {/* Bottom */}
            <div className={styles.bentoContent}>
                <div className={styles.bentoContentDivider} />
                <p className={styles.bentoContentDesc}>
                    {skill.description}
                </p>
                <div className={styles.bentoContentFooter}>
                    <span className={styles.bentoContentDot} />
                    <span className={styles.bentoContentLabel}>Core Capability</span>
                </div>
            </div>

            {/* Subtle Gradient Overlay */}
            <div className={styles.cardGradientOverlay} />
        </motion.div>
    );
};

const BentoMoreCard = ({ index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={styles.bentoCardNormal}
        >
            <AnimatePresence mode="wait">
                {!isHovered ? (
                    <motion.div
                        key="normal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="h-full flex flex-col justify-between"
                    >
                        <div className={styles.bentoHeader}>
                            <h3 className={styles.moreCardTitle}>Read More</h3>
                            <span className={styles.bentoNum}>#{String(index).padStart(2, '0')}</span>
                        </div>

                        <div className={styles.bentoIllustrationAreaNormal}>
                            <Image
                                src={skillVisuals['More']}
                                alt="More skills"
                                width={320}
                                height={320}
                                className={styles.illuImage}
                            />
                        </div>

                        <div className={styles.bentoContent}>
                            <p className={styles.bentoContentDesc}>
                                Exploring a broader set of professional capabilities and tactical expertise.
                            </p>
                            <div className={styles.bentoContentFooter}>
                                <span className={styles.moreCardDot} />
                                <span className={styles.moreCardLabel}>Hover to reveal catalog</span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="hover"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col justify-between"
                    >
                        <div className="space-y-4 pt-4">
                            <h4 className={styles.hoverTitle}>Skill Expansion</h4>
                            <div className={styles.hoverGrid}>
                                {EXTRA_SKILLS.map((skill, i) => (
                                    <motion.div
                                        key={skill}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className={styles.hoverItem}
                                    >
                                        <div className={styles.hoverItemDot} />
                                        {skill}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.hoverFooter}>
                            <p className={styles.hoverFooterText}>
                                & systematically expanding the directive framework...
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle Gradient Overlay */}
            <div className={styles.cardGradientOverlay} />
        </motion.div>
    );
};
