"use client"

import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import styles from './meteors.module.css'

export const Meteors = ({
  number = 20,
  className = "",
  minDelay = 0.2,
  maxDelay = 7,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  isLowPowerMode = false,
}) => {
  const [meteorStyles, setMeteorStyles] = useState([])

  useEffect(() => {
    if (isLowPowerMode) {
      setMeteorStyles([]);
      return;
    }
    const stylesList = [...new Array(number || 20)].map(() => ({
      "--angle": -angle + "deg",
      top: "-5%",
      left: `${Math.floor(Math.random() * 100)}%`,
      animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + "s",
      animationDuration:
        Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) +
        "s",
    }))
    setMeteorStyles(stylesList)
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle, isLowPowerMode])

  if (isLowPowerMode) {
    return null;
  }

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        <span
          key={idx}
          style={style}
          className={cn(styles.meteor, className)}
        >
          <div className={styles.tail} />
        </span>
      ))}
    </>
  )
}
