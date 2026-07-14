'use client';

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import Link from 'next/link';
import Image from 'next/image';
import { GalleryButton } from '@/components/ui/GalleryStack';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { getAllGalleryImages } from '@/app/actions/getGalleryImages';
import styles from './BentoHero.module.css';

export const BentoHero = ({ isLowPowerMode }) => {
    const t = useTranslations('blog');
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start']
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

    // Mouse Spotlight
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        if (!containerRef.current || isLowPowerMode) return;
        const { left, top } = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    const spotlightBackground = useMotionTemplate`radial-gradient(1000px circle at ${mouseX}px ${mouseY}px, rgba(var(--primary-rgb), ${isDark ? '0.1' : '0.05'}), transparent 80%)`;

    // Carousel state
    const [currentSlide, setCurrentSlide] = useState(0);
    const featuredPosts = portfolioData.blogs.slice(0, 3);
    const totalPosts = portfolioData.blogs.length;
    // Dynamic Categories with Counts
    const categoryStats = Array.from(new Set(portfolioData.blogs.map(blog => blog.category)))
        .slice(0, 4)
        .map(cat => ({
            name: cat,
            count: portfolioData.blogs.filter(b => b.category === cat).length
        }));

    // Random Gallery Images
    const [randomGalleryImages, setRandomGalleryImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const images = await getAllGalleryImages();
            if (images && images.length > 0) {
                const shuffled = [...images].sort(() => 0.5 - Math.random());
                setRandomGalleryImages(shuffled.slice(0, 5).map(img => img.src));
            }
        };
        fetchImages();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [featuredPosts.length]);

    const currentPost = featuredPosts[currentSlide];

    return (
        <motion.section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className={styles.section}
            style={isLowPowerMode ? { opacity: 1, y: 0 } : { opacity, y }}
        >
            {/* Ambient Background */}
            {!isLowPowerMode && (
                <div className={styles.ambientBg}>
                    <div className={styles.glowRight} />
                    <div className={styles.glowLeft} />
                    <div className={styles.noiseOverlay} />
                </div>
            )}

            {/* Content Container */}
            <div className={styles.containerInner}>

                {/* Section Title & Gallery Access */}
                <div className={styles.header}>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className={styles.title}
                    >
                        FEATURE & <span className={styles.titleGradient}>Gallery</span>
                    </motion.h1>
                </div>

                {/* Main Bento Grid Spread */}
                <div className={styles.grid}>

                    {/* Hero Spotlight Card */}
                    <motion.div 
                        whileHover={{ y: -8, scale: 1.005 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={styles.spotlightCard}
                    >
                        <div className={styles.spotlightCardBg} />

                        <AnimatePresence initial={false}>
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                                className={styles.slideWrapper}
                            >
                                <Image
                                    src={currentPost.image}
                                    alt={currentPost.title}
                                    fill
                                    className={styles.slideImage}
                                />
                                <div className={styles.slideImageOverlay} />
                            </motion.div>
                        </AnimatePresence>

                        {/* Card Content */}
                        <div className={styles.spotlightCardContent}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={isLowPowerMode ? { opacity: 0 } : { opacity: 0, y: 20 }}
                                    animate={isLowPowerMode ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                    exit={isLowPowerMode ? { opacity: 0 } : { opacity: 0, y: -20 }}
                                    className="max-w-2xl"
                                >
                                    <div className={styles.carouselMeta}>
                                        <span className={styles.badgeFeatured}>
                                            Featured
                                        </span>
                                        <span className={styles.metaCategory}>
                                            {currentPost.category}
                                        </span>
                                    </div>
                                    <h2 className={styles.carouselHeading}>
                                        <Link href={`/blog/${currentPost.slug}`} className={styles.carouselHeadingLink}>
                                            {currentPost.title}
                                        </Link>
                                    </h2>
                                    <div className={styles.carouselFooter}>
                                        <Link
                                            href={`/blog/${currentPost.slug}`}
                                            className={styles.exploreLink}
                                        >
                                            Explore Story <ArrowUpRight className={styles.exploreLinkIcon} />
                                        </Link>
                                        <div className={styles.indicators}>
                                            {featuredPosts.map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={currentSlide === i ? styles.indicatorActive : styles.indicator}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Side Info Cards */}
                    <div className={styles.sideColumn}>

                        {/* Gallery Quick Access */}
                        <motion.div
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.3 }}
                            className={styles.galleryCardWrapper}
                        >
                            <GalleryButton
                                galleryImages={randomGalleryImages.length > 0
                                    ? randomGalleryImages
                                    : portfolioData.gallery
                                        .map(item => item.type === 'video' ? item.thumbnail : item.url)
                                        .filter((url) => !!url)
                                        .slice(0, 5)}
                            />
                        </motion.div>

                        {/* Stats & Trends Card */}
                        <motion.div 
                            whileHover={{ y: -8 }}
                            className={styles.trendsCard}
                        >
                            <div className={styles.trendsGlow} />

                            <div className={styles.trendsCardHeader}>
                                <TrendingUp className={styles.trendsIcon} />
                                <div className={styles.trendsCount}>{totalPosts}+</div>
                                <p className={styles.trendsLabel}>Articles Published</p>
                            </div>

                            <div className={styles.trendsCategories}>
                                {categoryStats.map((cat) => (
                                    <span key={cat.name} className={styles.trendsCategoryBadge}>
                                        {cat.name.replace(/-/g, ' ').replace(/development/i, 'dev')}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                    </div>
                </div>

                {/* Informational Footer Context */}
                <div className={styles.footer}>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className={styles.footerText}
                    >
                        This archive serves as a living documentation of technical blueprints, architectural patterns, and engineering reflections. 
                        All content is licensed under Creative Commons for educational use, bridging the gap between theory and implementation. 
                        Interactive gallery items represent curated milestones of the engineering journey. © 2026 Charan Kumar.
                    </motion.p>
                </div>

            </div>
        </motion.section>
    );
};
