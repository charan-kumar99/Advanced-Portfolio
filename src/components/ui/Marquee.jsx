'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import styles from './marquee.module.css';

export function Marquee({
    children,
    direction = 'left',
    speed = 30,
    pauseOnHover = true,
    className
}) {
    const containerRef = useRef(null);
    const [animationDuration, setAnimationDuration] = useState(30);

    useEffect(() => {
        if (containerRef.current) {
            const container = containerRef.current;
            const contentWidth = container.scrollWidth / 2;
            const duration = contentWidth / speed;
            setAnimationDuration(duration);
        }
    }, [speed, children]);

    return (
        <div
            ref={containerRef}
            className={cn(
                styles.container,
                pauseOnHover && styles.pauseOnHover,
                className
            )}
            style={{
                maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
            }}
        >
            <div
                className={cn(
                    styles.inner,
                    direction === 'right' && styles.reverse
                )}
                style={{
                    animationDuration: `${animationDuration}s`,
                }}
            >
                {children}
            </div>
            <div
                className={cn(
                    styles.inner,
                    direction === 'right' && styles.reverse
                )}
                style={{
                    animationDuration: `${animationDuration}s`,
                }}
                aria-hidden="true"
            >
                {children}
            </div>
        </div>
    );
}
