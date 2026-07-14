'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, Moon, Sun, ChevronDown, Focus } from 'lucide-react';
import { useTheme } from 'next-themes';

import CardNav from '@/components/ui/CardNav';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Logo } from '@/components/ui/logo';
import styles from './Navbar.module.css';

function Clock() {
    const [time, setTime] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const updateTime = () => {
            const now = new Date();
            let h = now.getHours();
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            h = h ? h : 12;
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            setTime(`${String(h).padStart(2, '0')}:${m}:${s} ${ampm}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return <span className={styles.clockPlaceholder}>00:00:00 AM</span>;

    return (
        <span className={styles.clockText}>
            {time}
        </span>
    );
}

// Sub-links for the "About" dropdown
const useNavItems = () => {
    const t = useTranslations('navigation.menu');
    return [
        {
            label: "About",
            links: [
                { label: "Achievements", href: "/achievements", description: "Certifications, awards, and milestones" },
                { label: "Skills", href: "/skills", description: "Technologies and tools I work with" },
                { label: "Experience", href: "/experience", description: "My professional journey and growth" },
                { label: "Projects", href: "/projects", description: "A showcase of all my work" },
            ]
        }
    ];
};

export function Navbar() {
    const t = useTranslations('navigation');
    const navItems = useNavItems();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const pathname = usePathname();
    const { scrollY } = useScroll();

    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mounted, setMounted] = useState(false);

    const isDark = resolvedTheme === 'dark';

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleScroll = () => {
            if (isMenuOpen) return;

            const currentScrollY = window.scrollY;
            const direction = currentScrollY > lastScrollY ? 'down' : 'up';

            const scrolled = currentScrollY > 50;
            setIsScrolled(scrolled);

            if (direction === 'down' && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, isMenuOpen]);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen((prev) => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    const handleHomeClick = useCallback((e) => {
        if (pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        closeMenu();
    }, [pathname, closeMenu]);

    // Animation variants
    const navVariants = {
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 }
    };

    const menuVariants = {
        closed: { opacity: 0 },
        open: { opacity: 1 }
    };

    return (
        <>
            <motion.nav
                variants={navVariants}
                initial="hidden"
                animate={isVisible || isMenuOpen ? 'visible' : 'hidden'}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className={styles.navBar}
            >
                <div className={isScrolled ? styles.navContainerScrolled : styles.navContainer}>
                    <motion.div
                        className={isScrolled ? styles.navInnerScrolled : styles.navInner}
                        style={isScrolled ? {
                            background: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                            border: resolvedTheme === 'dark' ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.1)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                            padding: '0.75rem 1.5rem',
                        } : {}}
                        layout
                    >
                        {/* Make the Clock a Link to Home */}
                        <Link href="/" className={styles.logoLink} onClick={handleHomeClick}>
                            <Logo />
                            <Clock />
                        </Link>

                        {/* Desktop Navigation with CardNav */}
                        <div className={styles.desktopNav}>
                            {/* HOME */}
                            <Link
                                href="/"
                                onClick={handleHomeClick}
                                className={pathname === '/' ? styles.navLinkActive : styles.navLink}
                            >
                                <span className={styles.navLinkLabel}>{t('home')}</span>
                            </Link>

                            <CardNav
                                items={navItems}
                                theme={isDark ? 'dark' : 'light'}
                                pathname={pathname}
                            />

                            {/* CONTACT (Direct Link) */}
                            <Link
                                href="/contact"
                                className={pathname === '/contact' ? styles.navLinkActive : styles.navLink}
                            >
                                <span className={styles.navLinkLabel}>{t('contact')}</span>
                            </Link>
                        </div>

                        {/* Controls */}
                        <div className={styles.controls}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={styles.controlBtn}
                                aria-label="Focus mode"
                            >
                                <Link href="/bento" target="_blank" rel="noopener noreferrer">
                                    <Focus className={styles.controlIcon} />
                                </Link>
                            </motion.button>

                            {mounted && (
                                <AnimatedThemeToggler />
                            )}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleMenu}
                                className={styles.menuBtn}
                                aria-label="Toggle menu"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={isMenuOpen ? 'close' : 'menu'}
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isMenuOpen ? <X className={styles.menuIcon} /> : <Menu className={styles.menuIcon} />}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {
                    isMenuOpen && (
                        <motion.div
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            transition={{ duration: 0.3 }}
                            className={styles.mobileOverlay}
                        >
                            <motion.div
                                className={styles.mobileOverlayBg}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />

                            <div className={styles.mobileContent}>
                                <nav className={styles.mobileNav}>
                                    {/* Mobile Home */}
                                    <Link
                                        href="/"
                                        onClick={handleHomeClick}
                                        className={styles.mobileNavLink}
                                    >
                                        {t('home')}
                                    </Link>

                                    <Link
                                        href="/contact"
                                        onClick={closeMenu}
                                        className={styles.mobileNavLink}
                                    >
                                        {t('contact')}
                                    </Link>

                                    {/* Mobile Links grouped by Categories */}
                                    {navItems.map((category) => (
                                        <div key={category.label} className={styles.mobileCategoryGroup}>
                                            <span className={styles.mobileCategoryLabel}>
                                                {category.label}
                                            </span>
                                            {category.links.map((link) => (
                                                <Link
                                                    key={link.label}
                                                    href={link.href}
                                                    onClick={closeMenu}
                                                    className={pathname === link.href ? styles.mobileCategoryLinkActive : styles.mobileCategoryLink}
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </div>
                                    ))}
                                </nav>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ delay: 0.5 }}
                                    className={styles.mobileThemeSection}
                                >

                                    {mounted && (
                                        <AnimatedThemeToggler
                                            className={styles.mobileThemeBtn}
                                        />
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </>
    );
}
