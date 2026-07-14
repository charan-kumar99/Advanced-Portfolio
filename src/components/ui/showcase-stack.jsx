'use client';
import { useTransform, motion, useScroll } from 'framer-motion';
import { useRef, Children, createContext, useContext } from 'react';
import styles from './showcase-stack.module.css';

export const StackContext = createContext(false);
export const useIsInStack = () => useContext(StackContext);

const StackCard = ({ children, index, totalCards, scrollProgress }) => {
  const container = useRef(null);

  const targetScale = 1 - (totalCards - index) * 0.05;
  const scale = useTransform(scrollProgress, [index * (1 / totalCards), 1], [1, targetScale]);

  return (
    <div
      ref={container}
      className={styles.cardContainer}
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${index * 25}px)`,
        }}
        className={styles.motionCard}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const ShowcaseStack = ({ children }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });
  const childArray = Children.toArray(children);

  return (
    <div ref={container} className={styles.container}>
      {childArray.map((child, i) => (
        <StackCard
          key={i}
          index={i}
          totalCards={childArray.length}
          scrollProgress={scrollYProgress}
        >
          {child}
        </StackCard>
      ))}
    </div>
  );
};

export default ShowcaseStack;
