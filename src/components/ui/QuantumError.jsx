'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Home, MoveLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { usePerformance } from '@/hooks/usePerformance';
import { cn } from '@/lib/utils';
import styles from './QuantumError.module.css';

export function QuantumError({ type = '404', reset }) {
    const { isLowPowerMode } = usePerformance();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [currentTime, setCurrentTime] = useState(new Date());
    const frameRef = useRef(null);

    const springConfig = { damping: 25, stiffness: 150 };
    const rotateX = useSpring(useTransform(mouseY, [0, 1000], [10, -10]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [0, 1000], [-10, 10]), springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isLowPowerMode) return;

            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }

            frameRef.current = requestAnimationFrame(() => {
                mouseX.set(e.clientX);
                mouseY.set(e.clientY);
            });
        };
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(timer);
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [mouseX, mouseY, isLowPowerMode]);

    const title = type === '404' ? '404' : 'ERROR';
    const subtitle = type === '404' ? 'YOU ARE LOST!?' : 'EXCEPTION_CAUGHT';
    const description = type === '404'
        ? "The page you're looking for is missing."
        : "An internal technical error has occurred.";

    const formattedDate = currentTime.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).toUpperCase();

    const formattedTime = currentTime.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    return (
        <div className={styles.container}>
            {/* Content Container with 3D Tilt */}
            <motion.div
                style={{ rotateX, rotateY, perspective: '1000px' }}
                className={styles.content}
            >
                {/* Glitch Typography */}
                <div className={styles.titleWrapper}>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={styles.title}
                    >
                        {title}
                    </motion.h1>

                    {/* Ghost Layers for Glitch Effect */}
                    {!isLowPowerMode && (
                        <div className={styles.ghost}>
                            <motion.span
                                animate={{
                                    x: [0, -4, 4, -2, 0],
                                    y: [0, 2, -2, 1, 0]
                                }}
                                transition={{ duration: 0.2, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                                className={styles.ghostTitle}
                            >
                                {title}
                            </motion.span>
                        </div>
                    )}
                </div>

                {/* Subtitle & Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={styles.statusContainer}
                >
                    <div className={styles.badge}>
                        {subtitle}
                    </div>
                    <p className={styles.desc}>
                        {description}
                    </p>
                </motion.div>

                {/* Navigation Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className={styles.navRow}
                >
                    <Link href="/">
                        <button className={styles.btn}>
                            <Home size={18} />
                            <span>Return Home</span>
                            <div className={styles.arrowWrapper}>
                                <MoveLeft size={16} className="rotate-180" />
                            </div>
                        </button>
                    </Link>

                    {reset ? (
                        <button
                            onClick={reset}
                            className={styles.textBtn}
                        >
                            <RefreshCcw size={18} />
                            <span>Reboot Session</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => window.history.back()}
                            className={styles.textBtn}
                        >
                            <MoveLeft size={18} />
                            <span>Step Back</span>
                        </button>
                    )}
                </motion.div>
            </motion.div>

            {/* Decorative Elements - Real-time Info Panel */}
            <div className={styles.infoPanel}>
                <div className={styles.infoGrid}>
                    <div className={styles.infoTitle}>
                        <span>UDUPI, INDIA</span>
                    </div>
                    <div className={styles.infoDate}>
                        {formattedDate}
                    </div>
                    <div className={styles.infoTime}>
                        {formattedTime.replace(/:/g, '.')}
                    </div>
                </div>
            </div>

            {/* Subtle Noise / Grain */}
            <div className={styles.noise} />
        </div >
    );
}
