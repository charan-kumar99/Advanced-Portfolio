"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { cn } from "@/lib/utils"
import styles from './text-reveal.module.css'

export const TextReveal = ({ children, className }) => {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string")
  }

  const words = children.split(" ")

  return (
    <div ref={targetRef} className={cn(styles.container, className)}>
      <div className={styles.stickyBox}>
        <span ref={targetRef} className={styles.textSpan}>
          {words.map((word, i) => {
            const start = i / words.length
            const end = start + 1 / words.length
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            )
          })}
        </span>
      </div>
    </div>
  )
}

const Word = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className={styles.wordContainer}>
      <span className={styles.shadowWord}>{children}</span>
      <motion.span
        style={{ opacity: opacity }}
        className={styles.litWord}
      >
        {children}
      </motion.span>
    </span>
  )
}
