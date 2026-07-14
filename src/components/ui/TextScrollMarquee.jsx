'use client';

import { useRef, useEffect } from 'react';
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useVelocity,
    useAnimationFrame,
    useMotionValue,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import styles from './TextScrollMarquee.module.css';

const wrap = (min, max, v) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function TextScrollMarquee({
    children,
    baseVelocity = 1,
    className,
    scrollDependent = false,
    delay = 0,
    direction = 'left',
}) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400,
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
        clamp: false,
    });

    const x = useTransform(baseX, (v) => `${wrap(-100, 0, v % 100)}%`);

    const directionFactor = useRef(direction === 'left' ? 1 : -1);
    const hasStarted = useRef(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            hasStarted.current = true;
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        directionFactor.current = direction === 'left' ? 1 : -1;
    }, [direction]);

    useAnimationFrame((t, delta) => {
        if (!hasStarted.current) return;

        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (scrollDependent) {
            if (velocityFactor.get() < 0) {
                directionFactor.current = -1;
            } else if (velocityFactor.get() > 0) {
                directionFactor.current = 1;
            }
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.scroller}
                style={{ x }}
            >
                {[...Array(typeof window !== 'undefined' && window.innerWidth < 768 ? 2 : 4)].map((_, index) => (
                    <span key={index} className={cn(styles.item, className)}>
                        {children}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
