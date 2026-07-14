'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useMotionValueEvent, useScroll, motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import styles from './sticky-scroll-reveal.module.css';

export const StickyScroll = ({
  content,
  contentClassName,
  isLowPowerMode = false,
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ['start start', 'end start'],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const handleWheel = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      container.scrollTop += e.deltaY;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.scrollArea}
        ref={ref}
      >
        <div className={styles.leftColumn}>
          <div className={styles.timelineTrack}>
            <motion.div
              className={styles.timelineThumb}
              animate={{ y: activeCard * 120 }}
              transition={{ type: 'spring', stiffness: 100 }}
            />
          </div>

          <div className={styles.contentWrapper}>
            {content.map((item, index) => (
              <div key={item.title + index} className={styles.itemBlock}>
                <AnimatePresence mode="wait">
                  {item.label && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: activeCard === index ? 1 : 0.2,
                        x: 0
                      }}
                      className={styles.labelGroup}
                    >
                      <span className={styles.labelLine} />
                      <span className={styles.labelText}>
                        {item.label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.h2
                  initial={{ opacity: 0, y: isLowPowerMode ? 0 : 10 }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.15,
                    y: activeCard === index ? 0 : (isLowPowerMode ? 0 : 5),
                    scale: activeCard === index ? 1 : (isLowPowerMode ? 1 : 0.98),
                    x: activeCard === index ? 0 : (isLowPowerMode ? 0 : -5),
                  }}
                  transition={{ duration: isLowPowerMode ? 0 : 0.5 }}
                  className={styles.title}
                >
                  {item.title}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeCard === index ? 1 : 0.1 }}
                  transition={{ duration: isLowPowerMode ? 0 : 0.3 }}
                  className={styles.descriptionWrapper}
                >
                  <div className={styles.quoteBar} />
                  <p className={styles.description}>
                    {item.description}
                  </p>
                </motion.div>

                <div className={styles.mobileContent}>
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div
            className={cn(
              styles.stickyContent,
              contentClassName
            )}
          >
            <AnimatePresence>
              <motion.div
                key={activeCard}
                initial={isLowPowerMode ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={isLowPowerMode ? { opacity: 0 } : { opacity: 0, scale: 1.05, y: -20, filter: 'blur(10px)' }}
                transition={{
                  duration: isLowPowerMode ? 0.2 : 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className={styles.stickyInner}
              >
                {content[activeCard].content ?? null}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.indicatorBg} />
        </div>
      </motion.div>
    </div>
  );
};
