import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import styles from './marquee-logo-scroller.module.css';

const MarqueeLogoScroller = React.forwardRef(
  ({ title, description, logos, speed = 'normal', className, ...props }, ref) => {
    const durationMap = {
      normal: 40,
      slow: 80,
      fast: 20,
    };
    const animationDuration = durationMap[speed];

    return (
      <section
        ref={ref}
        aria-label={title}
        className={cn(styles.section, className)}
        {...props}
      >
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.grid}>
            <h2 className={styles.title}>
              {title}
            </h2>
            <p className={styles.desc}>
              {description}
            </p>
          </div>
        </div>

        {/* Marquee Section */}
        <div
          className={styles.marqueeViewport}
          style={{
            maskImage:
              'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          }}
        >
          <motion.div 
            className={styles.track} 
            animate={{
              x: [0, -50 + "%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: animationDuration,
                ease: "linear",
              },
            }}
          >
            {[...logos, ...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className={styles.card}
              >
                <div
                  style={{
                    '--from': logo.gradient.from,
                    '--via': logo.gradient.via,
                    '--to': logo.gradient.to,
                  }}
                  className={styles.gradientBg}
                />
                
                <div className={styles.overlay} />

                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={styles.img}
                />

                <div className={styles.shine} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    );
  }
);

MarqueeLogoScroller.displayName = 'MarqueeLogoScroller';

export { MarqueeLogoScroller };
export default MarqueeLogoScroller;
