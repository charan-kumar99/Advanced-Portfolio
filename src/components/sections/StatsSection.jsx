"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { Book } from "@/components/ui/book";
import { portfolioData } from "@/data/portfolio";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./StatsSection.module.css";

const CATEGORY_COLORS = {
    'applied-ai': '#9D2127',
    'software-development': '#7DC1C1',
    'more': '#FED954',
};

export default function StatsSection({ scrollYProgress, showOnly }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const blogs = portfolioData.blogs.slice(0, 6);
    const visibleCount = 3;

    useEffect(() => {
        const galleryImages = [
            { src: '/gallery/coding3.png', alt: 'Development Phase 1' },
            { src: '/gallery/coding1.png', alt: 'Coding Session 1' },
            { src: '/gallery/coding2.png', alt: 'Architecture Design' },
            { src: '/gallery/coding3.png', alt: 'Team Collaboration' },
            { src: '/gallery/coding1.png', alt: 'Project Milestone' },
            { src: '/gallery/coding2.png', alt: 'Deployment' },
            { src: '/gallery/coding1.png', alt: 'Agile Meeting' },
            { src: '/gallery/coding2.png', alt: 'Tech Sync' },
            { src: '/gallery/coding3.png', alt: 'Database Planning' },
            { src: '/gallery/coding1.png', alt: 'Leadership' },
            { src: '/gallery/coding2.png', alt: 'Community Coding' },
            { src: '/gallery/coding3.png', alt: 'Tech Workshop' },
            { src: '/gallery/coding1.png', alt: 'Project Management' },
            { src: '/gallery/coding2.png', alt: 'R&D Phase 1' },
            { src: '/gallery/coding3.png', alt: 'R&D Phase 2' },
        ];
        const shuffledImages = [...galleryImages].sort(() => 0.5 - Math.random());
        setImages(shuffledImages);
        setLoading(false);
    }, []);

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % blogs.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + blogs.length) % blogs.length);
    };

    const getVisibleBlogs = () => {
        if (!blogs || blogs.length === 0) return [];
        const result = [];
        for (let i = 0; i < visibleCount; i++) {
            result.push(blogs[(currentIndex + i) % blogs.length]);
        }
        return result;
    };

    if (loading || images.length === 0) return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
        </div>
    );

    return (
        <section className={styles.section}>
            {/* Header for the Gallery Section */}
            {(showOnly === 'top' || !showOnly) && (
                <>
                    <div className={styles.header}>
                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={styles.headerTitle}
                        >
                            Journal & Insights
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className={styles.headerDesc}
                        >
                            A curated collection of technical articles, engineering blueprints, and reflections on building robust software.
                        </motion.p>
                    </div>

                    {/* Immersive Zoom Parallax Component */}
                    <div className={styles.parallaxWrapper}>
                        <ZoomParallax images={images}>
                            <Link 
                                href="/gallery" 
                                className={styles.galleryBtn}
                            >
                                <span>View Gallery</span>
                                <ArrowUpRight className={styles.galleryBtnIcon} />
                            </Link>
                        </ZoomParallax>
                    </div>
                </>
            )}

            {/* Book Showcase Integration */}
            {(showOnly === 'bottom' || !showOnly) && (
                <div className={styles.bookShowcaseWrapper}>
                    <div className={styles.showcaseHeader}>
                        <div className={styles.showcaseHeadingSection}>
                            <h3 className={styles.showcaseTitle}>
                                Latest Stories
                            </h3>
                            <p className={styles.showcaseSub}>Articles • Insights • Technical Deep Dives</p>
                        </div>
                        <Link href="/blog" className={styles.archiveLink}>
                            <span>Browse Full Archive</span>
                            <ArrowUpRight className={styles.archiveLinkIcon} />
                        </Link>
                    </div>

                    <div className={styles.sliderGroup}>
                        {/* Navigation Buttons */}
                        <div className={styles.navBtnLeft}>
                            <button
                                onClick={prevSlide}
                                className={styles.navBtn}
                            >
                                <ChevronLeft className={styles.navIcon} />
                            </button>
                        </div>

                        <div className={styles.navBtnRight}>
                            <button
                                onClick={nextSlide}
                                className={styles.navBtn}
                            >
                                <ChevronRight className={styles.navIcon} />
                            </button>
                        </div>

                        {/* Mobile Navigation */}
                        <div className={styles.navMobileContainer}>
                            <button
                                onClick={prevSlide}
                                className={styles.navBtnMobile}
                            >
                                <ChevronLeft className={styles.navIconMobile} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className={styles.navBtnMobile}
                            >
                                <ChevronRight className={styles.navIconMobile} />
                            </button>
                        </div>

                        <div className={styles.sliderViewport}>
                            <div className={styles.sliderTrack}>
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {getVisibleBlogs().map((blog, index) => (
                                        <motion.div
                                            key={blog.id}
                                            layout
                                            initial={{ opacity: 0, x: direction * 50, scale: 0.9, filter: "blur(10px)" }}
                                            animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, x: direction * -50, scale: 0.9, filter: "blur(10px)" }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 26,
                                            }}
                                            className={styles.bookCard}
                                        >
                                            <Link href={`/blog/${blog.slug}`} className={styles.bookLink}>
                                                {/* Glow Effect */}
                                                <div
                                                    className={styles.bookGlow}
                                                    style={{
                                                        background: `radial-gradient(circle, ${CATEGORY_COLORS[blog.category]} 0%, transparent 70%)`,
                                                    }}
                                                />

                                                <Book
                                                    title={blog.title}
                                                    color={CATEGORY_COLORS[blog.category] || '#222222'}
                                                    textColor={
                                                        (index % 2 !== 0 && blog.category === 'applied-ai')
                                                            ? '#FFFFFF'
                                                            : 'var(--ds-gray-1000)'
                                                    }
                                                    variant={index % 2 === 0 ? 'stripe' : 'simple'}
                                                    textured
                                                    width={{ sm: 160, md: 220, lg: 260 }}
                                                />

                                                <div className={styles.bookMeta}>
                                                    <div className={styles.metaRow}>
                                                        <span className={styles.metaCategory}>
                                                            {blog.category.replace(/-/g, ' ')}
                                                        </span>
                                                        <span className={styles.metaYear}>
                                                            {new Date(blog.date).getFullYear()}
                                                        </span>
                                                    </div>
                                                    <p className={styles.bookExcerpt}>
                                                        {blog.excerpt}
                                                    </p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className={styles.archiveLinkMobile}>
                        <Link href="/blog" className={styles.archiveLink}>
                            <span>Browse Full Archive</span>
                            <ArrowUpRight className={styles.archiveLinkIcon} />
                        </Link>
                    </div>
                </div>
            )}
        </section>
    );
}
