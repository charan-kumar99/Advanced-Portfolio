import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import {
  Instagram,
  Github,
  Linkedin,
  ArrowDownRight,
  Zap,
  Bot
} from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import Link from 'next/link';
import gsap from "gsap";
import { ProfileCard } from "@/components/ui/profile-card";
import { Spotlight } from "@/components/ui/spotlight-new";
import styles from "./HeroVisual.module.css";

export function HeroVisual({ isExiting }) {
  const { personal } = portfolioData;
  const [showProfile, setShowProfile] = useState(false);
  const githubRef = useRef(null);
  const linkedinRef = useRef(null);
  const instagramRef = useRef(null);
  const zapRef = useRef(null);
  const zapSmallRef = useRef(null);
  const botRef = useRef(null);

  useEffect(() => {
    if (!isExiting) return;

    const ctx = gsap.context(() => {
      // Reveal + Loop for GitHub
      gsap.fromTo(githubRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          onComplete: () => {
            gsap.to(githubRef.current, {
              y: -10,
              duration: 2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              force3D: true
            });
          }
        }
      );

      // Reveal + Loop for LinkedIn
      gsap.fromTo(linkedinRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.1,
          ease: "power3.out",
          onComplete: () => {
            gsap.to(linkedinRef.current, {
              y: 10,
              duration: 2.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              force3D: true
            });
          }
        }
      );

      // Reveal + Loop for Instagram
      gsap.fromTo(instagramRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          onComplete: () => {
            gsap.to(instagramRef.current, {
              x: 10,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              force3D: true
            });
          }
        }
      );

      // Zap pulsing
      gsap.to([zapRef.current, zapSmallRef.current], {
        scale: 1.2,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        force3D: true
      });

      // Bot floating
      gsap.to(botRef.current, {
        rotation: 8,
        y: -10,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        force3D: true
      });
    });

    return () => ctx.revert();
  }, [isExiting]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.container}
    >
      {/* Background Pattern */}
      <div className={styles.bgPattern} />

      {/* Spotlight Effect */}
      <div className={styles.spotlightWrapper}>
        <Spotlight
          duration={10}
          xOffset={120}
          translateY={-300}
          gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0, 0%, 100%, .15) 0, hsla(0, 0%, 100%, .05) 50%, transparent 80%)"
          gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 100%, .1) 0, hsla(0, 0%, 100%, .02) 80%, transparent 100%)"
          gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 100%, .08) 0, hsla(0, 0%, 100%, 0) 80%, transparent 100%)"
        />
      </div>

      <main className={styles.main}>
        <div className={styles.contentWrapper}>

          {/* Line 1: AI & DATA */}
          <div className={styles.leadRow}>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={styles.leadText1}
            >
              Hi, I'm {personal.name}. I build scalable systems.
            </motion.p>
            <div className={styles.relativeWrapper}>
              <div ref={githubRef} className={styles.githubPos}>
                <a
                  href={personal.socialLinks.find(s => s.platform === 'GitHub')?.url}
                  target="_blank"
                  className={styles.socialLink}
                >
                  <Github size={32} />
                </a>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={isExiting ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className={styles.titleText}
                translate="no"
              >
                FULL STACK
              </motion.h1>
            </div>
          </div>

          {/* Line 2: SOFT [ICON] WARE */}
          <div className={styles.leadRow}>
            <div className={styles.relativeWrapper}>
              <div ref={linkedinRef} className={styles.linkedinPos}>
                <a
                  href={personal.socialLinks.find(s => s.platform === 'LinkedIn')?.url}
                  target="_blank"
                  className={styles.socialLink}
                >
                  <Linkedin size={32} />
                </a>
              </div>
              <div ref={instagramRef} className={styles.instagramPos}>
                <a
                  href={personal.socialLinks.find(s => s.platform === 'Instagram')?.url}
                  target="_blank"
                  className={styles.socialLink}
                >
                  <Instagram size={32} />
                </a>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={isExiting ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={styles.flexRowTitle}
                translate="no"
              >
                <span className="">.NET</span>
                <div ref={zapRef} className={styles.zapVisibleLg}>
                  <Zap className={styles.zapIcon} strokeWidth={1.5} />
                </div>
                <div ref={zapSmallRef} className={styles.zapHiddenLg}>
                  <Zap className={styles.zapIcon} strokeWidth={2} />
                </div>
                <span className="">CORE</span>
              </motion.h1>
            </div>
          </div>

          {/* Line 3: DEVELOPER */}
          <div className={styles.leadRow}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isExiting ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={styles.flexRowTitle}
              translate="no"
            >
              <span className="">DEVE</span>
              <div ref={botRef} className={styles.botIconWrapper}>
                <Bot className={styles.botIcon} />
              </div>
              <span className="">LOPER</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={styles.leadText2}
            >
              Open to all forms of collaboration, regardless of location and language.
            </motion.p>
          </div>
        </div>

        {/* Separator Section */}
        <div className={styles.separatorSection}>
          <div className={styles.separatorRow}>
            <Separator className={styles.separatorLine} />
            <div className={styles.separatorText}>
              UDUPI, IN — {new Date().getFullYear()}
            </div>
            <Link
              href="/resume"
              className={styles.resumeLink}
            >
              <div className={styles.resumeBtn}>
                <span className={styles.resumeBtnLabel}>
                  View Resume
                </span>
                <div className={styles.resumeBtnIcon}>
                  <ArrowDownRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Award/Badge Vertical - MOVED TO LEFT */}
        <div
          className={styles.badgeContainer}
          onMouseEnter={() => setShowProfile(true)}
          onMouseLeave={() => setShowProfile(false)}
        >
          {/* The Badge Trigger */}
          <div className="relative z-50">
            <motion.div
              whileHover={{ x: 10 }}
              className={styles.badgeTrigger}
            >
              <span className={styles.badgeLabel}>
                AVAILABLE FOR OPPORTUNITY
              </span>
            </motion.div>
          </div>

          {/* Profile Card Sidebar/Drawer Effect */}
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className={styles.profileWrapper}
              >
                <ProfileCard
                  name={personal.name}
                  title={personal.title}
                  description={personal.bio}
                  imageUrl={personal.avatar}
                  githubUrl={personal.socialLinks.find(s => s.platform === 'GitHub')?.url}
                  linkedinUrl={personal.socialLinks.find(s => s.platform === 'LinkedIn')?.url}
                  instagramUrl={personal.socialLinks.find(s => s.platform === 'Instagram')?.url}
                  className="!max-w-4xl scale-[0.8] origin-left"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
}
