'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Terminal, Activity, Zap, Cpu, ChevronRight, Boxes, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './SystemPipeline.module.css';

export const SystemPipeline = ({ tools, className }) => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(tools.length - 1) * 25}%`]);

    const [logs, setLogs] = useState([]);
    useEffect(() => {
        const interval = setInterval(() => {
            const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
            const newLog = `> TRACE_PROTO_${hex}: VERIFIED`;
            setLogs(prev => [newLog, ...prev].slice(0, 12));
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const decorations = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 500}%`,
        size: Math.random() * 300 + 100,
        opacity: Math.random() * 0.05 + 0.02
    })), []);

    return (
        <section ref={targetRef} className={cn(styles.section, className)}>
            <div className={styles.stickyBox}>

                {/* Background Schematic Layer (Static Grid) */}
                <div className={styles.bgSchematic}>
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="dense-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                                <circle cx="50" cy="50" r="0.5" fill="currentColor" />
                                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.2" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#dense-grid)" />
                    </svg>
                </div>

                {/* Horizontal Kinetic Track */}
                <motion.div style={{ x }} className={styles.track}>

                    {/* Background Moving Schematics (Decorations) */}
                    {decorations.map((dec, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                top: dec.top,
                                left: dec.left,
                                width: dec.size,
                                height: dec.size,
                                opacity: dec.opacity,
                                pointerEvents: 'none',
                                zIndex: -1
                            }}
                        >
                            <svg viewBox="0 0 100 100" width="100%" height="100%">
                                <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.2" />
                                <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.1" />
                            </svg>
                        </div>
                    ))}

                    {/* The Connecting Pipeline Wire */}
                    <div className={styles.wire}>
                        <motion.div
                            className={styles.glowWire}
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>

                    {tools.map((tool, idx) => (
                        <div key={tool.name} className={styles.nodeGroup}>

                            {/* "Phantom" Decoration Node (Precedes actual nodes) */}
                            {idx % 2 === 0 && (
                                <div className={styles.phantom}>
                                    <div className={styles.phantomCircle}>
                                        <Boxes size={32} />
                                    </div>
                                    <span className={styles.phantomLabel}>PHANTOM_TRACE_0x{idx}</span>
                                </div>
                            )}

                            {/* Main Tool Node */}
                            <div className={styles.mainNode}>
                                <motion.div
                                    whileHover={{ y: -15, scale: 1.02 }}
                                    className={styles.card}
                                >
                                    <div className={styles.cardLine} />

                                    <div className={styles.cardHeader}>
                                        <div className={styles.iconWrapper}>
                                            <Image
                                                src={tool.icon}
                                                alt={tool.name}
                                                fill
                                                className={styles.img}
                                                unoptimized
                                            />
                                        </div>
                                        <div className={styles.cardMeta}>
                                            <h3 className={styles.cardTitle}>
                                                {tool.name}
                                            </h3>
                                            <div className={styles.syncRow}>
                                                <div className={styles.syncDot} />
                                                <span className={styles.syncText}>
                                                    SYNCED // STABLE
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.cardBody}>
                                        <div className={styles.infoRow}>
                                            <div className={styles.archTitle}>
                                                <Radio size={12} className={styles.radioIcon} />
                                                <span className={styles.archLabel}>Node_Architecture</span>
                                            </div>
                                            <span className={styles.archSys}>X_{idx}_SYS</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '92%' }}
                                                transition={{ duration: 1.5, delay: 0.2 }}
                                                className={styles.progressFill}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Enhanced Pipe Joiner */}
                            {idx < tools.length - 1 && (
                                <div className={styles.pipeJoiner}>
                                    <div className={styles.activityCircle}>
                                        <Activity size={10} className="text-primary" />
                                        <motion.div
                                            className={styles.activityPulse}
                                            animate={{ scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
                                            transition={{ duration: 4, repeat: Infinity, delay: idx * 0.8 }}
                                        />
                                    </div>
                                    {/* Flow Particles */}
                                    <motion.div
                                        className={styles.flowParticle}
                                        animate={{ x: [-80, 80], opacity: [0, 1, 0] }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </motion.div>

                {/* Professional Overlay UI */}
                <div className={styles.topOverlay}>
                    <span>SYSTEM_GRID_ARCHITECTURE</span>
                    <div className={styles.overlayLine} />
                    <span>KERNEL_RESOURCES_V8</span>
                </div>

                {/* Bottom Left: Logic Logs */}
                <div className={styles.consolePanel}>
                    <div className={styles.consoleHeader}>
                        <div className={styles.consoleTitle}>
                            <Cpu size={14} /> Process_Console
                        </div>
                        <span className={styles.consoleMeta}>L_V8</span>
                    </div>
                    <div className={styles.consoleLogs}>
                        {logs.map((log, i) => (
                            <div key={i} className={styles.logRow}>
                                <span className={styles.logTime}>[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                                <span className={styles.logText}>{log}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Scroll Meta */}
                <div className={styles.sideScroll}>
                    <div className={styles.sideLine}>
                        <motion.div
                            className={styles.sideProgress}
                            style={{ height: scrollYProgress }}
                        />
                    </div>
                    <span className={styles.sideLabel}>FLOW_COORDINATE</span>
                </div>
            </div>
        </section>
    );
};
