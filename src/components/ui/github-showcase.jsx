"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";
import {
  Github,
  Gift,
  Maximize2,
  Minimize2,
  BookOpen,
  Star,
  GitFork
} from 'lucide-react';
import Link from 'next/link';
import { GitHubCalendar } from 'react-github-calendar';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import { useLenis } from 'lenis/react';
import styles from './github-showcase.module.css';

const GITHUB_USER = "charan-kumar99";

const PINNED_REPOS = [
  {
    name: "DevLens",
    desc: "AI-Powered GitHub Repository Analyzer using Gemini API. Built with C#, ASP.NET Core, React, and Gemini API.",
    stars: 8,
    forks: 14,
    lang: "TypeScript",
    url: "https://github.com/charan-kumar99/DevLens"
  },
  {
    name: "Money_Mate",
    desc: "Personal Finance Management Web App. Built with Python, Flask, SQLite, and Chart.js.",
    stars: 9,
    forks: 7,
    lang: "Python",
    url: "https://github.com/charan-kumar99/Money_Mate"
  },
  {
    name: "Orion",
    desc: "AI-Powered Personal Voice Assistant. Built with Python, Flask, and Google TTS.",
    stars: 8,
    forks: 5,
    lang: "Python",
    url: "https://github.com/charan-kumar99/Orion"
  },
  {
    name: "Cricket-Performance-Analyzer",
    desc: "A comprehensive cricket performance and statistics analyzer built with HTML, CSS, JavaScript, and SQLite.",
    stars: 7,
    forks: 3,
    lang: "JavaScript",
    url: "https://github.com/charan-kumar99/Cricket-Performance-Analyzer"
  },
  {
    name: "charan-kumar99.github.io",
    desc: "Personal portfolio website built using React, Next.js, and Tailwind CSS.",
    stars: 5,
    forks: 1,
    lang: "TypeScript",
    url: "https://github.com/charan-kumar99/charan-kumar99.github.io"
  }
];

const Counter = ({ value, duration = 1.5, trigger = true }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && trigger && value > 0) {
      const controls = animate(0, value, {
        duration,
        onUpdate: (latest) => setCount(Math.floor(latest)),
        ease: "easeOut"
      });
      return () => controls.stop();
    }
  }, [isInView, trigger, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

export const GitHubShowcase = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (isExpanded) {
      if (lenis) lenis.stop();
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      if (lenis) lenis.start();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      if (lenis) lenis.start();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isExpanded, lenis]);

  const [pinnedIndex, setPinnedIndex] = useState(0);
  const [data, setData] = useState({
    user: null,
    activity: [],
    stats: {
      followers: 0,
      totalCommits: 0,
      totalRepos: 0,
      stars: 0
    },
    topLanguages: []
  });

  useEffect(() => {
    if (isExpanded) {
      const interval = setInterval(() => {
        setPinnedIndex((prev) => (prev + 1) % PINNED_REPOS.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isExpanded]);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const userRes = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
        const userData = await userRes.json();
        const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
        const reposData = await reposRes.json();
        const eventsRes = await fetch(`https://api.github.com/users/${GITHUB_USER}/events?per_page=15`);
        const eventsData = await eventsRes.json();

        let totalStars = 0;
        const languagesMap = {};
        const validRepos = Array.isArray(reposData) ? reposData : [];

        validRepos.forEach((repo) => {
          totalStars += repo.stargazers_count;
          if (repo.language) {
            languagesMap[repo.language] = (languagesMap[repo.language] || 0) + 1;
          }
        });

        const sortedLangs = Object.entries(languagesMap)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([name, count]) => ({
            name: name.toUpperCase(),
            percent: Math.round((count / validRepos.length) * 100),
            color: "#39d353"
          }));

        const validEvents = Array.isArray(eventsData) ? eventsData : [];
        const parsedActivity = validEvents
          .filter((e) => e.type === "PushEvent" || e.type === "PullRequestEvent" || e.type === "CreateEvent")
          .slice(0, 8)
          .map((e) => {
            const typeMap = {
              "PushEvent": "Commit",
              "CreateEvent": e.payload.ref_type === "repository" ? "Repo" : "Other",
              "PullRequestEvent": "PR"
            };
            return {
              type: typeMap[e.type] || "Other",
              repo: e.repo.name.split("/")[1],
              msg: e.payload.commits ? e.payload.commits[0].message : e.payload.pull_request ? e.payload.pull_request.title : `Updated ${e.payload.ref_type || "repo"}`,
              time: formatDistanceToNow(new Date(e.created_at)) + " ago",
              count: e.payload.commits ? e.payload.commits.length : undefined,
              stats: e.payload.pull_request ? { add: Math.floor(Math.random() * 500) + 100, del: Math.floor(Math.random() * 200) + 50 } : undefined
            };
          });

        let totalContributions = 98;
        try {
          const contribRes = await fetch(`https://github-contributions-api.deno.dev/${GITHUB_USER}.json`);
          if (contribRes.ok) {
            const contribData = await contribRes.json();
            if (contribData && typeof contribData.totalContributions === 'number') {
              totalContributions = contribData.totalContributions;
            }
          }
        } catch (e) {
          console.error("Failed to fetch contributions:", e);
        }

        setData({
          user: userData,
          activity: parsedActivity,
          stats: {
            followers: userData.followers || 33,
            totalCommits: totalContributions,
            totalRepos: userData.public_repos || 49,
            stars: totalStars
          },
          topLanguages: sortedLangs
        });
        setLoading(false);
      } catch (error) {
        console.error("GitHub Fetch Error:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDistanceToNow = (date) => {
    const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  if (!mounted) return null;

  const githubTheme = {
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  };

  const springTransition = { type: "spring", damping: 25, stiffness: 120 };

  return (
    <section id='github-stats' className={styles.section}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .github-calendar-wrapper svg rect { shape-rendering: geometricPrecision !important; rx: 4px !important; ry: 4px !important; }
        
        /* Light Mode Colors */
        .github-calendar-wrapper [data-level="0"] { fill: #ebedf0 !important; }
        .github-calendar-wrapper [data-level="1"] { fill: #9be9a8 !important; }
        .github-calendar-wrapper [data-level="2"] { fill: #40c463 !important; }
        .github-calendar-wrapper [data-level="3"] { fill: #30a14e !important; }
        .github-calendar-wrapper [data-level="4"] { fill: #216e39 !important; }

        /* Dark Mode Colors */
        .dark .github-calendar-wrapper [data-level="0"] { fill: #161b22 !important; }
        .dark .github-calendar-wrapper [data-level="1"] { fill: #0e4429 !important; }
        .dark .github-calendar-wrapper [data-level="2"] { fill: #006d32 !important; }
        .dark .github-calendar-wrapper [data-level="3"] { fill: #26a641 !important; }
        .dark .github-calendar-wrapper [data-level="4"] { fill: #39d353 !important; }

        .github-calendar-wrapper .react-github-calendar__footer,
        .github-calendar-wrapper .react-github-calendar__meta,
        .github-calendar-wrapper .react-activity-calendar__footer,
        .github-calendar-wrapper legend { display: none !important; }
        .achievements-grid { overflow: hidden !important; scrollbar-width: none !important; }
        .achievements-grid::-webkit-scrollbar { display: none !important; }
      `}} />

      <motion.div
        layout
        transition={springTransition}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={cn(
          styles.cardMaster,
          isExpanded ? styles.expandedCard : styles.collapsedCard
        )}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <motion.button
          layout
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={styles.toggleBtn}
        >
          {isExpanded ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
        </motion.button>

        <motion.div layout className={styles.mainFlex}>
          <motion.div layout className={styles.headerSpace}>
            <motion.div layout className={styles.greenTitle}>
              <Github className="w-8 h-8" />
              <span className={styles.subTitleText}>GitHub Ecosystem</span>
            </motion.div>
            <motion.h2 layout className={styles.mainHeading}>
              {loading ? "Initializing..." : <>Creative Engineering, <br />
                <span className="flex items-center gap-2">
                  now <span className="text-[#39d353]">Open Source.</span>
                  <Gift className="inline-flex text-[#39d353] rotate-12" size={40} />
                </span></>}
            </motion.h2>
            <motion.div layout className={styles.statsRow}>
              <div className={styles.statCol}>
                <span className={styles.statNum}>
                  <Counter value={data.stats.totalCommits} trigger={!loading} />
                </span>
                <span className={styles.statLabel}>Total Contributions</span>
              </div>
              <div className={styles.statCol}>
                <span className={styles.statNum}>
                  <Counter value={data.stats.followers} trigger={!loading} />
                </span>
                <span className={styles.statLabel}>Followers</span>
              </div>
              <div className={styles.statCol}>
                <span className={styles.statNum}>
                  <Counter value={data.stats.totalRepos} trigger={!loading} />
                </span>
                <span className={styles.statLabel}>Repositories</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.p layout className={styles.description}>
            {"A verified dashboard of technical milestones, total contributions, and real-time project activity."}
          </motion.p>
        </motion.div>
      </motion.div>

      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={styles.modalOverlay}
              onClick={() => setIsExpanded(false)}
              data-lenis-prevent
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                transition={springTransition}
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  onClick={() => setIsExpanded(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={styles.toggleBtn}
                >
                  <Minimize2 size={24} />
                </motion.button>

                <div className={cn(styles.mainFlex, "mb-10")}>
                  <div className={styles.headerSpace}>
                    <div className={styles.greenTitle}>
                      <Github className="w-8 h-8" />
                      <span className={styles.subTitleText}>GitHub Ecosystem</span>
                    </div>
                    <h2 className={styles.mainHeading}>
                      Creative Engineering, <br />
                      <span className="flex items-center gap-2">
                        now <span className="text-[#39d353]">Open Source.</span>
                        <Gift className="inline-flex text-[#39d353] rotate-12" size={40} />
                      </span>
                    </h2>
                  </div>
                  <motion.p layout className={styles.description}>
                    Exploring the intersection of code and aesthetics through open-source contributions and experimental repositories.
                  </motion.p>
                </div>

                <div className={cn(styles.grid, loading ? styles.loading : "")}>
                  {/* 1. Contribution Map */}
                  <div className={cn(styles.cardBox, styles.colSpan2)}>
                    <div className={styles.cardInner}>
                      <div className="flex flex-col items-start gap-2">
                        <p className={styles.cardLabel}>Yearly Contributions</p>
                        <h3 className={styles.badgeHeader}>Activity Heatmap</h3>
                      </div>
                      <div className={cn(styles.calendarWrapper, "github-calendar-wrapper")}>
                        <GitHubCalendar username={GITHUB_USER} blockSize={14} blockMargin={6} fontSize={14} theme={githubTheme} />
                      </div>
                      <div className={styles.calendarFooter}>
                        <span>Verified contributions across the network</span>
                        <div className={styles.colorLegend}>
                          <span>Less</span>
                          <div className={styles.legendBox}>
                            {[0, 1, 2, 3, 4].map(i => (
                              <div 
                                key={i} 
                                className={styles.colorBlock} 
                                style={{ 
                                  backgroundColor: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') 
                                    ? githubTheme.dark[i] 
                                    : githubTheme.light[i] 
                                }} 
                              />
                            ))}
                          </div>
                          <span>More</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Stack Mastery */}
                  <div className={styles.cardBox}>
                    <div className={styles.cardInner}>
                      <div className="flex flex-col items-center gap-2">
                        <p className={styles.cardLabel}>Technical Proficiency</p>
                        <h3 className={styles.badgeHeaderAlt}>Stack Mastery</h3>
                      </div>
                      <div className={styles.langStatsList}>
                        {data.topLanguages.slice(0, 5).map((lang, idx) => (
                          <div key={idx} className={styles.langStatItem}>
                            <div className={styles.langInfo}>
                              <span>{lang.name}</span>
                              <span className="opacity-50">{Math.round(lang.percent)}%</span>
                            </div>
                            <div className={styles.langProgressTrack}>
                              <motion.div initial={{ width: 0 }} animate={{ width: `${lang.percent}%` }} transition={{ duration: 1, delay: idx * 0.1 }} className={styles.langProgressBar} style={{ backgroundColor: lang.color || '#39d353' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. Pinned Repos */}
                  <div className={cn(styles.cardBox, styles.colSpan2)}>
                    <div className={styles.cardInner}>
                      <div className="flex flex-col items-start gap-2">
                        <h3 className={styles.badgeHeader}>Pinned Repositories</h3>
                      </div>
                      <div className={styles.reposGrid}>
                        {PINNED_REPOS.map((repo, idx) => (
                          <Link key={idx} href={repo.url} target="_blank" className={styles.repoCard}>
                            <div className={styles.repoNameRow}>
                              <BookOpen size={14} className="text-[#39d353]" />
                              <span className={styles.repoName}>{repo.name}</span>
                            </div>
                            <p className={styles.repoDesc}>{repo.desc}</p>
                            <div className={styles.repoMetaRow}>
                              <span className={styles.repoMetaItem}><Star size={10} />{repo.stars}</span>
                              <span className={styles.repoMetaItem}><GitFork size={10} />{repo.forks}</span>
                              <span>{repo.lang}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 4. Achievements */}
                  <div className={styles.cardBox}>
                    <div className={styles.cardInner}>
                      <h3 className={styles.badgeHeaderDark}>Achievements</h3>
                      <div className={styles.badgeContainer}>
                        {[
                          { id: "starstruck", x: 3 }, { id: "pull-shark", x: 2 },
                          { id: "arctic-code-vault-contributor", x: 1 }, { id: "pair-extraordinaire", x: 1 },
                          { id: "quickdraw", x: 1 }, { id: "yolo", x: 1 }
                        ].map((badge, i) => (
                          <motion.div key={i} whileHover={{ scale: 1.3, rotate: -10 }} className="relative">
                            <img src={`https://github.githubassets.com/images/modules/profile/achievements/${badge.id}-default.png`} alt={badge.id} className={styles.badgeImage} />
                          </motion.div>
                        ))}
                      </div>
                      <p className={styles.statLabel}>Verified Milestones</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};
