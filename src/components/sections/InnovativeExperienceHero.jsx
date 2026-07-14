'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './InnovativeExperienceHero.module.css';

const NODES_DATA = {
    education: [
        { label: 'MIT, Jaipur', description: 'Master of Computer Applications (MCA) Student.', orbitIndex: 0, position: 0.2, imageUrl: "/logos/orbit_mit.png" },
        { label: 'Mangalore University', description: 'Bachelor of Computer Applications (BCA).', orbitIndex: 1, position: 0.7, imageUrl: "/logos/orbit_mangalore.png" }
    ],
    journey: [
        { label: 'AGREMATE', description: 'Software Developer (.NET).', orbitIndex: 0, position: 0.15, imageUrl: "/logos/orbit_agremate.png" },
        { label: 'MIT, Jaipur', description: 'MCA Student.', orbitIndex: 1, position: 0.45, imageUrl: "/logos/orbit_mit.png" },
        { label: 'NTSIPL', description: '.NET Developer.', orbitIndex: 0, position: 0.75, imageUrl: "/logos/orbit_ntsipl.png" },
        { label: 'Mangalore Univ', description: 'BCA Graduate.', orbitIndex: 1, position: 0.95, imageUrl: "/logos/orbit_mangalore.png" },
    ],
    experience: [
        { label: 'AGREMATE', description: 'Software Developer (.NET) - Building scalable APIs.', orbitIndex: 0, position: 0.2, imageUrl: "/logos/orbit_agremate.png" },
        { label: 'NTSIPL', description: 'Software Developer (.NET) - Microservices architecture.', orbitIndex: 1, position: 0.7, imageUrl: "/logos/orbit_ntsipl.png" },
    ]
};

const OUTER_PATH = "M 100,300 a 400,180 -15 1,0 800,0 a 400,180 -15 1,0 -800,0";
const INNER_PATH = "M 250,300 a 250,110 -15 1,0 500,0 a 250,110 -15 1,0 -500,0";

export function InnovativeExperienceHero({ type, title, highlight, description }) {
    const rawNodes = NODES_DATA[type] || NODES_DATA.experience;
    const [hoveredNode, setHoveredNode] = useState(null);

    return (
        <section className={styles.section}>
            <div className={styles.grid}>
                {/* Left Content Column */}
                <div className={styles.leftCol}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className={styles.contentInner}
                    >
                        <h2 className={styles.title}>
                            {title}<br />{highlight}
                        </h2>

                        <p className={styles.desc}>
                            {description}
                        </p>

                        <div className={styles.btnWrapper}>
                            <Link
                                href="/resume"
                                className={styles.btn}
                            >
                                <span>View resume</span> 
                                <ArrowRight className={styles.arrow} />
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Right Orbital Column */}
                <div className={styles.rightCol}>
                    {/* Responsive Container for Orbit */}
                    <div className={styles.orbitContainer}>
                        {/* SVG Orbital Paths (Tilted Ellipses) */}
                        <svg className={styles.svgPaths} viewBox="0 0 1000 600">
                            <path d={OUTER_PATH} className={styles.path} />
                            <path d={INNER_PATH} className={styles.path} />
                        </svg>

                        {/* Nodes */}
                        {rawNodes.map((node) => (
                            <OrbitalNode
                                key={node.label}
                                node={node}
                                isHovered={hoveredNode === node.label}
                                onHover={() => setHoveredNode(node.label)}
                                onLeave={() => setHoveredNode(null)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function OrbitalNode({ node, isHovered, onHover, onLeave }) {
    const path = node.orbitIndex === 0 ? INNER_PATH : OUTER_PATH;
    const isLeftSide = node.position < 0.25 || node.position > 0.75;

    return (
        <div
            className="absolute"
            style={{
                offsetPath: `path('${path}')`,
                offsetDistance: `${node.position * 100}%`,
                offsetRotate: '0deg',
                zIndex: isHovered ? 50 : 20
            }}
        >
            <div className="relative" onMouseEnter={onHover} onMouseLeave={onLeave}>
                <div className={styles.nodeWrapper}>
                    <button
                        onMouseEnter={onHover}
                        onMouseLeave={onLeave}
                        className={isHovered ? styles.nodeBtnActive : styles.nodeBtn}
                    >
                        <Plus className={isHovered ? styles.plusIconRotated : styles.plusIcon} />
                    </button>

                    {/* Detail Card (Image 4 Style) */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
                                animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                                exit={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
                                className={styles.detailCardWrapper}
                            >
                                <div className={styles.detailCard}>
                                    {/* Tail to node */}
                                    <div className={styles.detailTail} />
                                    <div className={styles.detailHeader}>
                                        <h4 className={styles.detailTitle}>{node.label}</h4>
                                        <p className={styles.detailDesc}>
                                            {node.description}
                                        </p>
                                    </div>

                                    {/* Image Visualization Area */}
                                    <div className={styles.detailImageArea}>
                                        {node.imageUrl ? (
                                            <Image src={node.imageUrl} alt={node.label} fill className="object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-white/20 dark:text-black/20 font-mono">
                                                Visualization Area
                                            </div>
                                        )}
                                        <div className={styles.detailGradient} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* The Label */}
                <div className={isLeftSide ? styles.nodeLabelWrapperLeft : styles.nodeLabelWrapperRight}>
                    <span className={isHovered ? styles.nodeLabelActive : styles.nodeLabel}>
                        {node.label}
                    </span>
                </div>
            </div>
        </div>
    );
}
