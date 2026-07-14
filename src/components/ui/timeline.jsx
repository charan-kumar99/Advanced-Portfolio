"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import styles from './timeline.module.css';

export const Timeline = ({ data, isLowPowerMode }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const updateHeight = () => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          setHeight(rect.height);
        }
      };

      updateHeight();

      const resizeObserver = new ResizeObserver(() => {
        updateHeight();
      });

      resizeObserver.observe(ref.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className={styles.container}
      ref={containerRef}
    >
      <div className={styles.headerSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.h2
            className={styles.heading}
            whileHover={{ scale: 1.02, originX: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            Changelog from my journey
          </motion.h2>
          <motion.p
            className={styles.subHeading}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            A timeline of roles, responsibilities, and professional growth across various organizations.
          </motion.p>
        </motion.div>
      </div>

      <div ref={ref} className={styles.timelineList}>
        {data.map((item, index) => (
          <div
            key={index}
            className={styles.entry}
          >
            <div className={styles.stickyHeader}>
              <div className={styles.circleWrapper}>
                <div className={styles.innerDot} />
              </div>
              <h3 className={styles.desktopTitle}>
                {item.title}
              </h3>
            </div>

            <div className={styles.contentWrapper}>
              <h3 className={styles.mobileTitle}>
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className={styles.progressTrack}
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className={styles.progressBar}
          />
        </div>
      </div>
    </div>
  );
};
