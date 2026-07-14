'use client';

import React from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import styles from './hero-parallax.module.css';

export const HeroParallax = ({ products, isLowPowerMode }) => {
  const firstRow = products.slice(0, 4);
  const secondRow = products.slice(4, 8);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const rotateSpringConfig = { stiffness: 200, damping: 20 };

  const translateX = useTransform(scrollYProgress, [0, 1], [0, isLowPowerMode ? 200 : 800]);
  const translateXReverse = useTransform(scrollYProgress, [0, 1], [0, isLowPowerMode ? -200 : -800]);

  const rotateXRaw = useTransform(scrollYProgress, [0, 0.2], [isLowPowerMode ? 0 : 5, 0]);
  const rotateX = useSpring(rotateXRaw, rotateSpringConfig);

  const opacity = useTransform(scrollYProgress, [0, 0.2], [isLowPowerMode ? 0.8 : 0.2, 1]);

  const rotateZRaw = useTransform(scrollYProgress, [0, 0.2], [isLowPowerMode ? 0 : 5, 0]);
  const rotateZ = useSpring(rotateZRaw, rotateSpringConfig);
  const translateY = useTransform(scrollYProgress, [0, 0.2], [isLowPowerMode ? -100 : -500, isLowPowerMode ? 100 : 500]);
  
  return (
    <div
      ref={ref}
      className={cn(
        styles.container,
        isLowPowerMode ? styles.containerLowPower : styles.containerNormal
      )}
    >
      <Header />
      <motion.div
        style={{
          translateY,
          opacity,
          backfaceVisibility: 'hidden',
        }}
      >
        <motion.div className={cn(styles.rowReverse, isLowPowerMode && styles.rowReverseLowPower)}>
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
              isLowPowerMode={isLowPowerMode}
            />
          ))}
        </motion.div>
        <motion.div className={cn(styles.row, isLowPowerMode && styles.rowLowPower)}>
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
              isLowPowerMode={isLowPowerMode}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  const t = useTranslations('projectHeader');
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.headerTitle}>
        {t('title')}
      </h1>
      <p
        className={styles.headerSubtitle}
        dangerouslySetInnerHTML={{ __html: t.raw('subtitle') }}
      />

      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <div className={styles.scrollTrack}>
          <motion.div
            className={styles.scrollThumb}
            animate={{ y: [0, 40, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className={styles.scrollText}>
          Scroll
        </span>
      </motion.div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
  isLowPowerMode,
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={isLowPowerMode ? {} : {
        y: -20,
      }}
      key={product.title}
      className={cn(
        styles.productCard,
        isLowPowerMode ? styles.productCardLowPower : styles.productCardNormal
      )}
    >
      <a
        href={product.link}
        className={styles.productLink}
      >
        <Image
          src={product.thumbnail}
          height={600}
          width={600}
          className={styles.productImage}
          alt={product.title}
          priority={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </a>
      <div className={styles.productOverlay}></div>
      <h2 className={styles.productTitle}>
        {product.title}
      </h2>
    </motion.div>
  );
};
