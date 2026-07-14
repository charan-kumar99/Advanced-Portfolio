"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import styles from "./NarrativeBridge.module.css";

export default function NarrativeBridge() {
    return (
        <section className={styles.section}>

            {/* Background Texture */}
            <div className={styles.noiseOverlay} />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={styles.contentInner}
            >
                <div className={styles.iconContainer}>
                    <div className={styles.iconWrapper}>
                        <BookOpen className={styles.icon} />
                    </div>
                </div>

                <h2 className={styles.title}>
                    You've seen the <span className={styles.titleItalic}>results</span>.
                    <br />
                    Now read the <span className={styles.titleAccent}>process</span>.
                </h2>

                <p className={styles.desc}>
                    Every image in this archive has a story behind it.
                    Explore the technical deep-dives and creative journals in the blog.
                </p>

                <Link href="/blog" className={styles.actionLink}>
                    <span>Enter the Archives</span>
                    <ArrowRight className={styles.arrowIcon} />
                </Link>

            </motion.div>

            {/* Decorative Blog Preview (Abstract) */}
            <div className={styles.bottomFade} />

        </section>
    );
}
