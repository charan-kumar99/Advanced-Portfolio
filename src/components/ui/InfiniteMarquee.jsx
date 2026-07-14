"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import styles from "./InfiniteMarquee.module.css";

export const InfiniteMarquee = ({
  items,
  speed = 20,
  direction = "left",
  className,
  itemClassName,
}) => {
  return (
    <div className={cn(styles.container, className)}>
      <motion.div
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
        className={styles.inner}
      >
        <div className={styles.group}>
          {items.map((item, idx) => (
            <div key={idx} className={cn(styles.item, itemClassName)}>
              {item}
            </div>
          ))}
        </div>
        <div className={styles.group}>
          {items.map((item, idx) => (
            <div key={`second-${idx}`} className={cn(styles.item, itemClassName)}>
              {item}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
