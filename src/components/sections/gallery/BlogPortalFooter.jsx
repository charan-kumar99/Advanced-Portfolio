"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import styles from "./BlogPortalFooter.module.css";

export default function BlogPortalFooter({ isLowPowerMode }) {
    const [hoveredBlog, setHoveredBlog] = useState(null);
    const frameRef = useRef(null);

    const latestBlogs = portfolioData.blogs.slice(0, 3);

    const handleHover = (image) => {
        if (isLowPowerMode) return;

        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
        }

        frameRef.current = requestAnimationFrame(() => {
            setHoveredBlog(image);
        });
    };

    useEffect(() => {
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, []);

    return (
        <section className={styles.section}>

            <div className={styles.containerInner}>

                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <span className={styles.subtitle}>
                            Knowledge Base
                        </span>
                        <h2 className={styles.title}>
                            The Engineering<br />
                            <span className={styles.titleItalic}>Process.</span>
                        </h2>
                    </div>
                    <div className={styles.headerLinkWrapper}>
                        <Link href="/blog" className={styles.headerLink}>
                            <span>View All Articles</span>
                            <ArrowRight className={styles.headerLinkIcon} />
                        </Link>
                    </div>
                </div>

                {/* Editorial List */}
                <div className={styles.list}>
                    {latestBlogs.map((blog, index) => (
                        <Link key={blog.id} href={`/blog/${blog.slug}`} className={styles.itemLink}>
                            <div
                                className={styles.itemRow}
                                onMouseEnter={() => handleHover(blog.image)}
                                onMouseLeave={() => handleHover(null)}
                            >
                                <span className={styles.itemNum}>
                                    0{index + 1} //
                                </span>

                                <div className={styles.itemContent}>
                                    <h3 className={isLowPowerMode ? styles.itemTitle : styles.itemTitleHovered}>
                                        {blog.title}
                                    </h3>
                                    <div className={isLowPowerMode ? styles.itemMeta : styles.itemMetaHovered}>
                                        <span className={styles.itemMetaCategory}>{blog.category}</span>
                                        <span>{blog.readTime} min read</span>
                                    </div>
                                </div>

                                <div className={styles.arrowWrapper}>
                                    <ArrowUpRight className={styles.arrowIcon} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Large CTA at bottom */}
                <div className={styles.ctaSection}>
                    <p className={styles.ctaQuote}>
                        "Documenting the journey from concept to deployment."
                    </p>
                    <Link href="/blog">
                        <button className={styles.ctaBtn}>
                            Read the Journal
                        </button>
                    </Link>
                </div>

            </div>

            {/* Background Image Preview (Hover Reveal) */}
            <AnimatePresence>
                {hoveredBlog && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={styles.hoveredBgContainer}
                    >
                        <div className={styles.hoveredBgInner}>
                            <Image
                                src={hoveredBlog}
                                alt="Blog Preview"
                                fill
                                loading="lazy"
                                className={styles.hoveredBgImage}
                            />
                        </div>

                        {/* Gradient Overlay to ensure text readability */}
                        <div className={styles.gradientOverlay} />
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}
