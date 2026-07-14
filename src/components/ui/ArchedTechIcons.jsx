import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { cn } from '@/lib/utils';
import styles from './ArchedTechIcons.module.css';

export function ArchedTechIconsInteractive({ icons }) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotation = useMotionValue(0);
  
  const mouseVelocityX = useMotionValue(0);
  const cursorScaleX = useTransform(mouseVelocityX, [-3000, 0, 3000], [1.5, 1, 1.5], { clamp: true });

  const cursorX = useTransform(mouseX, (x) => x);
  const cursorY = useTransform(mouseY, (y) => y);
  const counterRotation = useTransform(rotation, (v) => -v);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      rotation.stop();
      setIsDragging(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [rotation]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left;
    const prevX = mouseX.get();
    
    mouseVelocityX.set((newX - prevX) * 40);
    mouseX.set(newX);
    mouseY.set(e.clientY - rect.top);
  };

  const handlePanStart = () => {
    setIsDragging(true);
  };

  const handlePan = (e, info) => {
    rotation.set(rotation.get() + info.delta.x * 0.05);
  };

  const handlePanEnd = (e, info) => {
    setIsDragging(false);
    const velocity = info.velocity.x;
    
    if (Math.abs(velocity) > 20) {
      animate(rotation, rotation.get() + velocity * 0.1, {
        type: 'spring',
        stiffness: 20,
        damping: 50,
        mass: 5,
        restDelta: 0.01
      });
    }
  };

  const wrapperStyle = {
    opacity: mounted ? 1 : 0,
    transition: 'opacity 0.5s ease-in-out',
    width: '100%',
    height: '100%'
  };

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={cn(styles.container, "cursor-none")}
      style={{ touchAction: 'pan-y' }}
    >
      <div style={wrapperStyle}>
        {/* REDESIGNED DRAG CURSOR - Adaptive Glassmorphic Pill */}
        <motion.div
          className={styles.dragCursor}
          style={{ 
            x: cursorX, 
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%",
            scaleX: cursorScaleX
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? (isDragging ? 1.1 : 1) : 0,
            width: isHovered ? 'auto' : 0,
          }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
        >
          <span className={styles.dragText}>DRAG</span>
          <div className={styles.glimmer} />
        </motion.div>

        {/* Drag Capture Surface - touch-action: none prevents accidental page-bounce */}
        <motion.div 
          className={styles.captureSurface}
          style={{ touchAction: 'none' }}
          onPanStart={handlePanStart}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
        />

        {/* Arch Wheel: Enforce permanent GPU composition to eliminate scroll-snapping glitches */}
        <div className={cn(styles.archWheel, "transform-gpu")}>
          <motion.div 
            className={cn(styles.wheelInner, "transform-gpu")}
            style={{ 
              rotate: rotation, 
              WebkitBackfaceVisibility: 'hidden', 
              backfaceVisibility: 'hidden',
              translateZ: 0 
            }}
          >
            {icons.map((icon, i) => {
              const angle = (i / icons.length) * 360;
              return (
                <div 
                  key={`icon-${icon}-${i}`} 
                  className={styles.iconSlot}
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div className={styles.iconWrapper}>
                    <motion.div 
                      className={cn(styles.iconCard, "transform-gpu")}
                      style={{ 
                        rotate: counterRotation, 
                        WebkitBackfaceVisibility: 'hidden', 
                        backfaceVisibility: 'hidden',
                        translateZ: 0 
                      }}
                    >
                      <div className={styles.iconRelative} style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}>
                          <Image 
                            src={icon} 
                            alt={`tech-icon-${i}`} 
                            fill 
                            className={cn(styles.imgContain, "transform-gpu")}
                            unoptimized 
                            priority={true} 
                            draggable={false}
                          />
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Ambient Gradients - Explicit GPU Layering */}
        <div className={cn(styles.gradientBottom, "transform-gpu")} />
        <div className={cn(styles.gradientLeft, "transform-gpu")} />
        <div className={cn(styles.gradientRight, "transform-gpu")} />
      </div>
    </div>
  );
}
