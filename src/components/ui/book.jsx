"use client";

import React from "react";
import { useResponsive } from "@/components/ui/use-responsive";
import clsx from "clsx";
import styles from './book.module.css';

const DefaultIllustration = (
  <svg fill="none" height="56" viewBox="0 0 36 56" width="36" xmlns="http://www.w3.org/2000/svg">
    <path
      clipRule="evenodd"
      d="M3.03113 28.0005C6.26017 23.1765 11.7592 20.0005 18 20.0005C24.2409 20.0005 29.7399 23.1765 32.9689 28.0005C29.7399 32.8244 24.2409 36.0005 18 36.0005C11.7592 36.0005 6.26017 32.8244 3.03113 28.0005Z"
      fill="#0070F3"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M32.9691 28.0012C34.8835 25.1411 36 21.7017 36 18.0015C36 8.06034 27.9411 0.00146484 18 0.00146484C8.05887 0.00146484 0 8.06034 0 18.0015C0 21.7017 1.11648 25.1411 3.03094 28.0012C6.25996 23.1771 11.7591 20.001 18 20.001C24.2409 20.001 29.74 23.1771 32.9691 28.0012Z"
      fill="#45DEC4"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M32.9692 28.0005C29.7402 32.8247 24.241 36.001 18 36.001C11.759 36.001 6.25977 32.8247 3.03077 28.0005C1.11642 30.8606 0 34.2999 0 38C0 47.9411 8.05887 56 18 56C27.9411 56 36 47.9411 36 38C36 34.2999 34.8836 30.8606 32.9692 28.0005Z"
      fill="#E5484D"
      fillRule="evenodd"
    />
  </svg>
);

export const Book = ({
  title,
  variant = "stripe",
  width = 196,
  color,
  textColor = "var(--ds-gray-1000)",
  illustration,
  textured = false,
  className
}) => {
  const _width = useResponsive(width);
  const _color = color ? color : variant === "simple" ? "var(--ds-background-200)" : "var(--ds-amber-600)";
  const _illustration = illustration ? illustration : DefaultIllustration;

  return (
    <div className={clsx(styles.container, className)}>
      <div
        className={styles.bookRotate}
        style={{ transformStyle: "preserve-3d", minWidth: _width, containerType: "inline-size" }}
      >
        <div
          className={styles.bookBody}
          style={{ width: _width }}
        >
          <div
            className={clsx(
              styles.coverUpper,
              variant === "stripe" && styles.flex1
            )}
            style={{ background: _color }}
          >
            {variant === "stripe" && (
              <div className={styles.illustrationContainer}>
                {_illustration}
              </div>
            )}
            <div className={styles.bindOverlay} style={{ background: "var(--ds-book-bind)" }} />
          </div>
          <div
            className={clsx(
              styles.coverLower,
              (variant === "stripe" || (variant === "simple" && color === undefined)) && styles.gradientBg
            )}
            style={{ background: variant === "simple" && color !== undefined ? _color : undefined }}
          >
            <div className={styles.bindOverlay2} style={{ background: "var(--ds-book-bind)" }} />
            <div
              className={clsx(
                styles.meta,
                variant === "simple" ? styles.gap4 : styles.justifyBetween
              )}
              style={{ containerType: "inline-size", gap: `calc((24px / 196) * ${_width})` }}
            >
              <span
                className={clsx(
                  styles.title,
                  variant === "simple" ? styles.simpleTitle : styles.stripeTitle
                )}
                style={{ color: textColor }}
              >
                {title}
              </span>
              {variant === "stripe" ? (
                <svg className={styles.triangle} height="24" width="24" style={{ fill: textColor }}>
                  <path d="M21,21H3L12,3Z" />
                </svg>
              ) : (
                <div className={styles.illus}>{_illustration}</div>
              )}
            </div>
          </div>
          {textured && (
            <div className={styles.texture} />
          )}
        </div>

        <div
          className={styles.pageSpine}
          style={{
            background: "linear-gradient(90deg, #eaeaea, transparent 70%), linear-gradient(#fff, #fafafa)",
            transform: `translateX(calc(${_width} * 1px - 29cqw / 2 - 3px)) rotateY(90deg) translateX(calc(29cqw / 2))`
          }}
        />
        <div
          className={styles.backCover}
          style={{ width: _width, transform: "translateZ(calc(-1 * 29cqw))" }}
        />
      </div>
    </div>
  );
};
