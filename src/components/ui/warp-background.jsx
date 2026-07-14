"use client"

import React, { useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import styles from './warp-background.module.css';

const Beam = ({
  width,
  x,
  delay,
  duration,
  paused,
}) => {
  const hue = useMemo(() => Math.floor(Math.random() * 360), [])
  const ar = useMemo(() => Math.floor(Math.random() * 10) + 1, [])

  return (
    <motion.div
      style={{
        "--x": `${x}`,
        "--width": `${width}`,
        "--aspect-ratio": `${ar}`,
        "--background": `linear-gradient(to top, hsl(${hue} 50% 65% / 0.8), transparent)`,
      }}
      className={styles.beam}
      initial={{ y: "100cqmax", x: "-50%" }}
      animate={paused ? {} : { y: "-100cqi", x: "-50%" }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  )
}

export const WarpBackground = ({
  children,
  perspective = 100,
  className,
  beamsPerSide = 3,
  beamSize = 5,
  beamDelayMax = 3,
  beamDelayMin = 0,
  beamDuration = 3,
  gridColor = "var(--border)",
  paused = false,
  ...props
}) => {
  const generateBeams = useCallback(() => {
    const beams = []
    const cellsPerSide = Math.floor(100 / beamSize)
    const step = cellsPerSide / beamsPerSide

    for (let i = 0; i < beamsPerSide; i++) {
      const x = Math.floor(i * step)
      const delay = Math.random() * (beamDelayMax - beamDelayMin) + beamDelayMin
      beams.push({ x, delay })
    }
    return beams
  }, [beamsPerSide, beamSize, beamDelayMax, beamDelayMin])

  const topBeams = useMemo(() => generateBeams(), [generateBeams])
  const rightBeams = useMemo(() => generateBeams(), [generateBeams])
  const bottomBeams = useMemo(() => generateBeams(), [generateBeams])
  const leftBeams = useMemo(() => generateBeams(), [generateBeams])

  return (
    <div className={cn(styles.container, className)} {...props}>
      <div
        style={{
          "--perspective": `${perspective}px`,
          "--grid-color": gridColor,
          "--beam-size": `${beamSize}%`,
        }}
        className={styles.gridViewport}
      >
        {/* top side */}
        <div className={cn(styles.side, styles.topSide)}>
          {topBeams.map((beam, index) => (
            <Beam
              key={`top-${index}`}
              width={`${beamSize}%`}
              x={`${beam.x * beamSize}%`}
              delay={beam.delay}
              duration={beamDuration}
              paused={paused}
            />
          ))}
        </div>
        {/* bottom side */}
        <div className={cn(styles.side, styles.bottomSide)}>
          {bottomBeams.map((beam, index) => (
            <Beam
              key={`bottom-${index}`}
              width={`${beamSize}%`}
              x={`${beam.x * beamSize}%`}
              delay={beam.delay}
              duration={beamDuration}
              paused={paused}
            />
          ))}
        </div>
        {/* left side */}
        <div className={cn(styles.side, styles.leftSide)}>
          {leftBeams.map((beam, index) => (
            <Beam
              key={`left-${index}`}
              width={`${beamSize}%`}
              x={`${beam.x * beamSize}%`}
              delay={beam.delay}
              duration={beamDuration}
              paused={paused}
            />
          ))}
        </div>
        {/* right side */}
        <div className={cn(styles.side, styles.rightSide)}>
          {rightBeams.map((beam, index) => (
            <Beam
              key={`right-${index}`}
              width={`${beamSize}%`}
              x={`${beam.x * beamSize}%`}
              delay={beam.delay}
              duration={beamDuration}
              paused={paused}
            />
          ))}
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
export default WarpBackground;
