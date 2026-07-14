import {
    motion,
    useMotionTemplate,
    useScroll,
    useTransform,
    useSpring,
} from "framer-motion";
import { useRef } from "react";
import { usePerformance } from "@/hooks/usePerformance";
import styles from "./SmoothScrollHero.module.css";

export const SmoothScrollHero = () => {
    const { isLowPowerMode } = usePerformance();
    return (
        <div className={styles.section}>
            <Hero isLowPowerMode={isLowPowerMode} />
        </div>
    );
};

const SECTION_HEIGHT = 1500;

const Hero = ({ isLowPowerMode }) => {
    const { scrollY } = useScroll();

    const smoothScrollY = useSpring(scrollY, isLowPowerMode ? {
        stiffness: 50,
        damping: 30
    } : {
        mass: 0.1,
        stiffness: 100,
        damping: 20
    });

    return (
        <div
            style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
            className={styles.heroWrapper}
        >
            <CenterImage scrollY={smoothScrollY} />

            {!isLowPowerMode && <ParallaxImages scrollY={smoothScrollY} />}

            <div className={styles.fadeBottom} />
        </div>
    );
};

const CenterImage = ({ scrollY }) => {
    const scale = useTransform(scrollY, [0, SECTION_HEIGHT], [0.5, 1]);
    const borderRadius = useTransform(scrollY, [0, SECTION_HEIGHT], [24, 0]);
    const opacity = useTransform(
        scrollY,
        [SECTION_HEIGHT + 1000, SECTION_HEIGHT + 1600],
        [1, 0]
    );

    const textOpacity = useTransform(scrollY, [0, 200], [1, 0]);
    const textScale = useTransform(scrollY, [0, 200], [1, 1.1]);
    const textY = useTransform(scrollY, [0, 200], [0, 50]);

    return (
        <div className={styles.centerImageWrapper}>
            <motion.div
                style={{
                    scale,
                    borderRadius,
                    opacity,
                    backgroundImage:
                        "url('/screenshots/experience-main.png')",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                }}
                className={styles.bgImage}
            >
                <div className={styles.bgOverlay} />
            </motion.div>

            {/* Title Overlay */}
            <div className={styles.titleOverlay}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{
                        opacity: textOpacity,
                        scale: textScale,
                        y: textY,
                    }}
                    className={styles.titleCard}
                >
                    {/* Ambient Glow */}
                    <div className={styles.cardGlow} />

                    <h1 className={styles.title}>
                        EXPERIENCE
                    </h1>

                    <p className={styles.desc}>
                        Merging technical precision with creative vision.
                        <br className="hidden md:block" />
                        A curated timeline of my professional journey, from foundational code to AI solutions.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

const ParallaxImages = ({ scrollY }) => {
    return (
        <div className={styles.parallaxContainer}>
            {/* 1. Left Small - Moves Fast */}
            <div className={styles.colFast1}>
                <ParallaxImg
                    scrollY={scrollY}
                    src="/screenshots/experience-1.png"
                    alt="Space launch"
                    start={800}
                    end={-1500}
                    className={styles.imgAspect4_3}
                />
            </div>

            {/* 2. Right Small - Moves Moderate */}
            <div className={styles.colMod2}>
                <ParallaxImg
                    scrollY={scrollY}
                    src="/screenshots/experience-2.png"
                    alt="Space launch"
                    start={1000}
                    end={-1500}
                    className={styles.imgAspectSquare}
                />
            </div>

            {/* 3. Center Wide - Moves Slowest */}
            <div className={styles.colSlow3}>
                <ParallaxImg
                    scrollY={scrollY}
                    src="/screenshots/experience-3.png"
                    alt="Satellite view"
                    start={900}
                    end={-1800}
                    className={styles.imgAspectVideo}
                />
            </div>

            {/* 4. Far Left Tall - Moves Very Fast */}
            <div className={styles.colVFast4}>
                <ParallaxImg
                    scrollY={scrollY}
                    src="/screenshots/experience-4.png"
                    alt="Space texture"
                    start={1200}
                    end={-2000}
                    className={styles.imgAspect3_4}
                />
            </div>

            {/* 5. Far Right Wide - Moves Fast */}
            <div className={styles.colFast5}>
                <ParallaxImg
                    scrollY={scrollY}
                    src="/screenshots/experience-5.png"
                    alt="Orbiting satellite"
                    start={1100}
                    end={-2000}
                    className={styles.imgAspectVideo}
                />
            </div>
        </div>
    );
};

const ParallaxImg = ({ className, alt, src, start, end, scrollY }) => {
    const opacity = useTransform(scrollY, [0, SECTION_HEIGHT * 1.2], [1, 0]);
    const scale = useTransform(scrollY, [0, SECTION_HEIGHT], [1, 1.2]);
    const y = useTransform(scrollY, [0, SECTION_HEIGHT], [start, end]);
    const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

    return (
        <motion.img
            src={src}
            alt={alt}
            className={className}
            style={{ transform, opacity }}
        />
    );
};
