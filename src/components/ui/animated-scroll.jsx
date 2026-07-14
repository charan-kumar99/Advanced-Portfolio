'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring, useMotionValue } from 'framer-motion';
import { cn } from "@/lib/utils";
import { ChevronDown } from 'lucide-react';
import styles from './animated-scroll.module.css';
import Loader from './Loader';

const pages = [
    {
        leftBgImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop',
        rightBgImage: null,
        leftContent: null,
        rightContent: {
            heading: 'Enterprise Solutions',
            description: 'Specializing in architecting robust enterprise systems and comprehensive full-stack applications. From designing scalable SQL schemas to engineering modern, interactive frontends using ASP.NET Core and React.',
            skills: ["C# & .NET 8", "Full-Stack Dev", "Clean Architecture", "React & Blazor", "Entity Framework", "SQL Server"],
            hoverColor: "bg-blue-600/10"
        },
    },
    {
        leftBgImage: null,
        rightBgImage: null,
        rightComponent: <Loader type="software" />,
        leftContent: {
            heading: 'Scalable Architecture',
            description: 'Building the foundation for resilient digital ecosystems. I engineer scalable backends with a focus on microservices, global API design, and seamless deployments utilizing Docker and Azure DevOps.',
            skills: ["Microservices", "REST APIs", "Docker", "Azure DevOps", "PostgreSQL", "System Architecture"],
            hoverColor: "bg-emerald-600/10"
        },
        rightContent: null,
    },
    {
        leftBgImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2000&auto=format&fit=crop',
        rightBgImage: null,
        leftContent: null,
        rightContent: {
            heading: 'Technical Leadership',
            description: 'Translating complex technical requirements into actionable, impactful business solutions through systemic problem-solving, strategic leadership, and rigorous requirement specifications.',
            skills: ["Systemic Thinking", "Problem Solving", "SDLC", "Team Leadership", "Communication", "Requirement Specs"],
            hoverColor: "bg-purple-600/10"
        },
    },
    {
        isBridge: true,
        heading: 'Discover my latest work and creative solutions that bring ideas to life',
        subheading: 'SCROLL TO EXPLORE',
    }
];

export default function ScrollAdventure() {
    const [currentPage, setCurrentPage] = useState(1);
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 30,
        damping: 30,
        mass: 1,
        restDelta: 0.001
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const totalPages = pages.length;
        const step = 1 / totalPages;
        const index = Math.min(Math.floor(latest / step) + 1, totalPages);
        if (currentPage !== index) setCurrentPage(index);
    });
    const { scrollYProgress: enterProgressRaw } = useScroll({
        target: containerRef,
        offset: ["start end", "start start"]
    });
    
    const enterProgress = useSpring(enterProgressRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const enterScale = useTransform(enterProgress, [0, 1], [0.85, 1]);
    const enterOpacity = useTransform(enterProgress, [0, 1], [0, 1]);
    const enterBorderRadius = useTransform(enterProgress, [0, 1], ["40px", "0px"]);

    return (
        <div ref={containerRef} className={styles.container}>
            <motion.div 
                style={{ scale: enterScale, opacity: enterOpacity, borderRadius: enterBorderRadius }}
                className={styles.stickyWrapper}
            >
                {pages.map((page, i) => {
                    if ('isBridge' in page) {
                        return (
                            <BridgeSlide
                                key={i}
                                page={page}
                                isActive={currentPage === i + 1}
                                scrollProgress={smoothProgress}
                                index={i}
                            />
                        );
                    }
                    return (
                        <PageSlide
                            key={i}
                            page={page}
                            isActive={currentPage === i + 1}
                            scrollProgress={smoothProgress}
                            index={i}
                        />
                    );
                })}
            </motion.div>
        </div>
    );
}

function PageSlide({ page, isActive, scrollProgress, index }) {
    const leftHasVisual = !!page.leftBgImage || !!page.leftComponent;
    const rightHasVisual = !!page.rightBgImage || !!page.rightComponent;

    const totalPages = pages.length;
    const step = 1 / totalPages;
    const base = index * step;

    let enterStart = index === 0 ? -0.1 : base - step / 4;
    let enterEnd = index === 0 ? -0.05 : base + step / 4;
    let exitStart = base + step * 0.75;
    let exitEnd = base + step * 1.25;

    if (index === 0) {
        exitStart = 0.125;
        exitEnd = 0.3125;
    } else if (index === 1) {
        enterStart = 0.125;
        enterEnd = 0.3125;
    }

    const leftY = useTransform(
        scrollProgress,
        [enterStart, enterEnd, exitStart, exitEnd],
        [leftHasVisual ? "-100%" : "100%", "0%", "0%", leftHasVisual ? "-100%" : "100%"]
    );

    const rightY = useTransform(
        scrollProgress,
        [enterStart, enterEnd, exitStart, exitEnd],
        [rightHasVisual ? "-100%" : "100%", "0%", "0%", rightHasVisual ? "-100%" : "100%"]
    );

    const zIndex = useTransform(
        scrollProgress,
        [enterStart, enterEnd, exitStart, exitEnd],
        [10, 20, 20, 10]
    );

    return (
        <motion.div style={{ zIndex }} className={styles.slideViewport}>
            <motion.div
                style={{ y: leftY }}
                className={styles.leftColumn}
            >
                <div className={styles.lineLeft} />
                <div className={styles.gradientTop} />
                <div className={styles.gradientBottom} />

                <div className={styles.innerViewport}>
                  {page.leftComponent ? (
                      <BlendedVisual component={page.leftComponent} side="left" />
                  ) : page.leftBgImage ? (
                      <BlendedVisual src={page.leftBgImage} side="left" />
                  ) : (
                      <div className={cn(styles.editorialBlock, "group")}>
                          <motion.div
                              className={cn(styles.hoverBg, page.leftContent?.hoverColor || "bg-primary/5")}
                              initial={{ height: 0 }}
                              whileHover={{ height: '100%' }}
                              transition={{ duration: 0.4 }}
                          />
                          {page.leftContent && <EditorialContent content={page.leftContent} index={index} />}
                      </div>
                  )}
                </div>
            </motion.div>

            <motion.div
                style={{ y: rightY }}
                className={styles.rightColumn}
            >
                <div className={styles.lineRight} />
                <div className={styles.gradientTop} />
                <div className={styles.gradientBottom} />

                <div className={styles.innerViewport}>
                  {page.rightComponent ? (
                      <BlendedVisual component={page.rightComponent} side="right" />
                  ) : page.rightBgImage ? (
                      <BlendedVisual src={page.rightBgImage} side="right" />
                  ) : (
                      <div className={cn(styles.editorialBlock, "group")}>
                          <motion.div
                              className={cn(styles.hoverBg, page.rightContent?.hoverColor || "bg-primary/5")}
                              initial={{ height: 0 }}
                              whileHover={{ height: '100%' }}
                              transition={{ duration: 0.4 }}
                          />
                          {page.rightContent && <EditorialContent content={page.rightContent} index={index} />}
                      </div>
                  )}
                </div>
            </motion.div>
        </motion.div>
    );
}

function BridgeSlide({ page, isActive, scrollProgress, index }) {
    const step = 1 / pages.length;
    const base = index * step;

    const opacity = useTransform(scrollProgress, [base - step / 4, base + step / 4], [0, 1]);
    const y = useTransform(scrollProgress, [base - step / 4, base + step / 4], [50, 0]);

    return (
        <motion.div
            style={{ opacity, zIndex: 30 }}
            className={styles.bridgeContainer}
        >
            <motion.div style={{ y }} className={styles.bridgeContent}>
                <h2 className={styles.bridgeHeading}>
                    Discover my latest work and creative solutions <br className="hidden md:block" />
                    that bring ideas to life
                </h2>
                <div className={styles.scrollHint}>
                    <span className={styles.hintLabel}>
                        {page.subheading}
                    </span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ChevronDown className={styles.hintIcon} />
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function BlendedVisual({ src, component, side }) {
    const edgeClass = side === 'left' ? styles.overlayLeft : styles.overlayRight;

    return (
        <div className={styles.visualContainer}>
            {src ? (
                <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className={styles.visualImage}
                    style={{ backgroundImage: `url(${src})` }}
                />
            ) : component ? (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <div className="w-full h-full transform scale-[1.8] md:scale-[2.0]">
                        {component}
                    </div>
                </motion.div>
            ) : null}
            <div className={cn(styles.visualOverlay, edgeClass)} />
            <div className={styles.visualOverlayDual} />
            <div className={styles.visualOverlayTop} />
            <div className={styles.visualOverlayBottom} />
        </div>
    );
}

function EditorialContent({ content, index }) {
    return (
        <div className={styles.editorialContainer}>
            <div className={styles.headlineGroup}>
                <div className={styles.rowFeatureLabel}>
                    <span className={styles.featureTag}>
                        FEATURE — 0{index + 1}
                    </span>
                    <div className={styles.featureDivider} />
                </div>
                <h2 className={styles.editorialHeading}>
                    {content.heading}
                </h2>
                <p className={styles.editorialDesc}>
                    {content.description}
                </p>
            </div>
            {content.skills && (
                <div className={styles.skillsGroup}>
                    {content.skills.map((skill, idx) => (
                        <MagneticTag key={skill} text={skill} index={idx} />
                    ))}
                </div>
            )}
        </div>
    );
}

function MagneticTag({ text, index }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const colors = [
        "bg-emerald-500 hover:text-white",
        "bg-blue-500 hover:text-white",
        "bg-violet-500 hover:text-white",
        "bg-rose-500 hover:text-white",
        "bg-amber-500 hover:text-black",
        "bg-cyan-500 hover:text-black"
    ];
    const colorClass = colors[index % colors.length];

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) * 0.4);
        y.set((e.clientY - centerY) * 0.4);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={styles.badgeWrapper}
        >
            <motion.div
                style={{ x: springX, y: springY }}
                className={cn(styles.badge, colorClass)}
            >
                <span>{text}</span>
            </motion.div>
        </div>
    );
}
