import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, X } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from './profile-card.module.css';

export function ProfileCard(props) {
  const {
    name = "Michael Chen",
    title = "Senior Software Engineer, Cloud Infrastructure",
    description = "Michael Chen is a seasoned software engineer at TechFlow Solutions with over 8 years of experience building scalable cloud infrastructure and microservices. He specializes in DevOps automation and leads the platform engineering team that serves millions of users daily.",
    imageUrl = "",
    githubUrl = "#",
    linkedinUrl = "#",
    instagramUrl = "#",
    className,
    onClose
  } = props;

  const socialIcons = [
    { icon: Github, url: githubUrl, label: "GitHub" },
    { icon: Instagram, url: instagramUrl, label: "Instagram" },
    { icon: Linkedin, url: linkedinUrl, label: "LinkedIn" },
  ].filter(social => social.url !== "#");

  return (
    <div className={cn(styles.container, className)}>
      {/* Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className={styles.closeBtn}
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Desktop */}
      <div className={styles.desktopLayout}>
        {/* Square Image */}
        {imageUrl && (
          <div className={styles.imageWrapper}>
            <Image
              src={imageUrl}
              alt={name}
              width={480}
              height={480}
              className={styles.img}
              draggable={false}
              priority
              unoptimized
            />
          </div>
        )}
        {/* Overlapping Card - Rectangular & Centered */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            styles.overlappingCard,
            imageUrl ? styles.overlapMargin : ''
          )}
        >
          <div className={styles.header}>
            <h2 className={styles.name}>
              {name}
            </h2>

            <p className={styles.title}>
              {title}
            </p>
          </div>

          <p className={styles.desc}>
            {description}
          </p>

          <div className={styles.socialRow}>
            {socialIcons.map(({ icon: Icon, url, label }) => (
              <Link
                key={label}
                href={url}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.socialLink}
                aria-label={label}
              >
                <Icon className={styles.socialIcon} />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={styles.mobileCard}
      >
        {/* Square Mobile Image */}
        {imageUrl && (
          <div className={styles.mobileImageWrapper}>
            <Image
              src={imageUrl}
              alt={name}
              width={400}
              height={400}
              className={styles.img}
              draggable={false}
              priority
              unoptimized
            />
          </div>
        )}

        <div className={styles.mobilePadding}>
          <h2 className={styles.mobileName}>
            {name}
          </h2>

          <p className={styles.mobileTitle}>
            {title}
          </p>

          <p className={styles.mobileDesc}>
            {description}
          </p>

          <div className={styles.mobileSocialRow}>
            {socialIcons.map(({ icon: Icon, url, label }) => (
              <Link
                key={label}
                href={url}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.mobileSocialLink}
                aria-label={label}
              >
                <Icon className={styles.socialIcon} />
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
