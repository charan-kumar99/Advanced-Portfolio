"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import ImageTrail from "@/components/ImageTrail";
import Image from "next/image";
import { portfolioData } from "@/data/portfolio";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import Testimonial1 from "@/components/ui/testimonial-1";
import { IdentitySequence } from "./IdentitySequence";
import ScrollAdventure from "@/components/ui/animated-scroll";
import { ArgentLoopInfiniteSlider } from "@/components/ui/argent-loop-infinite-slider";
import { HorizontalTimeline } from "@/components/ui/horizontal-timeline";
import { CertificateShowcase } from "@/components/ui/certificate-marquee";
import { GitHubShowcase } from "@/components/ui/github-showcase";
import { ShowcaseStack } from "@/components/ui/showcase-stack";
import styles from "./AboutSection.module.css";

const showcaseMembers = [
    // 1. AGREMATE
    ...portfolioData.experiences.filter(exp => exp.id === 'prof-1').map(exp => ({
        id: exp.id,
        name: exp.company,
        role: `${exp.position}${exp.location ? ` (${exp.location})` : ''}`,
        description: exp.description,
        period: exp.startDate + " - Present",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1964&auto=format&fit=crop", // Computer / code image
        social: exp.externalLink ? { website: exp.externalLink } : undefined
    })),
    // 2. NTSIPL
    ...portfolioData.experiences.filter(exp => exp.id === 'prof-2').map(exp => ({
        id: exp.id,
        name: exp.company,
        role: `${exp.position}${exp.location ? ` (${exp.location})` : ''}`,
        description: exp.description,
        period: "Dec 2025 - Jun 2026",
        image: "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1964&auto=format&fit=crop", // Software development image
        social: exp.externalLink ? { website: exp.externalLink } : undefined
    })),
    // 3. View more
    {
        id: 'view-more',
        name: 'View more',
        role: 'Explore all experiences',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop',
        social: { website: '/experience' }
    }
];

const GALLERY_IMAGES = [
    "/gallery/coding3.png",
    "/gallery/coding1.png",
    "/gallery/coding2.png",
    "/gallery/coding3.png",
    "/gallery/coding1.png",
    "/gallery/coding2.png",
    "/gallery/coding1.png",
    "/gallery/coding2.png",
    "/gallery/coding3.png",
    "/gallery/coding1.png",
    "/gallery/coding2.png",
    "/gallery/coding3.png",
    "/gallery/coding1.png",
    "/gallery/coding2.png",
    "/gallery/coding3.png"
];

const AboutLeadInImageStack = () => {
    const [randomData, setRandomData] = useState([]);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!mounted) return;
        const shuffled = [...GALLERY_IMAGES].sort(() => 0.5 - Math.random()).slice(0, 2);
        const data = shuffled.map((src, i) => {
            const offsetMultiplier = i === 0 ? -1 : 1;
            return {
                src,
                rotate: Math.round(offsetMultiplier * 15 + (Math.random() * 8 - 4)),
                x: Math.round(offsetMultiplier * 25 + (Math.random() * 10 - 5)),
                y: Math.round(Math.random() * 10 - 5),
            };
        });
        setRandomData(data);
    }, [mounted]);

    if (!mounted || randomData.length === 0) return null;

    return (
        <div className={styles.imageStackContainer}>
            {randomData.map((item, i) => (
                <div
                    key={item.src}
                    className={styles.imageStackItem}
                    style={{
                        zIndex: i === 1 ? 20 : 10,
                        transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`,
                    }}
                >
                    <div className={styles.imageWrapper}>
                        <Image
                            src={item.src}
                            alt="Gallery Piece"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100px, 120px"
                            priority={i === 1}
                        />
                        <div className={styles.imageStackOverlay} />
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Component 1: Editorial Lead-in ---
const AboutLeadIn = () => {
    const t = useTranslations('about');

    return (
        <div className={styles.leadInOuter}>
            <div className={styles.leadInCard}>
                {/* 1. Grid Background Overlay (Dynamic Colors) */}
                <div className={styles.gridOverlay} />

                {/* 2. Red Corner Tabs */}
                <div className={styles.cornerTopLeft} />
                <div className={styles.cornerTopRight} />
                <div className={styles.cornerBottomLeft} />
                <div className={styles.cornerBottomRight} />

                {/* 3. Content Layer */}
                <div className={styles.leadInContent}>
                    {/* Top Tagline */}
                    <div className={styles.leadInHeader}>
                        <span className={styles.believeTag}>I BELIEVE</span>
                        <span className={styles.roleTag}>{t('leadIn.role')}</span>
                    </div>

                    {/* Massive Typography - Quote Style */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.leadInQuoteSection}
                    >
                        <h2 className={styles.leadInHeading}>
                            <span className={styles.quoteMark}>"</span>
                            {t('leadIn.applied')} <span className={styles.headingMutedText}>{t('leadIn.intelligence')}</span>. <br className="hidden md:block" />
                            <span>because</span> production <span className={styles.italicSerifText}>{t('leadIn.engineering')}</span>
                            <span className={styles.leadInQuoteSectionClose}>.."</span>
                        </h2>
                    </motion.div>

                    {/* Detail Grid */}
                    <div className={styles.detailGrid}>
                        {/* Left narrative */}
                        <div className={styles.thesisColumn}>
                            <p
                                className={styles.thesisText}
                                dangerouslySetInnerHTML={{ __html: t.raw('leadIn.thesis') }}
                            />
                        </div>

                        {/* Right columns */}
                        <div className={styles.detailsColumn}>
                            <div className={styles.detailsSubCol}>
                                <span className={styles.subColTitle}>Scope & Platform</span>
                                <p className={styles.subColDesc}>
                                    {t('leadIn.scope')}
                                </p>
                                <p className={styles.subColEmphasis}>
                                    {t('leadIn.bridging')}
                                </p>
                            </div>
                            <div className={styles.detailsSubCol}>
                                <span className={styles.subColTitle}>Integration</span>
                                <p className={styles.subColDesc}>
                                    {t('leadIn.integration')}
                                </p>
                                <div className={styles.signatureWrapper}>
                                    <span className={styles.signatureText}>{t('leadIn.signature')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Component 2: Core Engineering Panel ---
const CoreEngineeringPanel = ({ scrollYProgress }) => {
    // Panel 1 exits between 0.45 and 0.65
    const opacity = useTransform(scrollYProgress, [0.45, 0.6], [1, 0]);
    const scale = useTransform(scrollYProgress, [0.45, 0.6], [1, 0.9]);
    const blur = useTransform(scrollYProgress, [0.45, 0.6], [0, 10]);

    return (
        <div className={styles.panelContainer}>
            <motion.div
                style={{
                    opacity,
                    scale,
                    filter: `blur(${blur}px)`,
                    willChange: "transform, opacity, filter",
                }}
                className={styles.panelInner}
            >
                <Testimonial1 />
            </motion.div>
        </div>
    );
};

// --- Component 5: Audit Funnel ---
const AuditFunnel = () => {
    const isMobile = useIsMobile();
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });
    const t = useTranslations('about');
    const tCommon = useTranslations('common');

    const scale = useTransform(scrollYProgress, [0, 0.5], [0.6, 1]);
    const lineScaleY = useTransform(scrollYProgress, [0.3, 0.8], [0, 1]);

    const [images, setImages] = useState([]);

    useEffect(() => {
        const galleryItems = [
            "/gallery/coding3.png",
            "/gallery/coding1.png",
            "/gallery/coding2.png",
            "/gallery/coding3.png",
            "/gallery/coding1.png",
            "/gallery/coding2.png",
            "/gallery/coding1.png",
            "/gallery/coding2.png",
            "/gallery/coding3.png",
            "/gallery/coding1.png",
            "/gallery/coding2.png",
            "/gallery/coding3.png",
            "/gallery/coding1.png",
            "/gallery/coding2.png",
            "/gallery/coding3.png"
        ];
        const shuffled = [...galleryItems].sort(() => 0.5 - Math.random());
        setImages(shuffled.slice(0, 8));
    }, []);

    return (
        <div ref={sectionRef} className={styles.auditContainer}>
            <motion.div
                className={styles.auditContent}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
            >
                <div className={styles.auditTextSection}>
                    <motion.h4
                        style={{ scale, willChange: "transform" }}
                        className={styles.auditHeading}
                    >
                        {t('architecting')} <br></br>
                        <motion.span
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className={styles.auditHeadingAccent}
                        >
                            {t('digitalReality')}
                        </motion.span>.
                    </motion.h4>
                </div>

                <div className={styles.auditScrollSection}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className={styles.auditScrollLabel}
                    >
                        {tCommon('scrollAudit')}
                    </motion.div>
                    <div className={styles.auditScrollLineContainer}>
                        <motion.div
                            style={{ scaleY: lineScaleY }}
                            className={styles.auditScrollLine}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Image Trail Layer - Disabled on Mobile for performance */}
            {!isMobile && (
                <div className={styles.trailLayer}>
                    <ImageTrail items={images} variant={3} />
                </div>
            )}

            {/* Subtle Grain Texture Overlay */}
            <div className={styles.grainOverlay}>
                <div className={styles.grainBg} />
            </div>
        </div>
    );
};

const ScrollHijackSection = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: sectionRef });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25, mass: 0.5 });
    const [isComp2Visible, setIsComp2Visible] = React.useState(false);
    const [showBorder, setShowBorder] = React.useState(true);

    const borderOpacity = useTransform(smoothProgress, [0.1, 0.15], [1, 0]);
    const xShift = useTransform(smoothProgress, [0, 0.1, 0.4, 1], ["0vw", "0vw", "-100vw", "-100vw"]);

    useMotionValueEvent(smoothProgress, "change", (v) => {
        if (v >= 0.20 && showBorder) setShowBorder(false);
        if (v < 0.15 && !showBorder) setShowBorder(true);

        if (v >= 0.30 && !isComp2Visible) setIsComp2Visible(true);
        if (v < 0.25 && isComp2Visible) setIsComp2Visible(false);
    });

    const { scrollYProgress: exitProgressRaw } = useScroll({
        target: sectionRef,
        offset: ["end end", "end start"]
    });

    const exitProgress = useSpring(exitProgressRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const exitScale = useTransform(exitProgress, [0, 1], [1, 0.85]);
    const exitOpacity = useTransform(exitProgress, [0, 1], [1, 0]);
    const exitBorderRadius = useTransform(exitProgress, [0, 1], ["0px", "40px"]);

    return (
        <div ref={sectionRef} className={styles.hijackContainer}>
            <div className={styles.stickyWrapper}>
                <motion.div
                    style={{ scale: exitScale, opacity: exitOpacity, borderRadius: exitBorderRadius }}
                    className={styles.exitContainer}
                >
                    <AnimatePresence>
                        {showBorder && (
                            <motion.div
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                                style={{
                                    opacity: borderOpacity,
                                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
                                }}
                                className={styles.borderDecoration}
                            />
                        )}
                    </AnimatePresence>
                    <motion.div
                        className={styles.slideTrack}
                        style={{
                            x: xShift
                        }}
                    >
                        <div className={styles.slideScreen}>
                            <CoreEngineeringPanel scrollYProgress={smoothProgress} />
                        </div>
                        <div className={styles.slideScreen}>
                            <IdentitySequence isVisible={isComp2Visible} scrollYProgress={smoothProgress} />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default function AboutSection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.12], [1, 0.92]);
    const opacity = useTransform(scrollYProgress, [0.03, 0.12], [1, 0]);
    const yLeadIn = useTransform(scrollYProgress, [0, 0.12], [0, -80]);

    const leadInTriggerRef = useRef(null);

    return (
        <section
            id="about"
            ref={containerRef}
            className={styles.section}
        >
            {/* 1. STICKY PLANE - Lead-in */}
            <div className={styles.stickyLeadIn}>
                <motion.div
                    style={{ scale, opacity, y: yLeadIn }}
                    className={styles.leadInInner}
                    ref={leadInTriggerRef}
                >
                    <AboutLeadIn />
                </motion.div>
            </div>

            {/* 2. OVERLAY LAYER - Hijack Zone & Footer */}
            <div className={styles.overlayLayer}>
                <div className={styles.contentWrapper}>
                    <ScrollHijackSection />
                    <ScrollAdventure />
                    <ArgentLoopInfiniteSlider />
                    
                    <HorizontalTimeline data={showcaseMembers.map((member) => ({
                        title: member.id === 'view-more' ? 'Explore all experiences' : (member.role || member.name),
                        isEnd: member.id === 'view-more',
                        period: member.period,
                        content: member.id === 'view-more' ? (
                            <div className="relative flex items-center h-[140px] w-[250px] z-30 group">
                                <Link
                                    href={member.social?.website || '/experience'}
                                    className="flex items-center gap-4 cursor-pointer"
                                >
                                    <div className="p-4 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                                        <ArrowUpRight className="w-8 h-8 text-neutral-600 dark:text-neutral-400 transition-all duration-500 group-hover:text-primary-foreground group-hover:rotate-45 group-hover:scale-110" />
                                    </div>
                                    <span className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap drop-shadow-sm">
                                        View more
                                    </span>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 w-[320px] md:w-[400px] border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md shadow-xl mt-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-row items-center justify-between">
                                        <h4 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight">
                                            {member.name}
                                        </h4>
                                    </div>
                                </div>

                                {member.description && (
                                    <p className="text-sm font-normal text-neutral-600 dark:text-neutral-400 leading-relaxed mt-1 line-clamp-3" title={member.description}>
                                        {member.description}
                                    </p>
                                )}

                                <div className="w-full mt-4 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden relative group/card h-32">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover opacity-90 group-hover/card:opacity-100 transition-opacity duration-500 group-hover/card:scale-105"
                                    />
                                    {member.social?.website && (
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                            <Link href={member.social.website} target="_blank" className="px-5 py-2.5 bg-white text-black text-xs font-bold rounded-full hover:scale-105 transition-transform">
                                                View Details
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }))} />

                    <div className={styles.solidBgSection}>
                        {/* Certificate Showcase Section */}
                        <div className={styles.showcaseStackSection}>
                            <CertificateShowcase />
                        </div>

                        {/* Stacking Card Showcases */}
                        <ShowcaseStack>
                            <div className={styles.fullWidth}>
                                <GitHubShowcase />
                            </div>
                        </ShowcaseStack>
                    </div>
                    <AuditFunnel />
                </div>
            </div>
        </section >
    );
}
