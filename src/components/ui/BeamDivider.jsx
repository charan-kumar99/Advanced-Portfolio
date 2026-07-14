"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import styles from './BeamDivider.module.css';

export const BeamDivider = ({
    orientation = "horizontal",
    className,
    reverse = false,
    active = true,
}) => {
    const initialPos = reverse ? "110%" : "-110%";
    const animatePos = reverse ? "-110%" : "110%";

    const transformProp = orientation === "horizontal" ? "x" : "y";

    return (
        <div
            className={cn(
                styles.container,
                orientation === "horizontal" ? styles.horizontal : styles.vertical,
                className
            )}
        >
            {active && (
                <motion.div
                    initial={{
                        [transformProp]: initialPos
                    }}
                    animate={{
                        [transformProp]: animatePos
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    }}
                    className={cn(
                        styles.beam,
                        orientation === "horizontal" ? styles.beamHorizontal : styles.beamVertical
                    )}
                />
            )}

            <div className={cn(styles.pulse, "pulse")} />
        </div>
    );
};
