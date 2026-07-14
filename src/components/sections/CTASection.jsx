"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { Mail, Layers } from "lucide-react";
import { InfiniteRibbon } from "@/components/ui/infinite-ribbon";
import styles from "./CTASection.module.css";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function CTASection() {
    const sectionRef = useRef(null);
    const t = useTranslations('ctaSection');
    const words = [t('words.amazing'), t('words.innovative'), t('words.scalable'), t('words.creative')];
    const [currentWord, setCurrentWord] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [words.length]);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo('.cta-content-js',
                { y: 80, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className={styles.section}>
            {/* Infinite Ribbons - Moved from Stats Section */}
            <div className={styles.ribbonsWrapper}>
                <InfiniteRibbon rotation={6} className={styles.ribbon1} background="bg-white dark:bg-zinc-900" textColor="text-blue-700 dark:text-zinc-400 font-mono tracking-tighter">
                    {t('ribbon1')}
                </InfiniteRibbon>
                <InfiniteRibbon rotation={-6} reverse={true} className={styles.ribbon2} background="bg-blue-600 dark:bg-black" textColor="text-white font-bold tracking-widest uppercase">
                    {t('ribbon2')}
                </InfiniteRibbon>
            </div>

            <div className={`${styles.content} cta-content-js`}>
                <h2 className={styles.title}>
                    {t('title')}
                    <br />
                    <span className={styles.wordGrid}>
                        {/* Invisible longest word ensures the container NEVER changes width/height */}
                        <span className={styles.invisibleWord}>
                            {words.reduce((a, b) => a.length > b.length ? a : b, "")}
                        </span>
                        <AnimatePresence>
                            <motion.span
                                key={words[currentWord]}
                                initial={{ y: 50, opacity: 0, rotateX: -90 }}
                                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                exit={{ y: -50, opacity: 0, rotateX: 90 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className={styles.visibleWord}
                            >
                                {words[currentWord]}
                            </motion.span>
                        </AnimatePresence>
                    </span>
                    <span className="whitespace-nowrap">{t('together')}</span>
                </h2>

                <p className={styles.subtitle}>
                    {t('subtitle')}
                </p>

                <div className={styles.buttonGroup}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/contact" className={styles.btnCreative}>
                            <Mail className="w-5 h-5" />
                            <span>{t('start')}</span>
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/resume" className={styles.btnOutlineCreative}>
                            <Layers className="w-5 h-5" />
                            <span>{t('work')}</span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
