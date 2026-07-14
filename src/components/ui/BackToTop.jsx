'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './BackToTop.module.css';

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const isVisibleRef = useRef(false);
    const timeoutRef = useRef(null);

    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 120, damping: 14, mass: 0.1 });
    const mouseY = useSpring(y, { stiffness: 120, damping: 14, mass: 0.1 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
            const { height, width, left, top } = rect;
            const middleX = clientX - (left + width / 2);
            const middleY = clientY - (top + height / 2);

            x.set(middleX);
            y.set(middleY);
        }
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (isVisibleRef.current) {
                setIsVisible(false);
                isVisibleRef.current = false;
            }

            timeoutRef.current = setTimeout(() => {
                const scrolledEnough = window.scrollY > 100;

                if (scrolledEnough && !isVisibleRef.current) {
                    setIsVisible(true);
                    isVisibleRef.current = true;
                } else if (!scrolledEnough && isVisibleRef.current) {
                    setIsVisible(false);
                    isVisibleRef.current = false;
                }
            }, 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div
                    ref={ref}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className={cn(styles.wrapper, "hide-on-modal")}
                >
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        onClick={scrollToTop}
                        style={{ x: mouseX, y: mouseY }}
                        className={styles.button}
                    >
                        <ArrowUp className={styles.icon} />
                        <div className={styles.glow} />
                    </motion.button>
                </div>
            )}
        </AnimatePresence>
    );
}
