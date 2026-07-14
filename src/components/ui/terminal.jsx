'use client';

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from './terminal.module.css';

export const Terminal = ({ children, className }) => {
    return (
        <div className={cn(styles.container, className)}>
            <div className={styles.header}>
                <div className={styles.controls}>
                    <div className={styles.dotRed} />
                    <div className={styles.dotYellow} />
                    <div className={styles.dotGreen} />
                </div>
            </div>
            <div className={styles.body}>
                {children}
            </div>
        </div>
    );
};

export const TypingAnimation = ({
    children,
    className,
    duration = 50,
    delay = 0,
    as: Component = "span",
    ...props
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setStarted(true);
        }, delay);
        return () => clearTimeout(startTimeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        let i = 0;
        const typingEffect = setInterval(() => {
            if (i < children.length) {
                setDisplayedText(children.substring(0, i + 1));
                i++;
            } else {
                clearInterval(typingEffect);
            }
        }, duration);

        return () => {
            clearInterval(typingEffect);
        };
    }, [children, duration, started]);

    return (
        <MotionComponent
            as={Component}
            className={cn(styles.mono, className)}
            {...props}
        >
            {displayedText}
        </MotionComponent>
    );
};

export const AnimatedSpan = ({
    children,
    className,
    delay = 0,
    as: Component = "span",
    ...props
}) => {
    return (
        <MotionComponent
            as={Component}
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: delay / 1000 }}
            className={cn(styles.mono, className)}
            {...props}
        >
            {children}
        </MotionComponent>
    );
};

const MotionComponent = ({ as: Component = "div", children, ...props }) => {
    const MotionEl = motion[Component] || motion.div;
    return <MotionEl {...props}>{children}</MotionEl>;
};
