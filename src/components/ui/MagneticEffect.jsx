"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from './MagneticEffect.module.css';

export default function MagneticEffect({ children }) {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const boundingRect = ref.current?.getBoundingClientRect();
        if (boundingRect) {
            const { left, top, width, height } = boundingRect;
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            const distanceX = clientX - centerX;
            const distanceY = clientY - centerY;
            
            const strength = 0.35;
            setPosition({ x: distanceX * strength, y: distanceY * strength });
        }
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={styles.inlineBlock}
        >
            {children}
        </motion.div>
    );
}
