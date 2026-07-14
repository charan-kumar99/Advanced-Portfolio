'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ImageIcon, Maximize2, MoveRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './GalleryStack.module.css';

export const GalleryStack = ({ images }) => {
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 200 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set((e.clientX - centerX) / 20);
        mouseY.set((e.clientY - centerY) / 20);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    const displayImages = images.slice(0, 5);

    return (
        <Link href="/gallery" className={styles.link}>
            <motion.div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                className={styles.container}
            >
                {/* Background Ambient Glow */}
                <div className={styles.ambientBg}>
                    <div className={styles.glowBall} />
                </div>

                {/* The Kaleidoscope Image Fan */}
                <div className={styles.fanContainer}>
                    {displayImages.map((img, index) => {
                        const angle = (index - 2) * 20;
                        const scale = 1 - (Math.abs(index - 2) * 0.1);

                        return (
                            <motion.div
                                key={index}
                                style={{
                                    x: isHovered ? x : 0,
                                    y: isHovered ? y : 0,
                                    zIndex: 10 - Math.abs(index - 2),
                                }}
                                initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
                                animate={{
                                    rotate: isHovered ? angle : angle / 2,
                                    translateX: isHovered ? (index - 2) * 50 : 0,
                                    translateY: isHovered ? Math.abs(index - 2) * 15 - 20 : index * 4,
                                    scale: isHovered ? scale * 1.1 : scale,
                                    opacity: 1,
                                }}
                                transition={{
                                    type: "spring",
                                    damping: 20,
                                    stiffness: 100,
                                    delay: index * 0.05
                                }}
                                className={styles.fanCard}
                            >
                                <Image
                                    src={img}
                                    alt={`Archive ${index}`}
                                    fill
                                    className={cn(
                                        styles.img,
                                        isHovered ? "grayscale-0 scale-110 blur-0" : "grayscale-[0.8] scale-100 blur-[1px]"
                                    )}
                                />
                                {/* Glass Overlay & Shine Effect */}
                                <div className={styles.glassOverlay} />
                                <motion.div
                                    className={styles.shine}
                                    style={{ skewX: -20 }}
                                />
                            </motion.div>
                        );
                    })}

                    {/* Central Floating Badge */}
                    <motion.div
                        style={{ x, y }}
                        animate={{
                            scale: isHovered ? 1.1 : 1,
                            y: isHovered ? -10 : 20,
                            opacity: isHovered ? 1 : 0.8
                        }}
                        className={styles.badge}
                    >
                        <ImageIcon className="w-5 h-5" />
                        <span className={styles.badgeText}>+ {images.length} ARCHIVES</span>
                        <div className={styles.badgeLine} />
                        <MoveRight className={styles.arrow} />
                    </motion.div>
                </div>

                {/* Editorial Text Overlays */}
                <div className={styles.headerText}>
                    <div className={styles.colText}>
                        <span className={styles.subTitle}>Documentation</span>
                        <h4 className={styles.title}>THE GALLERY</h4>
                    </div>
                    <div className={styles.maxBtn}>
                        <Maximize2 className={styles.maxIcon} />
                    </div>
                </div>

                {/* Particles / Highlights */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [-10, 10, -10],
                                opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                                duration: 3 + i,
                                repeat: Infinity,
                            }}
                            className={styles.particle}
                            style={{
                                width: 10 + i * 20,
                                height: 10 + i * 20,
                                left: `${20 + i * 25}%`,
                                top: `${30 + i * 15}%`,
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </Link>
    );
};

export const GalleryButton = ({ galleryImages }) => {
    return <GalleryStack images={galleryImages} />;
};
