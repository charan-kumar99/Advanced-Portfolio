'use client';

import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiMail, FiMapPin, FiGithub, FiLinkedin } from "react-icons/fi";
import { SiSpotify, SiInstagram } from "react-icons/si";
import { portfolioData } from "@/data/portfolio";
import styles from "./BlogBento.module.css";

export const BlogBento = () => {
    return (
        <div className={styles.section}>
            <div className={styles.container}>
                {/* Main Grid */}
                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    transition={{ staggerChildren: 0.05 }}
                    className={styles.grid}
                >
                    {/* Header Block - Left Side */}
                    <Block className={styles.colHeader}>
                        <img
                            src="https://api.dicebear.com/8.x/lorelei-neutral/svg?seed=John"
                            alt="avatar"
                            className={styles.avatar}
                        />
                        <h1 className={styles.heading}>
                            Hi, I'm Tom.{" "}
                            <span className="text-muted-foreground">
                                I build cool websites like this one.
                            </span>
                        </h1>
                        <a
                            href={`mailto:${portfolioData.personal.email}`}
                            className={styles.emailLink}
                        >
                            Contact me <FiArrowRight />
                        </a>
                    </Block>

                    {/* Social Blocks - SQUARE 2x2 Grid on Right */}
                    <div className={styles.colSocials}>
                        <Block
                            whileHover={{ rotate: "2.5deg", scale: 1.05 }}
                            className={styles.blockLinkedin}
                        >
                            <a
                                href={portfolioData.personal.socialLinks.find(s => s.platform === 'LinkedIn')?.url || "https://linkedin.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialAnchor}
                            >
                                <FiLinkedin />
                            </a>
                        </Block>

                        <Block
                            whileHover={{ rotate: "-2.5deg", scale: 1.05 }}
                            className={styles.blockGithub}
                        >
                            <a
                                href={portfolioData.personal.socialLinks.find(s => s.platform === 'GitHub')?.url || "https://github.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialAnchor}
                            >
                                <FiGithub />
                            </a>
                        </Block>

                        <Block
                            whileHover={{ rotate: "-2.5deg", scale: 1.05 }}
                            className={styles.blockInstagram}
                        >
                            <a
                                href={portfolioData.personal.socialLinks.find(s => s.platform === 'Instagram')?.url || "https://instagram.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialAnchor}
                            >
                                <SiInstagram />
                            </a>
                        </Block>

                        <Block
                            whileHover={{ rotate: "2.5deg", scale: 1.05 }}
                            className={styles.blockSpotify}
                        >
                            <a
                                href="https://open.spotify.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialAnchor}
                            >
                                <SiSpotify />
                            </a>
                        </Block>
                    </div>

                    {/* About Block */}
                    <Block className={styles.colAbout}>
                        <p>
                            <span className="text-foreground font-medium">My passion is building innovative solutions.</span>{" "}
                            <span className="text-muted-foreground">
                                An AI Engineer and Full Stack Developer with expertise in architecting intelligent systems that combine Machine Learning, IoT infrastructure, and Web3 technologies.
                                Currently focused on advancing AI Agent frameworks and exploring decentralized blockchain applications, bridging the gap between cutting-edge research and practical implementation.
                                Experienced in designing scalable software architectures and engineering complex technical solutions from concept to deployment.
                            </span>
                        </p>
                    </Block>

                    {/* Location Block */}
                    <Block className={styles.colLocation}>
                        <FiMapPin className={styles.locationIcon} />
                        <p className={styles.locationText}>{portfolioData.personal.location}</p>
                    </Block>

                    {/* Newsletter Block */}
                    <Block className={styles.colNewsletter} id="newsletter">
                        <p className={styles.newsletterLabel}>Join my mailing list</p>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className={styles.newsletterForm}
                        >
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={styles.newsletterInput}
                            />
                            <button
                                type="submit"
                                className={styles.newsletterSubmit}
                            >
                                <FiMail /> Join the list
                            </button>
                        </form>
                    </Block>
                </motion.div>
            </div>
        </div>
    );
};

const Block = ({ className, children, whileHover, id }) => {
    return (
        <motion.div
            id={id}
            variants={{
                initial: { scale: 0.5, y: 50, opacity: 0 },
                animate: { scale: 1, y: 0, opacity: 1 },
            }}
            transition={{
                type: "spring",
                mass: 3,
                stiffness: 400,
                damping: 50,
            }}
            whileHover={whileHover}
            className={`${styles.block} ${className || ""}`}
        >
            {children}
        </motion.div>
    );
};
