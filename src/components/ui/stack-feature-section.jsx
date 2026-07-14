'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';
import styles from './stack-feature-section.module.css';

const iconConfigs = portfolioData.techStack.map((tech) => ({
  Icon: null,
  img: tech.icon,
}));

export default function FeatureSection() {
  const orbitCount = 3;
  const orbitGap = 9; // rem between orbits
  const iconsPerOrbit = Math.ceil(iconConfigs.length / orbitCount);

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.leftContent}>
          <h1 className={styles.heading}>
            Engineering <br className="hidden md:block" /> the Future
          </h1>
          <p className={styles.description}>
            {portfolioData.personal.subtitle}
          </p>
          <div className={styles.buttonGroup}>
            <Button variant="default" asChild className={styles.btnPrimary}>
              <Link href="/projects">View Projects</Link>
            </Button>
            <Button variant="outline" asChild className={styles.btnOutline}>
              <Link href="/resume">My Resume</Link>
            </Button>
          </div>
        </div>

        <div className={styles.rightContent}>
          <div className={styles.orbitContainer}>
            
            <div className={styles.centerCircle}>
              <div className={styles.centerSpin}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg" alt=".NET Core" className={styles.centerIcon} />
              </div>
            </div>

            {[...Array(orbitCount)].map((_, orbitIdx) => {
              const size = `${18 + orbitGap * (orbitIdx + 1)}rem`;
              const angleStep = (2 * Math.PI) / iconsPerOrbit;

              return (
                <div
                  key={orbitIdx}
                  className={`${styles.orbitLine} ${styles[`orbit${orbitIdx}`]}`}
                  style={{
                    width: size,
                    height: size,
                  }}
                >
                  {iconConfigs
                    .slice(orbitIdx * iconsPerOrbit, orbitIdx * iconsPerOrbit + iconsPerOrbit)
                    .map((cfg, iconIdx) => {
                      const angle = iconIdx * angleStep;
                      const x = 50 + 50 * Math.cos(angle);
                      const y = 50 + 50 * Math.sin(angle);

                      return (
                        <div
                          key={iconIdx}
                          className={styles.iconWrapper}
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                          }}
                        >
                          <div 
                            className={`${styles.iconBubble} ${styles[`orbitIcon${orbitIdx}`]}`}
                          >
                            <img
                              src={cfg.img}
                              alt="icon"
                              className={styles.orbitIcon}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
