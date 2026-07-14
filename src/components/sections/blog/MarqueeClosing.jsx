'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import { LiquidOcean } from '@/components/ui/liquid-ocean';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { usePerformance } from '@/hooks/usePerformance';
import styles from './MarqueeClosing.module.css';

export const MarqueeClosing = ({ isLowPowerMode: parentLowPowerMode }) => {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { isMobile } = usePerformance();

    // Use isMobile to strictly limit CSS fallback to mobile devices only.
    // Desktop (even in low power mode) should try to render the effect as per user request.
    const showOcean = !isMobile;

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = currentTheme === 'dark';

    // Ocean Colors
    const oceanConfig = isDark ? {
        bg: 0x000000,
        grid: 0x222222,
        accent: 0x06b6d4,
        opacity: 0.4
    } : {
        bg: 0xffffff,
        grid: 0xe5e5e5,
        accent: 0x3b82f6,
        opacity: 0.6
    };

    if (!mounted) return null;

    return (
        <div className={isDark ? styles.sectionDark : styles.sectionLight}>

            {/* Background Ocean - Full Immersive */}
            <div className={styles.oceanContainer}>
                {!showOcean ? (
                    <div className={isDark ? styles.fallbackDark : styles.fallbackLight}>
                        <div className={styles.oceanFallbackGlow} style={{ backgroundImage: `radial-gradient(circle at 50% 120%, ${isDark ? '#06b6d4' : '#3b82f6'}, transparent)` }} />
                    </div>
                ) : (
                    <LiquidOcean
                        key={isDark ? 'dark' : 'light'}
                        backgroundColor={oceanConfig.bg}
                        gridColor={oceanConfig.grid}
                        accentColor={oceanConfig.accent}
                        oceanSize={60}
                        oceanFragments={40}
                        waveAmplitude={isDark ? 0.8 : 0.5}
                        waveSpeed={0.015}
                        showBoats={true}
                        boatCount={6}
                        boatSpread={20}
                        showWireframe={true}
                        showGrid={true}
                        oceanOpacity={oceanConfig.opacity}
                        isLowPowerMode={false}
                    />
                )}

                {/* Top Fade - Gradient Bridge from Page Background to Ocean */}
                <div className={isDark ? styles.gradientBridgeDark : styles.gradientBridgeLight} />
            </div>

            {/* Main Content - Centered */}
            <div className={styles.contentInner}>

                <motion.div
                    initial={!showOcean ? { opacity: 0 } : { opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: !showOcean ? 0.5 : 1, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className={styles.contentBlock}
                >
                    <h2 className={isDark ? styles.titleDarkText : styles.titleLightText}>
                        Ready to Build?
                    </h2>

                    <p className={isDark ? styles.descDarkText : styles.descLightText}>
                        I'm always open to discussing product design work or partnership opportunities. Let's create something extraordinary together.
                    </p>

                    {/* Action Area: Newsletter & Navigation */}
                    <div className={styles.actionArea}>

                        {/* Newsletter Input */}
                        <div className={isDark ? styles.newsletterWrapperDark : styles.newsletterWrapperLight}>
                            <div className={styles.mailIconWrapper}>
                                <Mail className={`w-5 h-5 ${isDark ? styles.mailIconTextDark : styles.mailIconTextLight}`} />
                            </div>
                            <input
                                type="email"
                                placeholder="Enter your email for updates..."
                                className={isDark ? styles.newsletterInputDark : styles.newsletterInputLight}
                            />
                            <button className={isDark ? styles.joinBtnDark : styles.joinBtnLight}>
                                Join
                            </button>
                        </div>

                        {/* Secondary Navigation Links */}
                        <div className={styles.linksRow}>
                            <Link href="/contact" className={isDark ? styles.actionLinkDark : styles.actionLinkLight}>
                                <span>Contact Me</span>
                                <ArrowUpRight className={styles.arrowIcon} />
                            </Link>
                            <Link href="/projects" className={isDark ? styles.actionLinkDark : styles.actionLinkLight}>
                                <span>View Projects</span>
                                <ArrowUpRight className={styles.arrowIcon} />
                            </Link>
                        </div>

                    </div>
                </motion.div>
            </div>
        </div >
    );
};
