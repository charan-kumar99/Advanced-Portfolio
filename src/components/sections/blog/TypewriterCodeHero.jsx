'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import styles from './TypewriterCodeHero.module.css';

const TERMINAL_TEXT = `// Initializing blog system...
const blog = {
  mission: "Sharing knowledge, one post at a time",
  topics: ["AI", "Web3", "Code", "Innovation"],
  status: "ACTIVE",
  author: "Software Engineer"
};

blog.init();
// Ready to explore →`;

const MatrixRain = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = '01アイウエオカキクケコサシスセソタチツテト';
        const charArray = chars.split('');
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'hsl(var(--primary))';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                ctx.globalAlpha = 0.15;
                ctx.fillText(text, x, y);

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={styles.canvas}
        />
    );
};

const TypewriterText = ({ text, speed = 30 }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text, speed]);

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <div className={styles.typewriterWrapper}>
            <span className={styles.typewriterText}>{displayText}</span>
            {currentIndex < text.length && (
                <span className={`${styles.cursor} ${showCursor ? styles.cursorActive : styles.cursorInactive}`} />
            )}
        </div>
    );
};

export const TypewriterCodeHero = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start']
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);
    const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

    return (
        <motion.div
            ref={containerRef}
            className={styles.section}
            style={{ opacity, y }}
        >
            {/* Matrix Rain Background */}
            <MatrixRain />

            {/* Grid Pattern Overlay */}
            <div className={styles.gridOverlay}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="blog-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#blog-grid)" />
                </svg>
            </div>

            {/* Gradient Orbs */}
            <div className={styles.orbRight} />
            <div className={styles.orbLeft} />

            {/* Terminal Content */}
            <div className={styles.containerInner}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={styles.terminalWrapper}
                >
                    {/* Terminal Header */}
                    <div className={styles.terminalHeader}>
                        <div className={styles.windowControlWrapper}>
                            <div className={styles.windowControlRed} />
                            <div className={styles.windowControlYellow} />
                            <div className={styles.windowControlGreen} />
                        </div>
                        <span className={styles.terminalTitle}>
                            blog_terminal.tsx
                        </span>
                    </div>

                    {/* Terminal Window */}
                    <div className={styles.terminalWindow}>
                        {/* Prompt Line */}
                        <div className={styles.promptLine}>
                            <span className={styles.promptVisitor}>visitor</span>
                            <span className={styles.promptAt}>@</span>
                            <span className={styles.promptHost}>blog</span>
                            <span className={styles.promptColon}>:~$&nbsp;</span>
                            <span className={styles.promptCmd}>cat</span>
                            <span className={styles.promptArg}>&nbsp;mission.js</span>
                        </div>

                        {/* Typewriter Content */}
                        <div className={styles.terminalBody}>
                            <TypewriterText text={TERMINAL_TEXT} speed={20} />
                        </div>
                    </div>

                    {/* Index Label */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5 }}
                        className={styles.indexLabelWrapper}
                    >
                        <div className={styles.indexLine} />
                        <span className={styles.indexLabel}>
                            INDEX_BLOG.v1.0
                        </span>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3, duration: 1 }}
                    className={styles.scrollIndicator}
                    onClick={() => {
                        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                    }}
                >
                    <span className={styles.scrollText}>
                        Scroll to explore
                    </span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <ChevronDown className={styles.scrollIconWrapper} />
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Fade */}
            <div className={styles.bottomFade} />
        </motion.div>
    );
};
