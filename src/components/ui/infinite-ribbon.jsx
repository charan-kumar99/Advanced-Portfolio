'use client';

import { cn } from '@/lib/utils';
import { useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import styles from './infinite-ribbon.module.css';

const wrap = (min, max, v) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function InfiniteRibbon({
    children,
    baseVelocity = 2,
    rotation = 0,
    reverse = false,
    className,
    background = "bg-primary",
    textColor = "text-primary-foreground"
}) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        const handleResize = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const x = useTransform(baseX, (v) => `${wrap(-100, 0, v % 100)}%`);

    const directionFactor = useRef(reverse ? -1 : 1);
    const finalVelocity = reverse ? -baseVelocity : baseVelocity;

    useAnimationFrame((t, delta) => {
        if (isMobile) return;

        let moveBy = directionFactor.current * finalVelocity * (delta / 1000);
        moveBy += directionFactor.current * moveBy * velocityFactor.get() * 0.5;
        baseX.set(baseX.get() + moveBy);
    });

    const bgClass = background === "bg-primary" ? styles.bgPrimary : background;
    const textClass = textColor === "text-primary-foreground" ? styles.textPrimaryForeground : textColor;

    return (
        <div
            className={cn(styles.container, bgClass, className)}
            style={{
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                transformOrigin: 'center center'
            }}
        >
            <motion.div
                className={cn(
                    styles.inner,
                    textClass,
                    isMobile && (reverse ? styles.animateMarqueeReverse : styles.animateMarquee)
                )}
                style={isMobile ? {} : { x }}
            >
                {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className={styles.item}>
                        {children} <span className={styles.dot} />
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
