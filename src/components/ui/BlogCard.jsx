import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import styles from './BlogCard.module.css';

export function BlogCard({ post, index, isHovered, isLowPowerMode }) {
    const t = useTranslations('blog');

    return (
        <Link
            href={`/blog/${post.slug}`}
            className={styles.link}
            data-blog-id={post.id}
        >
            <motion.div
                initial={isLowPowerMode ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: isLowPowerMode ? 0 : index * 0.1 }}
                className={cn(
                    styles.card,
                    isHovered && styles.hoveredCard
                )}
            >
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className={cn(
                        styles.image,
                        isHovered ? styles.imageHovered : styles.imageNormal
                    )}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                <div className={cn(
                    styles.gradientOverlay,
                    isHovered ? styles.overlayHovered : styles.overlayNormal
                )} />

                <div className={styles.contentOverlay}>
                    <h3 className={cn(
                        styles.title,
                        isHovered ? styles.titleHovered : styles.titleNormal
                    )}>
                        {post.title}
                    </h3>

                    <div className={cn(
                        styles.revealSection,
                        isHovered ? styles.revealHovered : styles.revealNormal
                    )}>
                        <p className={styles.excerpt}>
                            {post.excerpt}
                        </p>
                        <div className={styles.footer}>
                            <span className={styles.category}>
                                {t(`categories.${post.category}`)}
                            </span>
                            <span className={styles.date}>
                                {new Date(post.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
