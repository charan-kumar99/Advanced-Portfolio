'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Spotlight } from '@/components/ui/spotlight-new';
import {
    ChevronUp,
    Github,
    Linkedin,
    Instagram,
    Copy,
    Check,
    X,
    Gamepad2,
    Music,
    Bot
} from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { portfolioData } from '@/data/portfolio';
import styles from './Footer.module.css';

const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Bot, // Replaced Twitter logo with AI Bot logo
    instagram: Instagram,
    discord: Gamepad2,
    spotify: Music,
};

const marqueeKeys = ['0', '1', '2', '3', '4', '5'];

function Marquee() {
    const t = useTranslations('footer.marquee');
    return (
        <div className={styles.marqueeWrapper}>
            <motion.div
                className={styles.marqueeTrack}
                animate={{ x: [0, -1000] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
                {[...marqueeKeys, ...marqueeKeys, ...marqueeKeys].map((key, i) => (
                    <div key={i} className={styles.marqueeItem}>
                        <span>{t(key)}</span>
                        <span className={styles.marqueeDot} />
                    </div>
                ))}
            </motion.div>

            <div className={styles.marqueeFadeLeft} />
            <div className={styles.marqueeFadeRight} />
        </div>
    );
}

function SocialCard({ social }) {
    const Icon = socialIcons[social.icon] || Github;

    return (
        <motion.a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialCard}
            whileHover={{ y: -4, scale: 1.05 }}
        >
            <Icon className={styles.socialCardIcon} />
            <span className={styles.socialCardLabel}>{social.platform}</span>
            <div className={styles.socialCardGlow} />
        </motion.a>
    );
}

export function Footer() {
    const { theme } = useTheme();
    const tNav = useTranslations('navigation');
    const t = useTranslations('footer');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAboutExpanded, setIsAboutExpanded] = useState(false);
    const [isEmailHovered, setIsEmailHovered] = useState(false);
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [copyrightIndex, setCopyrightIndex] = useState(0);
    const [localTime, setLocalTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options = {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'
            };
            const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
            setLocalTime(`${timeString} UTC+5:30`);
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setCopyrightIndex(prev => (prev + 1) % 2);
        }, 2500); // Trigger every 2.5s
        return () => clearInterval(interval);
    }, []);

    const currentYear = new Date().getFullYear();

    // Lock body scroll when footer is expanded
    useEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isExpanded]);

    const toggleExpand = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    const closeExpanded = useCallback(() => {
        setIsExpanded(false);
    }, []);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(portfolioData.personal.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const overlayVariants = {
        closed: { opacity: 0 },
        open: { opacity: 1 }
    };

    const pathname = usePathname();
    const isBlog = pathname?.includes('/blog');

    const previewSocials = portfolioData.personal.socialLinks
        .filter((s) => s.platform !== 'Discord' && s.platform !== 'Spotify')
        .slice(0, 4);

    return (
        <>
            {/* Compact Footer - Always visible */}
            <footer className={`
                ${isBlog ? styles.footerBlog : styles.footer} 
                ${isExpanded ? styles.footerHidden : ''}
            `}>
                <div className={styles.container}>
                    <div className={isBlog ? styles.innerCardBlog : styles.innerCardDefault}>
                        <div className={styles.layoutRow}>
                            {/* Left Side - Animated Copyright */}
                            <div className={styles.copyrightContainer}>
                                <span className={`${styles.copyrightYear} ${isBlog ? styles.textMuted : styles.textGradient}`}>
                                    © {currentYear}
                                </span>
                                <div className={styles.copyrightTextContainer}>
                                    <AnimatePresence mode="popLayout">
                                        {mounted && (
                                            <motion.span
                                                key={copyrightIndex}
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -20, opacity: 0 }}
                                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                                className={`${styles.copyrightText} ${isBlog ? styles.textMuted : styles.textGradient}`}
                                            >
                                                {copyrightIndex === 0
                                                    ? `${portfolioData.personal.name}.`
                                                    : "All rights reserved."}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Right Side - Socials & More Button */}
                            <div className={styles.rightSection}>
                                <div className={styles.socialsContainer}>
                                    {/* Social Icons */}
                                    {previewSocials.map((social) => {
                                        const Icon = socialIcons[social.icon];
                                        return (
                                            <motion.a
                                                key={social.platform}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.socialIconLink}
                                                aria-label={social.platform}
                                            >
                                                {Icon && <Icon className="w-4 h-4" />}
                                            </motion.a>
                                        );
                                    })}

                                    {/* Dedicated AI Chat Assistant Button */}
                                    <motion.button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.dispatchEvent(new CustomEvent('portfolio:toggle-chatbot'));
                                        }}
                                        className={styles.socialIconLink}
                                        aria-label="Chat with AI"
                                        title="Chat with AI"
                                    >
                                        <Bot className="w-4 h-4" />
                                    </motion.button>
                                </div>

                                <motion.button
                                    onClick={toggleExpand}
                                    className={isBlog ? styles.moreButtonBlog : styles.moreButtonDefault}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className={styles.moreButtonText}>{t('more')}</span>
                                    <motion.span
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </motion.span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Expanded Footer Overlay */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            variants={overlayVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className={styles.expandedOverlay}
                        >
                            <Spotlight
                                gradientFirst={theme === 'dark'
                                    ? "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)"
                                    : "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0, 0%, 20%, .03) 0, hsla(0, 0%, 15%, .01) 50%, hsla(0, 0%, 10%, 0) 80%)"
                                }
                                gradientSecond={theme === 'dark'
                                    ? "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)"
                                    : "radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 20%, .02) 0, hsla(0, 0%, 15%, .01) 80%, transparent 100%)"
                                }
                                gradientThird={theme === 'dark'
                                    ? "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)"
                                    : "radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 20%, .01) 0, hsla(0, 0%, 15%, .01) 80%, transparent 100%)"
                                }
                            />

                            {/* Top Marquee */}
                            <div className={styles.marqueeSection}>
                                <Marquee />
                            </div>

                            <div className={styles.expandedContent}>
                                <div className={styles.expandedGridContainer}>

                                    {/* Close Button - Size-Locked with clamp */}
                                    <div className={styles.closeButtonWrapper}>
                                        <motion.button
                                            onClick={closeExpanded}
                                            className={styles.closeButton}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <div className={styles.closeButtonBg} />
                                            <motion.div
                                                className={styles.closeButtonIconWrapper}
                                                whileHover={{ rotate: 90 }}
                                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                            >
                                                <X className={styles.closeButtonIcon} strokeWidth={2.5} />
                                            </motion.div>
                                        </motion.button>
                                    </div>

                                    {/* Main Grid - Forced 4-column layout regardless of zoom/screen */}
                                    <div className={styles.grid}>
                                        <FooterColumn title={t('links')}>
                                            <FooterLink href="/">{tNav('home')}</FooterLink>
                                            <FooterLink href="/resume">{tNav('resume')}</FooterLink>
                                            <FooterLink href="/contact">{tNav('contact')}</FooterLink>
                                            <AboutHoverMenu tNav={tNav} onExpandChange={setIsAboutExpanded} />
                                        </FooterColumn>

                                        <FooterColumn title={t('socials')}>
                                            <div
                                                className={styles.emailWrapper}
                                                onMouseEnter={() => setIsEmailHovered(true)}
                                                onMouseLeave={() => setIsEmailHovered(false)}
                                            >
                                                <FooterLink href={`mailto:${portfolioData.personal.email}`}>Email</FooterLink>
                                                <AnimatePresence>
                                                    {isEmailHovered && (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: 5 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 5 }}
                                                            className={styles.emailHoverContainer}
                                                        >
                                                            <span className={styles.emailText}>
                                                                {portfolioData.personal.email}
                                                            </span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleCopyEmail();
                                                                }}
                                                                className={styles.copyEmailBtn}
                                                                title="Copy Email"
                                                            >
                                                                {copied ? <Check className={`${styles.copyEmailBtnIcon} text-green-500`} /> : <Copy className={styles.copyEmailBtnIcon} />}
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <FooterLink href={portfolioData.personal.socialLinks.find(s => s.platform === 'LinkedIn')?.url || '#'} target="_blank">LinkedIn</FooterLink>
                                            <FooterLink href={portfolioData.personal.socialLinks.find(s => s.platform === 'Instagram')?.url || '#'} target="_blank">Instagram</FooterLink>
                                            <FooterLink href={portfolioData.personal.socialLinks.find(s => s.platform === 'GitHub')?.url || '#'} target="_blank">GitHub</FooterLink>
                                            <div
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setIsExpanded(false);
                                                    window.dispatchEvent(new CustomEvent('portfolio:toggle-chatbot'));
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <motion.div
                                                    whileHover={{ x: 5 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                    className={styles.footerLink}
                                                >
                                                    Chat with AI
                                                </motion.div>
                                            </div>
                                        </FooterColumn>

                                        <FooterColumn title={t('localTime')}>
                                            <p className={styles.timeText}>
                                                {localTime}
                                            </p>
                                            <a
                                                href="https://www.google.com/maps/place/Udupi,+Karnataka,+India"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.locationLink}
                                            >
                                                Udupi, India
                                            </a>
                                        </FooterColumn>

                                        <FooterColumn title={t('version')}>
                                            <p className={styles.timeText}>
                                                {t('versionEdition')}
                                            </p>
                                        </FooterColumn>
                                    </div>
                                </div>

                                {/* Bottom Brand Name - Scaled and Clipped (Top-half visible) */}
                                <div className={styles.brandSection}>
                                    <motion.h2
                                        initial={{ opacity: 0, y: "100%" }}
                                        animate={isAboutExpanded ? { opacity: 0, y: "120%" } : { opacity: 1, y: "20%" }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        className={styles.brandName}
                                    >
                                        CHARAN
                                    </motion.h2>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}

function FooterColumn({ title, children }) {
    return (
        <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>{title}</h3>
            <div className={styles.columnContent}>
                {children}
            </div>
        </div>
    );
}

function FooterLink({ href, children, target }) {
    return (
        <motion.div
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={styles.footerLinkWrapper}
        >
            <Link
                href={href}
                target={target}
                rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                className={styles.footerLink}
            >
                {children}
            </Link>
        </motion.div>
    );
}

function AboutHoverMenu({ tNav, onExpandChange }) {
    const [isHovered, setIsHovered] = useState(false);
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = useState(false);

    const subLinks = [
        { href: '/achievements', label: tNav('achievements') },
        { href: '/skills', label: tNav('skills') },
        { href: '/experience', label: tNav('experience') },
        { href: '/projects', label: tNav('projects') },
        { href: '/gallery', label: tNav('gallery') },
    ];

    const active = isMobile ? isOpen : isHovered;

    useEffect(() => {
        onExpandChange(active);
    }, [active, onExpandChange]);

    const containerVariants = {
        open: {
            height: 'auto',
            opacity: 1,
            transition: {
                height: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.4, ease: "linear" },
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        },
        closed: {
            height: 0,
            opacity: 0,
            transition: {
                height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.2, ease: "linear" },
                staggerChildren: 0.03,
                staggerDirection: -1
            }
        }
    };

    const itemVariants = {
        open: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
        closed: { y: 10, opacity: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div
            className={styles.aboutMenuContainer}
            onMouseEnter={() => !isMobile && setIsHovered(true)}
            onMouseLeave={() => !isMobile && setIsHovered(false)}
        >
            <div
                className={styles.aboutMenuTrigger}
                onClick={() => isMobile && setIsOpen(!isOpen)}
            >
                <Link
                    href="#about"
                    className={styles.aboutMenuTitle}
                >
                    {tNav('about')}
                </Link>
                <motion.div
                    animate={{ rotate: active ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronUp className={styles.aboutMenuArrow} />
                </motion.div>
            </div>

            <AnimatePresence>
                {active && (
                    <motion.div
                        variants={containerVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className={styles.aboutSubLinksContainer}
                    >
                        {subLinks.map((link) => (
                            <motion.div key={link.href} variants={itemVariants}>
                                <Link
                                    href={link.href}
                                    className={styles.aboutSubLink}
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
