"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import styles from './brand-scroller.module.css';

const techStackItems = portfolioData.techStack;

const toolItems = [...portfolioData.tools, ...portfolioData.tools, ...portfolioData.tools].slice(0, 18);

const ScrollerItem = ({ name, icon }) => (
    <div className={cn(styles.item, "group")}>
        <div className={styles.iconWrapper}>
            <Image
                src={icon}
                alt={name}
                fill
                className={styles.img}
                unoptimized
            />
        </div>
        <p className={styles.text}>
            {name}
        </p>
    </div>
);

export const BrandScroller = () => {
    return (
        <div className={styles.container}>
            <motion.div
                animate={{
                    x: ["0%", "-50%"],
                }}
                transition={{
                    duration: 30,
                    ease: "linear",
                    repeat: Infinity,
                }}
                className={styles.scroller}
            >
                <div className={styles.group}>
                    {techStackItems.map((item, idx) => (
                        <ScrollerItem key={`tech-1-${idx}`} name={item.name} icon={item.icon} />
                    ))}
                </div>
                <div className={styles.group}>
                    {techStackItems.map((item, idx) => (
                        <ScrollerItem key={`tech-2-${idx}`} name={item.name} icon={item.icon} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export const BrandScrollerReverse = () => {
    return (
        <div className={styles.container}>
            <motion.div
                animate={{
                    x: ["-50%", "0%"],
                }}
                transition={{
                    duration: 30,
                    ease: "linear",
                    repeat: Infinity,
                }}
                className={styles.scroller}
            >
                <div className={styles.group}>
                    {toolItems.map((item, idx) => (
                        <ScrollerItem key={`tool-1-${idx}`} name={item.name} icon={item.icon} />
                    ))}
                </div>
                <div className={styles.group}>
                    {toolItems.map((item, idx) => (
                        <ScrollerItem key={`tool-2-${idx}`} name={item.name} icon={item.icon} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
