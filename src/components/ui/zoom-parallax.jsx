'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import styles from './zoom-parallax.module.css';

export function ZoomParallax({ images, children }) {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	return (
		<div ref={container} className={styles.container}>
			<div className={styles.stickyWrapper}>
				{images.slice(0, 7).map(({ src, alt }, index) => {
					const scale = scales[index % scales.length];

					const indexClass = {
						1: styles.cardIndex1,
						2: styles.cardIndex2,
						3: styles.cardIndex3,
						4: styles.cardIndex4,
						5: styles.cardIndex5,
						6: styles.cardIndex6,
					}[index] || "";

					return (
						<motion.div
							key={index}
							style={{ scale }}
							className={cn(styles.cardWrapper, indexClass)}
						>
							<div className={styles.innerCard}>
								{index === 0 && children ? (
									<div className={styles.childrenWrapper}>
										<img
											src={src || '/placeholder.svg'}
											alt={alt || `Parallax image ${index + 1}`}
											className={styles.img}
										/>
										<div className={styles.overlay} />
										
										<div className={styles.childrenContent}>
											{children}
										</div>
									</div>
								) : (
									<img
										src={src || '/placeholder.svg'}
										alt={alt || `Parallax image ${index + 1}`}
										className={styles.plainImg}
									/>
								)}
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
export default ZoomParallax;
