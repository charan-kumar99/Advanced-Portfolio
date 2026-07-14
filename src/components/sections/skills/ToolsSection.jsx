'use client';

import { motion } from 'framer-motion';
import { portfolioData } from '@/data/portfolio';
import Image from 'next/image';
import styles from './ToolsSection.module.css';

const toolLogos = {
    'VS Code': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg',
    'Figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
    'Postman': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg',
    'GitHub': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
    'Linux': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
    'Jupyter': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg',
    'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    'Conda': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/anaconda/anaconda-original.svg',
    'Google Colab': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecolab/googlecolab-original.svg',
};

export const ToolsSection = () => {
    const topRow = portfolioData.tools.slice(0, 5);
    const bottomRow = portfolioData.tools.slice(5, 10);

    return (
        <section
            id="tools"
            className={styles.section}
        >
            {/* BACKGROUND AMBIENCE */}
            <div className={styles.bgAmbience} />

            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={styles.header}
            >
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.6 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={styles.subtitle}
                >
                    WORKFLOW & INFRASTRUCTURE
                </motion.span>
                <h2 className={styles.title}>
                    Professional Tooling
                </h2>
                <p className={styles.desc}>
                    Leveraging industrial-grade platforms for development, design, and deployment to ensure rapid and reliable software delivery.
                </p>
            </motion.div>

            {/* MARQUEE ROWS */}
            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeRows}>
                    {/* Row 1: Left to Right */}
                    <MarqueeRow items={topRow} direction="right" speed={45} />

                    {/* Row 2: Right to Left */}
                    <MarqueeRow items={bottomRow} direction="left" speed={40} />
                </div>
            </div>
        </section>
    );
};

const MarqueeRow = ({ items, direction, speed }) => {
    const doubledItems = [...items, ...items, ...items, ...items];

    return (
        <div className={styles.marqueeRowWrapper}>
            <motion.div
                className={styles.marqueeTrack}
                style={{
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                    transformStyle: "preserve-3d"
                }}
                animate={{
                    x: direction === 'right' ? ['-50%', '0%'] : ['0%', '-50%'],
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {doubledItems.map((tool, idx) => (
                    <ToolPill key={`${tool.name}-${idx}`} tool={tool} />
                ))}
            </motion.div>
        </div>
    );
};

const ToolPill = ({ tool }) => {
    const iconUrl = toolLogos[tool.name] || tool.icon;

    return (
        <div className={styles.toolPill}>
            <div className={styles.toolImageWrapper}>
                <Image
                    src={iconUrl}
                    alt={tool.name}
                    fill
                    className={tool.name === 'GitHub' ? styles.toolImageGithub : styles.toolImage}
                    unoptimized
                />
            </div>
            <span className={styles.toolName}>
                {tool.name}
            </span>
        </div>
    );
};
