import { Zap } from 'lucide-react';
import { motion, useInView, animate } from 'framer-motion';
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";
import styles from './wakatime-showcase.module.css';

const Counter = ({ value, duration = 1.5, trigger = true }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const targetValue = typeof value === 'string' 
    ? parseInt(value.replace(/,/g, '').match(/\d+/)?.[0] || '0', 10) 
    : value;

  useEffect(() => {
    if (isInView && trigger && targetValue > 0) {
      const controls = animate(0, targetValue, {
        duration,
        onUpdate: (latest) => setCount(Math.floor(latest)),
        ease: "easeOut"
      });
      return () => controls.stop();
    }
  }, [isInView, trigger, targetValue, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
    </span>
  );
};

export const WakaTimeShowcase = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setMounted(true);
    fetch('/api/wakatime-stats')
      .then(r => r.ok ? r.json() : null)
      .then(result => { if (result) setData(result); })
      .catch(e => console.error("WakaTime fetch failed:", e))
      .finally(() => setLoading(false));
  }, []);

  if (!mounted) return null;

  const stats = [
    { label: "Total This Week", value: loading ? "..." : (data?.totalThisWeek || "—") },
    { label: "Daily Average", value: loading ? "..." : (data?.dailyAverage || "—") },
    { label: "Best Day", value: loading ? "..." : (data?.bestDay?.text || "—") },
    { label: "All-Time", value: loading ? "..." : (data?.allTimeCoding || "—") },
  ];

  return (
    <section id='wakatime-stats' className={styles.section}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={cn(
          styles.card,
          loading && styles.loading
        )}
      >
        <div className={styles.mainFlex}>
          <div className={styles.headerSpace}>
            <div className={styles.orangeTitle}>
              <Zap className="w-8 h-8" />
              <span className={styles.subTitleText}>WakaTime Metrics</span>
            </div>

            <h2 className={styles.mainHeading}>
              Coding{" "}
              <span className="flex items-center gap-2">
                Velocity <span className={styles.textOrange}>Analyzed.</span>
              </span>
            </h2>

            <div className={styles.flexRowWrap}>
              {stats.map((s, i) => (
                <div key={i} className={styles.statCol}>
                  <span className={styles.statNum}>
                    <Counter value={s.value} trigger={!loading} />
                    <span className={styles.unitText}>
                      {typeof s.value === 'string' ? s.value.split(" ")[1] : ''}
                    </span>
                  </span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className={styles.description}>
            Coding activity over the past 7&nbsp;days, streamed directly from the WakaTime authenticated API.
          </p>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerLabel}>
            Verified WakaTime Pulse Integration
          </p>
          <div className={styles.liveIndicator}>
            <div className={styles.pulseDot} />
            <span className={styles.indicatorText}>Live Authenticated Stream</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default WakaTimeShowcase;
