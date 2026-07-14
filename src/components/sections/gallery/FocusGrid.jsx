"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { portfolioData } from "@/data/portfolio";
import { X } from "lucide-react";
import styles from "./FocusGrid.module.css";

export default function FocusGrid() {
    const containerRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [selectedId, setSelectedId] = useState(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const openLightbox = (id) => setSelectedId(id);
    const closeLightbox = () => setSelectedId(null);

    const selectedItem = portfolioData.gallery.find(item => item.id === selectedId);

    return (
        <section
            id="focus-grid"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className={styles.section}
        >
            {/* The blurry "Fog" Overlay using CSS Masking for the Lens Effect */}
            <div
                className={styles.lensOverlay}
                style={{
                    backdropFilter: "blur(10px) grayscale(100%) contrast(0.8)",
                    WebkitBackdropFilter: "blur(10px) grayscale(100%) contrast(0.8)",
                    maskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`,
                    WebkitMaskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`,
                }}
            />

            {/* The "Clean" Grid underneath */}
            <div className={styles.gridWrapper}>
                {portfolioData.gallery.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.05 }}
                        className={styles.card}
                        onClick={() => openLightbox(item.id)}
                    >
                        <div className={styles.imageWrapper}>
                            <Image
                                src={item.thumbnail || item.url}
                                alt={item.title}
                                width={800}
                                height={600}
                                className={styles.cardImage}
                            />

                            <div className={styles.cardOverlay} />

                            <div className={styles.caption}>
                                <p className={styles.category}>{item.category}</p>
                                <h3 className={styles.title}>{item.title}</h3>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Cinematic Lightbox */}
            <AnimatePresence>
                {selectedId && selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.lightbox}
                        onClick={closeLightbox}
                    >
                        {/* Close Button */}
                        <button onClick={closeLightbox} className={styles.closeBtn}>
                            <span className={styles.closeText}>Close Sequence</span>
                            <X className={styles.closeIcon} />
                        </button>

                        <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>

                            {/* Media */}
                            <div className={styles.mediaWrapper}>
                                {selectedItem.type === 'video' ? (
                                    <iframe
                                        src={selectedItem.url}
                                        className="w-full h-full"
                                        allow="autoplay; fullscreen"
                                    />
                                ) : (
                                    <Image
                                        src={selectedItem.url}
                                        alt={selectedItem.title}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                )}
                            </div>

                            {/* Narrative Sidebar */}
                            <div className={styles.sidebar}>
                                <div>
                                    <p className={styles.sidebarSeqId}>
                                        Sequence_ID: {selectedItem.id}
                                    </p>
                                    <h2 className={styles.sidebarTitle}>
                                        {selectedItem.title}
                                    </h2>
                                    <div className={styles.sidebarDivider} />
                                    <p className={styles.sidebarDesc}>
                                        {selectedItem.description}
                                    </p>
                                </div>

                                <div className={styles.sidebarGrid}>
                                    <div>
                                        <p className={styles.metaHeader}>Date Captured</p>
                                        <p className={styles.metaValue}>{selectedItem.date}</p>
                                    </div>
                                    <div>
                                        <p className={styles.metaHeader}>Format</p>
                                        <p className={styles.metaValue}>{selectedItem.type === 'video' ? 'MP4 / H.264' : 'WEBP / Lossless'}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}
