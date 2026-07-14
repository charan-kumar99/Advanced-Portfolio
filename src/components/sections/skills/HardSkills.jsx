"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import gsap from "gsap";
import styles from "./HardSkills.module.css";

const CATEGORIES = [
  {
    id: "01",
    title: "Software Engineering",
    fullTitle: "Software Architecture & Engineering",
    description: "Designing robust, scalable, and maintainable software architectures and full-stack solutions.",
    filterCategories: ['software', 'backend', 'frontend']
  },
  {
    id: "02",
    title: "Database Architecture",
    fullTitle: "Database Design & Optimization",
    description: "Architecting efficient relational database schemas and data processing pipelines.",
    filterCategories: ['database', 'data']
  },
  {
    id: "03",
    title: "Development Lifecycle",
    fullTitle: "SDLC & Development Workflows",
    description: "Governing the software development lifecycle, utilizing agile methodologies and modern DevOps tooling.",
    filterCategories: ['devops', 'cloud', 'other']
  }
];

const AUTO_PLAY_DURATION = 8000;

const ProgressBar = ({ duration, activeIndex }) => {
  const lineRef = React.useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(lineRef.current, 
          { scaleY: 0, opacity: 0 }, 
          { 
            scaleY: 1, 
            opacity: 1, 
            duration: duration / 1000, 
            ease: "none",
            force3D: true 
          }
        );
      }
    });

    return () => ctx.revert();
  }, [duration, activeIndex]);

  return (
    <div 
      ref={lineRef}
      className={styles.progressBar}
    />
  );
};

export const HardSkills = () => {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categorizedSkills = useMemo(() => {
    const groups = {
      '01': [],
      '02': [],
      '03': []
    };

    if (!portfolioData?.hardSkills) return groups;

    portfolioData.hardSkills.forEach(skill => {
      const cat = skill.category?.toLowerCase() || '';
      if (CATEGORIES[0].filterCategories.includes(cat)) {
        groups['01'].push(skill);
      } else if (CATEGORIES[1].filterCategories.includes(cat)) {
        groups['02'].push(skill);
      } else {
        groups['03'].push(skill);
      }
    });
    return groups;
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % CATEGORIES.length);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_DURATION);
    return () => clearInterval(interval);
  }, [mounted, handleNext]);

  const variants = {
    enter: (direction) => ({
      y: direction > 0 ? "10%" : "-10%",
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        y: { type: "spring", stiffness: 400, damping: 30 },
        opacity: { duration: 0.4 }
      }
    },
    exit: (direction) => ({
      y: direction > 0 ? "-10%" : "10%",
      opacity: 0,
      filter: "blur(4px)",
      transition: {
        y: { type: "spring", stiffness: 400, damping: 30 },
        opacity: { duration: 0.3 }
      }
    }),
  };

  if (!mounted) return <div className="min-h-[850px]" />;

  return (
    <section id="hard-skills" className={styles.section}>
      <div className={styles.containerInner}>
        <div className={styles.grid}>
          <div className={styles.leftCol}>
            <div className={styles.cardGalleryWrapper}>
              <div 
                className={styles.cardOuter}
                data-lenis-prevent
                style={{ overflowAnchor: 'none' }}
              >
                <div className={styles.cardAmbientGlow}></div>

                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className={styles.cardMotionWrapper}
                  >
                    <div
                      className={activeIndex === 2 ? styles.cardScrollContainerScrollable : styles.cardScrollContainerStatic}
                      onWheel={(e) => {
                        if (activeIndex === 2) {
                          e.stopPropagation();
                        }
                      }}
                    >
                      <div className={activeIndex === 2 ? styles.skillsGridScrollable : styles.skillsGridStatic}>
                        {categorizedSkills[CATEGORIES[activeIndex].id]?.map((skill, idx) => (
                          <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: idx * 0.03 }}
                            className={styles.skillCard}
                          >
                            <div className="mb-3">
                              <div className={styles.skillHeader}>
                                <h5 className={styles.skillTitle}>{skill.name}</h5>
                                <span className={`${styles.skillLevelBadge} ${
                                  skill.level === 'beginner' ? styles.badgeBeginner :
                                  skill.level === 'intermediate' ? styles.badgeIntermediate :
                                  skill.level === 'advanced' ? styles.badgeAdvanced :
                                  skill.level === 'expert' ? styles.badgeExpert :
                                  styles.badgeExp
                                }`}>
                                  {skill.level || 'Exp'}
                                </span>
                              </div>
                              <div className={styles.skillProgressTrack}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: skill.level === 'expert' ? '95%' : skill.level === 'advanced' ? '80%' : '60%' }}
                                  transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                                  className={styles.skillProgressBar}
                                />
                              </div>
                            </div>
                            <p className={styles.skillDesc}>
                              {skill.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.rightColTitleWrapper}>
              <h2 className={styles.rightColTitle}>
                Core Focus
              </h2>
              <span className={styles.rightColSub}>
                (ARCHITECTURES)
              </span>
            </div>

            <div className={styles.rightColList}>
              {CATEGORIES.map((category, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      if (index === activeIndex) return;
                      setDirection(index > activeIndex ? 1 : -1);
                      setActiveIndex(index);
                    }}
                    className={isActive ? styles.activeBtn : styles.inactiveBtn}
                  >
                    <div className={styles.btnBorderTrack}>
                      {isActive && <ProgressBar duration={AUTO_PLAY_DURATION} activeIndex={activeIndex} />}
                    </div>
                    <div className={styles.btnContent}>
                      <div className={styles.btnHeadingRow}>
                        <span className={isActive ? styles.activeBtnNum : styles.inactiveBtnNum}>
                          /{category.id}
                        </span>
                        <h3 className={isActive ? styles.activeBtnTitle : styles.inactiveBtnTitle}>
                          {category.title.toUpperCase()}
                        </h3>
                      </div>
                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 5 }}
                            transition={{ duration: 0.4 }}
                            className={styles.btnDesc}
                          >
                            {category.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HardSkills;
