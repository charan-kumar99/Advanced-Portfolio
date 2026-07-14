"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import styles from './certificate-marquee.module.css';

const certificates = [
  "/certificates/Charan_Kumar_Accolade_Internship_Certificate.png",
  "/certificates/Charan_Kumar_Cybersecurity_Training_Certificate.png",
  "/certificates/Charan_Kumar_NCC_A_Exam_Certificate.jpeg",
  "/certificates/Charan_Kumar_Skill_Development_Programme_Certificate.jpeg",
  "/certificates/Charan_Kumar_NCC_CAT_C_Certificate.jpeg",
];

function ScrambleButton({ href }) {
  const [displayText, setDisplayText] = useState("View All Achievements");
  const [isScrambling, setIsScrambling] = useState(false);
  const originalText = "View All Achievements";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    
    let iteration = 0;
    const maxIterations = originalText.length;

    const interval = setInterval(() => {
      setDisplayText((prev) =>
        originalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setIsScrambling(false);
      }

      iteration += 1 / 3;
    }, 30);
  };

  return (
    <Link
      href={href}
      onMouseEnter={scramble}
      className={styles.scrambleBtn}
    >
      <span className={styles.relativeZ10}>{displayText}</span>
      <ArrowRight className={styles.arrowIcon} />
      <div className={styles.btnGlimmer} />
    </Link>
  );
}

const Column = ({ images, y }) => {
  return (
    <motion.div
      className={styles.column}
      style={{ y, translateZ: 0 }}
    >
      {images.map((src, i) => (
        <div key={i} className={styles.imageWrapper}>
          <Image
            src={src}
            alt={`Certificate ${i}`}
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            className={styles.img}
          />
        </div>
      ))}
    </motion.div>
  );
};

export function CertificateShowcase() {
  const gallery = useRef(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 20,
    damping: 15,
    mass: 0.2,
    restDelta: 0.001
  });

  const { height } = dimension;
  const y = useTransform(smoothProgress, [0, 1], [0, height * 1.2]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, height * 2.0]);
  const y3 = useTransform(smoothProgress, [0, 1], [0, height * 0.8]);

  useEffect(() => {
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className={styles.section}>
      {/* Intro Text Section */}
      <div className={styles.headerContainer}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={styles.flexCenter}
        >
          <div className={styles.spaceY6}>
            <div className={styles.spaceY4}>
              <h2 className={styles.subTitle}>
                Certifications & Achievements
              </h2>
              <h3 className={styles.title}>
                Validating <span className="text-shiny">Excellence</span> through Professional Standards.
              </h3>
              <p className={styles.description}>
                A collection of my professional certifications in Software Engineering, Cybersecurity, and Professional Development.
              </p>
            </div>
          </div>
          
          <div className={styles.btnRow}>
            <ScrambleButton href="/achievements" />
          </div>
        </motion.div>
      </div>

      {/* Parallax Gallery - Reduced to 3 columns with margins on sides */}
      <div className={styles.galleryContainer}>
        <div
          ref={gallery}
          className={styles.galleryGrid}
        >
          {/* Fill each column with more images so they don't run out during the scroll */}
          <Column images={[certificates[0], certificates[1], certificates[2], certificates[3], certificates[4], certificates[0]]} y={y} />
          <Column images={[certificates[1], certificates[2], certificates[3], certificates[4], certificates[0], certificates[1]]} y={y2} />
          <Column images={[certificates[4], certificates[3], certificates[2], certificates[1], certificates[0], certificates[4]]} y={y3} />
        </div>
      </div>
      
      {/* Background Decorative Elements */}
      <div className={styles.bgDecor1} />
      <div className={styles.bgDecor2} />
    </section>
  );
}
