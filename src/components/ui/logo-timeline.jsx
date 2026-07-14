"use client"

import * as React from "react"
import { useEffect } from "react"
import { motion, stagger, useAnimate, useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { Icons } from "../icons"
import styles from './logo-timeline.module.css';

export function LogoTimeline({
  title,
  subtitle = "The technologies and tools I use to build amazing projects",
  height = "h-[280px] sm:h-[350px] md:h-[400px] lg:h-[480px]",
  className,
  iconSize = 16,
  isLowPowerMode,
}) {
  const [scope, animate] = useAnimate()
  const isInView = useInView(scope, { once: true })

  const techItems = [
    { label: "React", icon: "react", animationDelay: 0, animationDuration: 20, row: 0 },
    { label: "Next.js", icon: "nextjs", animationDelay: 0, animationDuration: 25, row: 0 },
    { label: "TypeScript", icon: "typescript", animationDelay: 0, animationDuration: 22, row: 0 },
    { label: "Tailwind CSS", icon: "tailwind", animationDelay: 0, animationDuration: 28, row: 0 },
    { label: "Three.js", icon: "framer", animationDelay: 0, animationDuration: 24, row: 1 },
    { label: "GSAP", icon: "framer", animationDelay: 0, animationDuration: 26, row: 1 },
    { label: "Python", icon: "server", animationDelay: 0, animationDuration: 21, row: 1 },
    { label: "Flask", icon: "server", animationDelay: 0, animationDuration: 24, row: 1 },
    { label: "LangChain", icon: "openai", animationDelay: 0, animationDuration: 27, row: 2 },
    { label: "Ollama", icon: "openai", animationDelay: 0, animationDuration: 20, row: 2 },
    { label: "TensorFlow", icon: "server", animationDelay: 0, animationDuration: 29, row: 2 },
    { label: "Keras", icon: "server", animationDelay: 0, animationDuration: 23, row: 2 },
    { label: "Go", icon: "server", animationDelay: 0, animationDuration: 25, row: 3 },
    { label: "Gin", icon: "server", animationDelay: 0, animationDuration: 28, row: 3 },
    { label: "Solidity", icon: "v0", animationDelay: 0, animationDuration: 22, row: 3 },
    { label: "Ethereum", icon: "applePay", animationDelay: 0, animationDuration: 26, row: 3 },
    { label: "Java", icon: "server", animationDelay: 0, animationDuration: 23, row: 4 },
    { label: "Spring Boot", icon: "server", animationDelay: 0, animationDuration: 25, row: 4 },
    { label: "Laravel", icon: "server", animationDelay: 0, animationDuration: 21, row: 4 },
    { label: "PostgreSQL", icon: "postgresql", animationDelay: 0, animationDuration: 24, row: 4 },
    { label: "MongoDB", icon: "mongodb", animationDelay: 0, animationDuration: 27, row: 5 },
    { label: "Firebase", icon: "googleDrive", animationDelay: 0, animationDuration: 20, row: 5 },
    { label: "Prisma", icon: "radix", animationDelay: 0, animationDuration: 29, row: 5 },
    { label: "Docker", icon: "docker", animationDelay: 0, animationDuration: 22, row: 5 },
    { label: "Kubernetes", icon: "kubernetes", animationDelay: 0, animationDuration: 30, row: 6 },
    { label: "AWS", icon: "aws", animationDelay: 0, animationDuration: 25, row: 6 },
    { label: "Azure", icon: "azure", animationDelay: 0, animationDuration: 28, row: 6 },
    { label: "Vercel", icon: "vercel", animationDelay: 0, animationDuration: 22, row: 6 },
  ];

  const toolItems = [
    { label: "Git", icon: "git", animationDelay: 0, animationDuration: 20, row: 0 },
    { label: "GitHub", icon: "github", animationDelay: 0, animationDuration: 25, row: 0 },
    { label: "VS Code", icon: "vscode", animationDelay: 0, animationDuration: 22, row: 0 },
    { label: "Figma", icon: "figma", animationDelay: 0, animationDuration: 28, row: 1 },
    { label: "Postman", icon: "postman", animationDelay: 0, animationDuration: 23, row: 1 },
    { label: "Jira", icon: "jira", animationDelay: 0, animationDuration: 26, row: 2 },
    { label: "Slack", icon: "slack", animationDelay: 0, animationDuration: 21, row: 2 },
    { label: "Docker", icon: "docker", animationDelay: 0, animationDuration: 24, row: 3 },
    { label: "Vercel", icon: "vercel", animationDelay: 0, animationDuration: 27, row: 3 },
    { label: "Netlify", icon: "netlify", animationDelay: 0, animationDuration: 20, row: 4 },
    { label: "MetaMask", icon: "paypal", animationDelay: 0, animationDuration: 29, row: 4 },
  ];

  const rows = React.useMemo(() => {
    const rowCount = 7;
    const itemsPerRow = 4;

    const allItems = [...techItems, ...toolItems];

    return Array.from({ length: rowCount }).map((_, rowIndex) => {
      const isReverse = rowIndex % 2 === 1;
      const rowBaseDuration = 18 + (rowIndex * 2);

      const items = Array.from({ length: itemsPerRow }).map((_, i) => {
        const itemIndex = (rowIndex * itemsPerRow + i) % allItems.length;
        const item = allItems[itemIndex];

        return {
          ...item,
          animationDuration: rowBaseDuration * (isLowPowerMode ? 1.5 : 1)
        };
      });
      return items;
    });
  }, [isLowPowerMode]);

  useEffect(() => {
    if (isInView && title) {
      animate(
        `.${styles.titleWord}`,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        },
        {
          duration: 0.6,
          delay: stagger(0.1),
        }
      )
    }
  }, [isInView, animate, title])

  const titleWords = title?.split(" ") || []

  // Resolve height class from next-compatible dynamic values
  const viewHeightClass = cn(
    styles.viewport,
    isLowPowerMode ? "h-64" : height
  );

  return (
    <div className={cn(styles.container, className)}>
      {/* Animated Title at the top */}
      {title && (
        <div ref={scope} className={styles.header}>
          <h2 className={styles.title}>
            {titleWords.map((word, idx) => (
              <motion.span
                key={word + idx}
                className={styles.titleWord}
                style={{
                  filter: "blur(10px)",
                  transform: "translateY(20px)",
                  paddingRight: "0.2em",
                }}
              >
                <span className={styles.gradientText}>
                  {word}
                </span>
              </motion.span>
            ))}
          </h2>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {subtitle}
          </motion.p>
        </div>
      )}

      {/* Timeline container - dynamic filling */}
      <div className={viewHeightClass}>
        {!isLowPowerMode && (
          <>
            <div className={styles.glowLeft} />
            <div className={styles.glowRight} />
          </>
        )}

        <div className={styles.rowsList}>
          {rows.map((rowItems, rowIndex) => {
            const isReverse = rowIndex % 2 === 1

            return (
              <div key={rowIndex} className={styles.rowWrapper}>
                <div className={cn(styles.trackLine, "dotted-track")} />

                {rowItems.map((item, itemIndex) => {
                  const IconComponent = Icons[item.icon] || Icons.unknown
                  const totalItems = rowItems.length
                  const offsetPercent = (itemIndex / totalItems) * 100

                  return (
                    <motion.div
                      key={`${item.label}-${itemIndex}`}
                      className={styles.tag}
                      style={{ y: "-50%" }}
                      initial={{ left: isReverse ? "120%" : "-20%" }}
                      animate={{ left: isReverse ? "-20%" : "120%" }}
                      transition={{
                        left: {
                          duration: item.animationDuration,
                          repeat: Infinity,
                          repeatType: "mirror",
                          ease: "easeInOut",
                          delay: -((item.animationDuration * offsetPercent) / 100)
                        }
                      }}
                    >
                      <IconComponent style={{ width: iconSize, height: iconSize }} className={styles.tagIcon} />
                      <span className={styles.tagLabel}>{item.label}</span>
                    </motion.div>
                  )
                })}
              </div>
            )
          })}
        </div>

        <style>{`
          .dotted-track {
            background-image: repeating-linear-gradient(to right, rgba(96, 165, 250, 0.2) 0, rgba(96, 165, 250, 0.2) 3px, transparent 3px, transparent 10px);
          }
          .dark .dotted-track {
            background-image: repeating-linear-gradient(to right, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 3px, transparent 3px, transparent 15px);
          }
        `}</style>
      </div>
    </div>
  )
}
