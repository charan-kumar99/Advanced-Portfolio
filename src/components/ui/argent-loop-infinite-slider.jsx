import * as React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { portfolioData } from "@/data/portfolio";
import styles from './argent-loop-infinite-slider.module.css';

const PROJECT_DATA = portfolioData.projects.map((p) => ({
  title: p.title.replace(" - AI GitHub Analyzer", ""),
  image: p.image || "/images/projects/placeholder.png",
  category: p.category || "Full Stack",
  year: p.startDate ? new Date(p.startDate).getFullYear().toString() : "2026",
  description: p.description,
  slug: p.slug,
}));

export function ArgentLoopInfiniteSlider() {
  const containerRef = React.useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 30, mass: 1 });

  const projectArea = 0.85;
  const projectStep = projectArea / PROJECT_DATA.length; 
  const transWindow = 0.05; 

  const scrollMap = [0];
  const yMap = ["0vh"];
  const internalYMap = ["0px"];

  PROJECT_DATA.forEach((_, i) => {
    if (i === 0) return;
    const boundary = i * projectStep;
    scrollMap.push(boundary - transWindow / 2, boundary + transWindow / 2);
    yMap.push(`-${(i-1)*100}vh`, `-${i*100}vh`);
    internalYMap.push(`-${(i-1)*250}px`, `-${i*250}px`);
  });

  scrollMap.push(projectArea, 1);
  yMap.push(`-${(PROJECT_DATA.length-1)*100}vh`, `-${(PROJECT_DATA.length-1)*100}vh`);
  internalYMap.push(`-${(PROJECT_DATA.length-1)*250}px`, `-${(PROJECT_DATA.length-1)*250}px`);

  const currentY = useTransform(smoothProgress, scrollMap, yMap);
  const contentInternalY = useTransform(smoothProgress, scrollMap, internalYMap);

  const bgOpacity = useTransform(smoothProgress, [0, 0.05, projectArea, 1], [0, 1, 1, 0]);
  const mainUIOpacity = useTransform(smoothProgress, [0, 0.05, projectArea, 1], [0, 1, 1, 0]);
  const buttonOpacity = useTransform(smoothProgress, [projectArea, projectArea + 0.05], [0, 1]);
  const finalContainerY = useTransform(smoothProgress, [projectArea, projectArea + 0.05], ["0px", "-250px"]);
  const imageY = useTransform(smoothProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.sliderWrapper}>
        <motion.div style={{ opacity: bgOpacity }}>
          <div className={styles.mistOverlay} />
          <motion.div className={styles.projectList} style={{ y: currentY }}>
            {PROJECT_DATA.map((data, i) => (
              <div key={i} className={styles.project} style={{ top: `${i * 100}vh` }}>
                <motion.img src={data.image} alt={data.title} style={{ y: imageY }} className={styles.projectImg} />
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className={styles.centerContainer}>
          <motion.div 
            style={{ y: finalContainerY, willChange: "transform" }}
            className={styles.flexColCenter}
          >
            <motion.div style={{ opacity: mainUIOpacity }} className={styles.minimapBarOuter}>
              <div className={styles.minimapContentViewport}>
                <div className={styles.minimapImgPreview}>
                  <motion.div style={{ y: contentInternalY }} className="w-full h-full relative">
                    {PROJECT_DATA.map((data, i) => (
                      <div key={i} className={styles.minimapImgItem} style={{ top: `${i * 250}px` }}>
                        <img src={data.image} alt={data.title} />
                      </div>
                    ))}
                  </motion.div>
                </div>
                <div className={styles.minimapInfoList}>
                  <motion.div style={{ y: contentInternalY }} className="w-full h-full relative">
                    {PROJECT_DATA.map((data, i) => {
                      const num = (i + 1).toString().padStart(2, "0");
                      return (
                        <div key={i} className={styles.minimapItemInfo} style={{ top: `${i * 250}px` }}>
                          <div className={styles.minimapItemInfoRow}>
                            <p className="font-medium opacity-100">{num}</p>
                            <h4 className={styles.infoTitle}>
                              {data.title}
                            </h4>
                          </div>
                          <div className={styles.minimapItemInfoRow}>
                            <p>{data.category}</p>
                            <p className="tabular-nums">{data.year}</p>
                          </div>
                          <div className={styles.minimapItemInfoRow}>
                            <p>
                              {data.description}
                            </p>
                            <Link 
                                href={`/projects/${data.slug}`} 
                                className={styles.viewMoreLink}
                            >
                              <span className={styles.viewMoreSpan}>View More</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <div className={styles.buttonZone}>
              <motion.div 
                style={{ 
                  opacity: buttonOpacity,
                  pointerEvents: useTransform(smoothProgress, (v) => v > projectArea ? "auto" : "none")
                }}
              >
                <div className={styles.buttonContainer}>
                  <a 
                    href={portfolioData.personal.socialLinks.find(s => s.platform.toLowerCase() === 'github')?.url || 'https://github.com/charan-kumar99'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.customBtnGithub}
                    title="GitHub Profile"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                  
                  <div className={styles.groupProjects}>
                    <Link href="/projects" className={styles.customBtn}>
                      View More
                    </Link>
                    <Link href="/projects" className={styles.customBtnArrow}>
                      <ArrowRight className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          style={{ opacity: useTransform(smoothProgress, [0, 0.05, projectArea, projectArea + 0.05], [0, 1, 1, 0]) }}
          className={styles.slideOverlay}
        >
           <span className={styles.slideLabel}>Page</span>
           <div className={styles.slideLine}>
              <motion.div 
                className={styles.slideProgress} 
                style={{ width: useTransform(smoothProgress, [0, projectArea], ["0%", "100%"]) }} 
              />
           </div>
           <motion.span className={styles.slideCount}>
              {useTransform(smoothProgress, (v) => {
               const idx = Math.min(Math.floor(v / projectStep), PROJECT_DATA.length - 1);
               return `${idx + 1} / ${PROJECT_DATA.length}`;
             })}
           </motion.span>
        </motion.div>
      </div>
    </div>
  );
}
export default ArgentLoopInfiniteSlider;
