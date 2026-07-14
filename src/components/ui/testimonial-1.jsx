"use client";

import { ExternalLink } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from './testimonial-1.module.css';

function Counter({ value, decimals = 0 }) {
  const count = useMotionValue(1);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" });
      return () => controls.stop();
    }
  }, [count, value, isInView]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function Testimonial1() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const startDate = new Date("2025-09-11");
  const currentDate = new Date();
  const totalMonths = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + (currentDate.getMonth() - startDate.getMonth());

  let expValue = 0;
  let expDecimals = 0;
  let expSuffix = "";

  if (totalMonths < 12) {
    expValue = Math.max(0, totalMonths);
    expDecimals = 0;
    expSuffix = "+\u00A0months";
  } else {
    expValue = totalMonths / 12;
    expDecimals = 1;
    expSuffix = "+\u00A0years";
  }

  const stats = [
    {
      value: 4,
      decimals: 0,
      suffix: "+",
      label: "Projects Completed",
      href: "/projects",
      cta: "View Projects",
    },
    {
      value: 15,
      decimals: 0,
      suffix: "+",
      label: "APIs Integrated",
      href: "/projects",
      cta: "Explore Architecture",
    },
    {
      value: expValue,
      decimals: expDecimals,
      suffix: expSuffix,
      label: "Professional Exp",
      href: "/experience",
      cta: "Explore Career",
    },
    {
      value: 20,
      decimals: 0,
      suffix: "+",
      label: "Tech & Tools",
      href: "/skills",
      cta: "See Skills",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Community Badge */}
        <div className={styles.badgeWrapper}>
          <div className={styles.badge}>
            <span className={styles.indicator}>
              <motion.span
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={styles.indicatorGlow}
              />
              <span className={styles.indicatorDot} />
            </span>
            Professional Statistics
          </div>
        </div>

        {/* Main Heading with Refined Block Reveal Animation */}
        <div className={styles.headingWrapper}>
          {[
            { text: "Architecture that scales.", color: "#6366f1", delay: 0 },
            { text: "Logic that holds.", color: "#10b981", delay: 0.15 },
            { text: "Engineering excellence", color: "#f59e0b", delay: 0.3 },
            { text: "and the numbers behind the work.", color: "#ef4444", delay: 0.45 }
          ].map((line, i) => (
            <div key={i} className={styles.lineBlock}>
              <motion.h1
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  delay: line.delay + 0.35,
                  duration: 0.01
                }}
                className={styles.headingLine}
              >
                {line.text}
              </motion.h1>

              {/* The Refined Revealer Block */}
              <motion.div
                initial={{ clipPath: i % 2 === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" }}
                whileInView={{
                  clipPath: i % 2 === 0 
                    ? ["inset(0 100% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 0 0 100%)"]
                    : ["inset(0 0 0 100%)", "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 100% 0 0)"]
                }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.75,
                  times: [0, 0.45, 0.55, 1],
                  delay: line.delay,
                  ease: [0.85, 0, 0.15, 1]
                }}
                className={styles.revealer}
                style={{ backgroundColor: line.color }}
              />
            </div>
          ))}
        </div>

        {/* Glassmorphic Stats Bar */}
        <div className={styles.statsBar}>
          {/* Subtle Background Glow inside the bar */}
          <div className={styles.bgGlow} />

          {stats.map((stat, index) => (
            <Link
              key={stat.label}
              href={stat.href}
              className={styles.statLink}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={styles.statWrapper}>
                {index !== 0 && (
                  <div className={styles.divider} />
                )}

                <div className={styles.staticContent}>
                  <span className={styles.statLabel}>
                    {stat.label}
                  </span>
                  <div className={styles.statValue}>
                    <Counter value={stat.value} decimals={stat.decimals} />
                    <span className={styles.suffix}>{stat.suffix}</span>
                  </div>
                </div>

                {/* Smoky / Foggy Hover Reveal */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={styles.smokeHover}
                    >
                      <div className={styles.smokeLayer} />
                      <span className={styles.ctaText}>
                        {stat.cta}
                        <ExternalLink className={styles.ctaIcon} />
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
