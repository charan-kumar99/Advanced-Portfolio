'use client';

import React, { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import styles from './TechConstellation.module.css';

export const TechConstellation = ({ items, className }) => {
    const containerRef = useRef(null);

    const nodes = useMemo(() => {
        return items.map((item, i) => ({
            ...item,
            id: i,
            x: Math.random() * 90 + 5,
            y: Math.random() * 90 + 5,
            size: 40 + Math.random() * 20
        }));
    }, [items]);

    const connections = useMemo(() => {
        const lines = [];
        for (let i = 0; i < nodes.length; i++) {
            const targets = nodes
                .map((node, idx) => ({ idx, dist: Math.hypot(node.x - nodes[i].x, node.y - nodes[i].y) }))
                .filter(t => t.idx !== i)
                .sort((a, b) => a.dist - b.dist)
                .slice(0, 2);

            for (const target of targets) {
                lines.push({ from: i, to: target.idx });
            }
        }
        return lines;
    }, [nodes]);

    return (
        <div ref={containerRef} className={cn(styles.container, className)}>
            <svg className={styles.svg}>
                {connections.map((line, i) => (
                    <motion.line
                        key={i}
                        x1={`${nodes[line.from].x}%`}
                        y1={`${nodes[line.from].y}%`}
                        x2={`${nodes[line.to].x}%`}
                        y2={`${nodes[line.to].y}%`}
                        stroke="currentColor"
                        className={styles.lineText}
                        strokeWidth="1"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: i * 0.05 }}
                    />
                ))}
            </svg>

            {nodes.map((node) => (
                <motion.div
                    key={node.id}
                    className={cn(styles.node, "group")}
                    style={{
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                    whileHover={{ scale: 1.2, zIndex: 50 }}
                >
                    <div className="relative">
                        <motion.div
                            className={styles.glow}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.5 }}
                        />
                        <div className={styles.card}>
                            <Image
                                src={node.icon}
                                alt={node.name}
                                width={40}
                                height={40}
                                className={styles.icon}
                                unoptimized
                            />
                        </div>
                        <motion.span
                            className={styles.label}
                        >
                            {node.name}
                        </motion.span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
