"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import { portfolioData } from "@/data/portfolio";
import {
  Users, Brain, Users2, MessageSquare, LineChart, Search
} from "lucide-react";
import styles from './horizontal-scroll-carousel.module.css';

const skillIcons = {
  'Analytical Thinking': LineChart,
  'Active Listening': MessageSquare,
  'Team Leadership': Users,
  'Fast Learner': Brain,
  'Detail-Oriented': Search,
  'Collaborative': Users2,
};

const skillVisuals = {
  'Analytical Thinking': 'https://illustrations.popsy.co/white/success.svg',
  'Active Listening': 'https://illustrations.popsy.co/white/communication.svg',
  'Team Leadership': 'https://illustrations.popsy.co/white/team-idea.svg',
  'Fast Learner': 'https://illustrations.popsy.co/white/student-going-to-school.svg',
  'Detail-Oriented': 'https://illustrations.popsy.co/white/presentation.svg',
  'Collaborative': 'https://illustrations.popsy.co/white/shaking-hands.svg',
};

const allCards = portfolioData.softSkills.slice(0, 10).map((skill, index) => ({
  id: index + 1,
  title: skill.name,
  description: skill.description,
  url: skillVisuals[skill.name] || 'https://illustrations.popsy.co/white/abstract-art-6.svg',
  Icon: skillIcons[skill.name] || Users
}));

export const HorizontalScrollCarousel = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  return (
    <section 
        ref={targetRef} 
        className={styles.section}
    >
      <div className={styles.stickyWrapper}>
        
        {/* Title Section (Didorong ke paling atas layar) */}
        <div className={styles.titleArea}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className={styles.title}>
                  Strategic <br /> Directives
              </h2>
              <div className={styles.divider}></div>
              <p className={styles.subtitle}>
                  Interpersonal capabilities engineered for high-impact leadership and systemic problem solving in complex environments.
              </p>
            </motion.div>
        </div>

        {/* Carousel Items (Rata atas dengan jarak pasti agar teks tidak nempel) */}
        <div className={styles.carouselTrack}>
          <motion.div style={{ x }} className={styles.scrollList}>
            {allCards.map((card) => {
              return <Card card={card} key={card.id} />;
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Card = ({ card }) => {
  const { Icon } = card;
  return (
    <div
      key={card.id}
      className={styles.card}
    >
      <div className={styles.imageContainer}>
        <img
          src={card.url}
          alt={card.title}
          className={styles.img}
        />
      </div>
      
      <div className={styles.fadeOverlay}></div>
      
      <div className={styles.content}>
        <div className={styles.iconRow}>
            <div className={styles.iconBox}>
                <Icon className={styles.icon} />
            </div>
            <span className={styles.idText}>
                #{String(card.id).padStart(2, '0')}
            </span>
        </div>
        
        <h3 className={styles.cardTitle}>
          {card.title}
        </h3>
        
        <p className={styles.cardDesc}>
          {card.description}
        </p>
      </div>
    </div>
  );
};

export default HorizontalScrollCarousel;
