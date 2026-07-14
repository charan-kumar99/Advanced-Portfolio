"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import styles from './demo.module.css';

export default function Hero() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
    target: container,
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <div className={styles.container}>
      <div
        className={styles.inner}
        ref={container}
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <div className={styles.textOverlay}>
          <p className={styles.topParagraph}>
            Beauty and quality need the right time to be conceived and realised
            even in a world that is in too much of a hurry.
          </p>
          <p className={styles.bottomParagraph}>
            Background Parallax
          </p>
        </div>
        <div className={styles.parallaxBackground}>
          <motion.div className={styles.fullSize} style={{ y }}>
            <Image
              alt="image"
              className="grayscale-0"
              fill
              src="https://images.cnippet.dev/image/upload/v1770400411/img_23001.png"
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 100vw"
              unoptimized
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
