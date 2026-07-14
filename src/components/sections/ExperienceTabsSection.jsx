'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, Rocket, ChevronDown, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { portfolioData } from '@/data/portfolio';
import styles from './ExperienceTabsSection.module.css';

function TabButton({ label, isActive, onClick, icon }) {
    return (
        <motion.button
            onClick={onClick}
            className={isActive ? styles.tabButtonActive : styles.tabButtonInactive}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {icon}
            <span>{label}</span>
            {isActive && (
                <motion.div
                    layoutId="activeTab"
                    className={styles.activeIndicator}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </motion.button>
    );
}

function EducationContent() {
    const [showTimeline, setShowTimeline] = useState(false);
    const education = portfolioData.education[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <div className={styles.eduGrid}>
                <div className={styles.eduLeft}>
                    <div className={styles.eduIndicatorRow}>
                        <div className={styles.eduBar} />
                        <div>
                            <p className={styles.eduLabel}>
                                — Higher Education • {education.isOngoing ? 'Current' : 'Completed'}
                            </p>
                        </div>
                    </div>

                    <h2 className={styles.eduHeading}>
                        {education.institution.split(' ').map((word, i) => (
                            <span key={i} className={styles.eduHeadingWord}>{word.toUpperCase()}</span>
                        ))}
                    </h2>

                    <p className={styles.eduDesc}>
                        {education.major} major with a GPA of {education.gpa}. Focused on AI Engineering and Systems Research. Active in multiple high-impact research laboratories and national competitions.
                    </p>
                </div>

                <motion.div
                    className={styles.eduCard}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className={styles.eduCardIndex}>
                        01<br />10
                    </div>

                    <div className={styles.eduCardInner}>
                        <div className={styles.eduCardIconWrapper}>
                            <GraduationCap className="w-12 h-12 text-primary" />
                        </div>

                        <div className={styles.eduCardTags}>
                            <span className={styles.eduCardTagPrimary}>
                                GPA {education.gpa}
                            </span>
                            <span className={styles.eduCardTagSec}>
                                AI Researcher
                            </span>
                            <span className={styles.eduCardTagSec}>
                                IT Major
                            </span>
                        </div>

                        <p className={styles.eduCardLabel}>
                            Digital Innovation Hub
                        </p>
                    </div>
                </motion.div>
            </div>

            <button
                onClick={() => setShowTimeline(!showTimeline)}
                className={styles.timelineToggleBtn}
            >
                <span className={styles.timelineToggleLabel}>Timeline</span>
                <motion.div
                    animate={{ rotate: showTimeline ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="w-4 h-4 text-primary" />
                </motion.div>
            </button>

            <AnimatePresence>
                {showTimeline && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="overflow-hidden"
                    >
                        <div className={styles.timelineList}>
                            {portfolioData.education.map((edu, index) => (
                                <motion.div
                                    key={edu.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={styles.timelineItem}
                                >
                                    <div className={styles.timelineIconWrapper}>
                                        <GraduationCap className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className={styles.timelineBody}>
                                        <h4 className={styles.timelineTitle}>{edu.institution}</h4>
                                        <p className={styles.timelineDegree}>{edu.degree} - {edu.major}</p>
                                        <p className={styles.timelineDate}>
                                            {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                                        </p>
                                    </div>
                                    {edu.gpa && (
                                        <span className={styles.timelineGpa}>{edu.gpa}</span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function JourneyContent() {
    const experiences = portfolioData.experiences;

    const groupedExperiences = useMemo(() => {
        const groups = {};

        experiences.forEach((exp) => {
            const year = new Date(exp.startDate).getFullYear().toString();
            if (!groups[year]) {
                groups[year] = [];
            }
            groups[year].push(exp);
        });

        return Object.keys(groups)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map(year => ({
                year,
                experiences: groups[year].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
            }));
    }, [experiences]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <div className={styles.journeyIntro}>
                <h2 className={styles.journeyHeading}>
                    Changelog from my journey
                </h2>
                <p className={styles.journeyDesc}>
                    I've been working on various projects and roles. Here's a timeline of my professional journey.
                </p>
            </div>

            <div className={styles.journeyList}>
                {groupedExperiences.map((group, groupIndex) => (
                    <motion.div
                        key={group.year}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupIndex * 0.1 }}
                        className={styles.journeyItem}
                    >
                        <div className={styles.journeyRow}>
                            <div className={styles.journeyYearCol}>
                                <div className={styles.journeyDot} />
                                <span className={styles.journeyYear}>
                                    {group.year}
                                </span>
                            </div>

                            <div className={styles.journeyContent}>
                                {group.experiences.slice(0, 3).map((exp, expIndex) => (
                                    <motion.div
                                        key={exp.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: groupIndex * 0.1 + expIndex * 0.05 }}
                                        className={styles.journeyExpCard}
                                    >
                                        <div className={styles.journeyExpDot} />

                                        <div className={styles.journeyExpHeader}>
                                            <div>
                                                <h3 className={styles.journeyExpTitle}>
                                                    {exp.position}
                                                </h3>
                                                <p className={styles.journeyExpCompany}>
                                                    {exp.company}
                                                </p>
                                            </div>
                                            <span className={styles.journeyExpDate}>
                                                {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                                            </span>
                                        </div>

                                        <p className={styles.journeyExpDesc}>
                                            {exp.description}
                                        </p>

                                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                                            <ul className={styles.journeyExpResponsibilities}>
                                                {exp.responsibilities.slice(0, 3).map((resp, i) => (
                                                    <li key={i} className={styles.journeyExpRespItem}>
                                                        <ChevronRight className={styles.journeyExpRespBullet} />
                                                        <span>{resp}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        <div className={styles.journeyExpSkills}>
                                            {exp.skills.slice(0, 4).map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className={styles.journeyExpSkill}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

function ExperienceContent() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={styles.soonContainer}
        >
            <div className={styles.soonIconWrapper}>
                <Rocket className="w-12 h-12 text-primary" />
            </div>
            <h3 className={styles.soonTitle}>Coming Soon</h3>
            <p className={styles.soonDesc}>
                Detailed experience breakdown with project highlights and achievements will be available here soon.
            </p>
        </motion.div>
    );
}

export default function ExperienceTabsSection() {
    const [activeTab, setActiveTab] = useState('journey');

    const tabs = [
        { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
        { id: 'journey', label: 'Journey', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'experience', label: 'Experience', icon: <Rocket className="w-4 h-4" /> },
    ];

    return (
        <div className={styles.wrapper}>
            <motion.div
                className={styles.introCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.introIconContainer}>
                    {activeTab === 'education' && <GraduationCap className="w-8 h-8 text-primary" />}
                    {activeTab === 'journey' && <Briefcase className="w-8 h-8 text-primary" />}
                    {activeTab === 'experience' && <Rocket className="w-8 h-8 text-primary" />}
                </div>
                <h3 className={styles.introTitle}>
                    {activeTab === 'education' && 'Academic Foundation'}
                    {activeTab === 'journey' && 'Professional Journey'}
                    {activeTab === 'experience' && 'Work Experience'}
                </h3>
                <p className={styles.introSubtitle}>
                    {activeTab === 'education' && 'Building strong foundations through academic excellence'}
                    {activeTab === 'journey' && 'A timeline of roles, responsibilities, and growth'}
                    {activeTab === 'experience' && 'Detailed breakdown of professional experiences'}
                </p>
            </motion.div>

            <div className={styles.tabList}>
                {tabs.map((tab) => (
                    <TabButton
                        key={tab.id}
                        label={tab.label}
                        isActive={activeTab === tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        icon={tab.icon}
                    />
                ))}
            </div>

            <div className={styles.tabContentContainer}>
                <AnimatePresence mode="wait">
                    {activeTab === 'education' && <EducationContent key="education" />}
                    {activeTab === 'journey' && <JourneyContent key="journey" />}
                    {activeTab === 'experience' && <ExperienceContent key="experience" />}
                </AnimatePresence>
            </div>
        </div>
    );
}
