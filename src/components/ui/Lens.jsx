"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { cn } from "@/lib/utils";
import styles from './Lens.module.css';

export const Lens = ({
    children,
    zoomFactor = 1.5,
    lensSize = 170,
    isStatic = false,
    position = { x: 200, y: 150 },
    hovering,
    setHovering,
    className,
    borderRadius = "lg",
    borderWidth = 0,
    borderColor = "",
    shadowIntensity = 'medium',
    animationDuration = 0.3,
    animationEasing = "easeOut",
    maskShape = 'circle',
    opacity = 1,
    disabled = false,
}) => {
    const containerRef = useRef(null);
    const [localIsHovering, setLocalIsHovering] = useState(false);

    const mouseX = useMotionValue(100);
    const mouseY = useMotionValue(100);

    const isHovering = hovering !== undefined ? hovering : localIsHovering;
    const setIsHovering = setHovering || setLocalIsHovering;

    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    const effectiveDisabled = disabled || isMobile;

    const handleMouseMove = (e) => {
        if (effectiveDisabled || isStatic) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        mouseX.set(x);
        mouseY.set(y);
    };

    const shadowClass = {
        none: styles.shadowNone,
        light: styles.shadowLight,
        medium: styles.shadowMedium,
        heavy: styles.shadowHeavy,
    }[shadowIntensity] || styles.shadowMedium;

    const maskImage = useMotionTemplate`radial-gradient(${maskShape === 'circle' ? 'circle' : 'ellipse'} ${lensSize / 2}px ${maskShape === 'circle' ? '' : lensSize / 2 + 'px'} at ${mouseX}px ${mouseY}px, black 100%, transparent 100%)`;

    const transformOrigin = useMotionTemplate`${mouseX}px ${mouseY}px`;

    const staticStyle = {
        maskImage: `radial-gradient(${maskShape === 'circle' ? 'circle' : 'ellipse'} ${lensSize / 2}px ${maskShape === 'circle' ? '' : lensSize / 2 + 'px'} at ${position.x}px ${position.y}px, black 100%, transparent 100%)`,
        transformOrigin: `${position.x}px ${position.y}px`
    };

    const parsedRadius = borderRadius === "lg" ? "var(--radius)" : borderRadius;

    const lensContent = (
        <motion.div
            initial={{ opacity: 0, scale: 0.58 }}
            animate={{ opacity: opacity, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: animationDuration, ease: animationEasing }}
            className={cn(styles.lensWrapper, shadowClass)}
            style={isStatic ? {
                ...staticStyle,
                zIndex: 50,
                borderWidth: borderWidth ? `${borderWidth}px` : undefined,
                borderStyle: borderWidth ? "solid" : undefined,
                borderColor: borderColor || undefined
            } : {
                maskImage,
                WebkitMaskImage: maskImage,
                transformOrigin,
                zIndex: 50,
                borderWidth: borderWidth ? `${borderWidth}px` : undefined,
                borderStyle: borderWidth ? "solid" : undefined,
                borderColor: borderColor || undefined
            }}
        >
            <div
                className={styles.lensScale}
                style={isStatic ? {
                    transform: `scale(${zoomFactor})`,
                    transformOrigin: `${position.x}px ${position.y}px`
                } : {
                    transform: `scale(${zoomFactor})`,
                    transformOrigin: transformOrigin,
                }}
            >
                {children}
            </div>
        </motion.div>
    );

    return (
        <div
            ref={containerRef}
            className={cn(
                styles.container,
                effectiveDisabled && styles.disabled,
                className
            )}
            style={{ borderRadius: parsedRadius }}
            onMouseEnter={() => !effectiveDisabled && setIsHovering(true)}
            onMouseLeave={() => !effectiveDisabled && setIsHovering(false)}
            onMouseMove={handleMouseMove}
        >
            {children}

            {isStatic ? (
                <div>{lensContent}</div>
            ) : (
                <AnimatePresence>
                    {isHovering && !effectiveDisabled && (
                        <div>{lensContent}</div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};
