"use client";
import { motion } from 'framer-motion';
import { FaLinkedinIn, FaGithub, FaInstagram } from "react-icons/fa";
import { portfolioData } from "@/data/portfolio";
import { ChatBot } from "@/components/layout/ChatBot";
import { Bot } from "lucide-react";
import styles from './SocialCorner.module.css';

export const SocialCorner = ({ className, delay = 0.5 }) => {
    return null; // Component disabled per user request
    const linkedinLink = portfolioData.personal.socialLinks.find(s => s.platform === 'LinkedIn')?.url;
    const instagramLink = portfolioData.personal.socialLinks.find(s => s.platform === 'Instagram')?.url;
    const githubLink = portfolioData.personal.socialLinks.find(s => s.platform === 'GitHub')?.url;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay }}
            className={`${styles.container} ${className || ''}`}
        >
            <div className={styles.innerGroup}>
                <a href={linkedinLink} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    <FaLinkedinIn className={styles.socialIcon} />
                </a>
                <a href={instagramLink} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    <FaInstagram className={styles.socialIcon} />
                </a>
                <a href={githubLink} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    <FaGithub className={styles.socialIcon} />
                </a>

                <motion.button
                    onClick={() => window.dispatchEvent(new CustomEvent('portfolio:toggle-chatbot'))}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={styles.socialLink}
                    aria-label="Open AI Assistant"
                >
                    <Bot className={styles.socialIcon} />
                </motion.button>
            </div>
            <div className={styles.line} />
        </motion.div>
    );
};
