'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, Trophy, Navigation, Briefcase, Rocket, BookOpen, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './CardNav.module.css';

function DockIcon({
    link,
    mouseX,
    index,
    iconMap,
    setIsExpanded,
    theme
}) {
    const ref = useRef(null);
    const Icon = iconMap[link.href] || Sparkles;

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthTransform = useTransform(distance, [-150, 0, 150], [60, 100, 60]);
    const width = useSpring(widthTransform, { stiffness: 350, damping: 25, mass: 0.1 });

    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            href={link.href}
            onClick={() => setIsExpanded(false)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={styles.dockItem}
        >
            {/* Tooltip Label */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: -10, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.8 }}
                        className={styles.tooltip}
                    >
                        {link.label}
                        <div className={styles.tooltipArrow} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Magnified Icon Container */}
            <motion.div
                ref={ref}
                style={{ width }}
                className={cn(
                    styles.iconWrapper,
                    theme === 'dark' ? styles.darkIcon : styles.lightIcon
                )}
            >
                {/* Background Glow */}
                <motion.div
                    animate={{ opacity: isHovered ? 0.3 : 0 }}
                    className={cn(
                        styles.glow,
                        "bg-gradient-to-br",
                        link.color || "from-primary/50 to-transparent"
                    )}
                />

                <Icon className={cn(
                    styles.icon,
                    "transition-transform duration-300",
                    isHovered
                        ? "scale-110 " + (link.iconColor || "text-primary")
                        : (theme === 'dark' ? styles.darkIconText : styles.lightIconText)
                )} />
            </motion.div>
        </Link>
    );
}

export default function CardNav({
    items,
    theme = "dark",
    pathname = "/"
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef(null);
    const mouseX = useSpring(Infinity);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const aboutItem = items.find(i => i.label === "About") || items[0];

    const isActive = useMemo(() => {
        return aboutItem.links.some(link => pathname === link.href || pathname.startsWith(`${link.href}/`));
    }, [pathname, aboutItem.links]);

    const iconMap = {
        "/achievements": Trophy,
        "/skills": Navigation,
        "/experience": Briefcase,
        "/projects": Rocket,
        "/blog": BookOpen
    };

    const btnClass = cn(
        styles.btn,
        isActive
            ? (theme === 'dark' ? styles.darkBtnActive : styles.lightBtnActive)
            : (theme === 'dark' ? styles.darkBtnInactive : styles.lightBtnInactive)
    );

    const dockListClass = cn(
        styles.dockList,
        theme === 'dark' ? styles.darkDock : styles.lightDock
    );

    return (
        <div ref={containerRef} className={styles.relative}>
            <motion.button
                onMouseEnter={() => setIsExpanded(true)}
                onClick={() => setIsExpanded(!isExpanded)}
                className={btnClass}
            >
                <div className={styles.hoverOverlay} />
                <span className={styles.labelFlex}>
                    {isActive && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={styles.dotWrapper}
                        >
                            <motion.span 
                                animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className={styles.greenDot}
                            />
                        </motion.div>
                    )}
                    {aboutItem.label}
                </span>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={styles.z10}
                >
                    <ChevronDown className={styles.arrow} />
                </motion.div>
            </motion.button>

            {/* Elastic Glass Ribbon (Dock Style) */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        onMouseMove={(e) => mouseX.set(e.clientX)}
                        onMouseLeave={() => {
                            mouseX.set(Infinity);
                            setIsExpanded(false);
                        }}
                        initial={{ opacity: 0, y: -20, scale: 0.95, x: "-50%" }}
                        animate={{ opacity: 1, y: 15, scale: 1, x: "-50%" }}
                        exit={{ opacity: 0, y: -10, scale: 0.95, x: "-50%" }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.dockListWrapper}
                    >
                        <motion.div className={dockListClass}>
                            {aboutItem.links.map((link, idx) => (
                                <DockIcon
                                    key={link.href}
                                    link={link}
                                    mouseX={mouseX}
                                    index={idx}
                                    iconMap={iconMap}
                                    setIsExpanded={setIsExpanded}
                                    theme={theme}
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
