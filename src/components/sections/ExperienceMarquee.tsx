import React, { useRef, useState, useEffect, useCallback } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame,
} from "framer-motion";
import Image from "next/image";
import { portfolioData } from "@/data/portfolio";
import { TechStack, Tool } from "@/types";
import { usePerformance } from "@/hooks/usePerformance";
import { cn } from "@/lib/utils";

interface ParallaxProps {
    children: React.ReactNode;
    baseVelocity: number;
    isLowPowerMode?: boolean;
}

function ParallaxText({ children, baseVelocity = 100, isLowPowerMode = false }: ParallaxProps) {
    const baseX = useMotionValue(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentWidth, setContentWidth] = useState(0);

    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400,
    });

    // Always positive acceleration factor — direction is handled separately
    const velocityFactor = useTransform(smoothVelocity, (latest) => {
        return (Math.abs(latest) / 1000) * 5;
    });

    // Measure actual pixel width of one content copy
    const measure = useCallback(() => {
        if (contentRef.current) {
            setContentWidth(contentRef.current.scrollWidth);
        }
    }, []);

    useEffect(() => {
        measure();
        window.addEventListener("resize", measure);
        // Re-measure after images may have loaded
        const t1 = setTimeout(measure, 300);
        const t2 = setTimeout(measure, 1000);
        return () => {
            window.removeEventListener("resize", measure);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [measure]);

    /**
     * Pixel-based transform with modulo wrapping.
     *
     * baseX accumulates upward continuously. The transform converts it
     * to a translateX value that cycles seamlessly over one content width.
     *
     * - baseVelocity > 0 (row1): logos move LEFT → RIGHT
     *   translateX cycles: -contentWidth → 0 → -contentWidth → 0 ...
     *
     * - baseVelocity < 0 (row2): logos move RIGHT → LEFT
     *   translateX cycles: 0 → -contentWidth → 0 → -contentWidth ...
     */
    const x = useTransform(baseX, (v) => {
        if (contentWidth <= 0) return "0px";
        const mod = ((v % contentWidth) + contentWidth) % contentWidth;

        if (baseVelocity > 0) {
            // Left-to-right: start at -contentWidth, move toward 0
            return `${-contentWidth + mod}px`;
        } else {
            // Right-to-left: start at 0, move toward -contentWidth
            return `${-mod}px`;
        }
    });

    const isHovered = useRef(false);

    useAnimationFrame((_t, delta) => {
        if (isHovered.current || isLowPowerMode) return;

        // Clamp delta to prevent large jumps when returning from background tab
        const clampedDelta = Math.min(delta, 50);

        let moveBy = Math.abs(baseVelocity) * (clampedDelta / 1000);

        const vf = velocityFactor.get();
        if (vf > 0) {
            moveBy += moveBy * vf;
        }

        // Always accumulate forward — direction is handled in the transform
        baseX.set(baseX.get() + moveBy);
    });

    if (isLowPowerMode) {
        return (
            <div className="overflow-hidden whitespace-nowrap w-full py-1">
                <div
                    className={cn(
                        "flex",
                        baseVelocity > 0
                            ? "animate-marquee-reverse"
                            : "animate-marquee"
                    )}
                >
                    <div className="flex gap-4 shrink-0 pr-4">{children}</div>
                    <div className="flex gap-4 shrink-0 pr-4">{children}</div>
                    <div className="flex gap-4 shrink-0 pr-4">{children}</div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="overflow-hidden whitespace-nowrap w-full py-1"
            onMouseEnter={() => (isHovered.current = true)}
            onMouseLeave={() => (isHovered.current = false)}
        >
            <motion.div
                className="flex"
                style={{ x, willChange: "transform" }}
            >
                {/* First copy — ref attached for measuring pixel width */}
                <div ref={contentRef} className="flex gap-4 shrink-0 pr-4">
                    {children}
                </div>
                <div className="flex gap-4 shrink-0 pr-4">{children}</div>
                <div className="flex gap-4 shrink-0 pr-4">{children}</div>
            </motion.div>
        </div>
    );
}

const GalleryItem = ({ item }: { item: { name: string; icon: string } }) => {
    return (
        <div className="relative shrink-0 w-[clamp(80px,20vw,140px)] h-[clamp(80px,20vw,140px)] flex flex-col items-center justify-center gap-4 group cursor-pointer p-4 bg-white/5 dark:bg-black/20 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-primary/50 transition-all duration-300">
            <div className="relative w-12 h-12 md:w-16 md:h-16">
                <Image
                    src={item.icon}
                    alt={item.name}
                    fill
                    sizes="64px"
                    priority
                    unoptimized
                    className="object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-110"
                />
            </div>
            <span className="text-xs font-bold text-neutral-500 group-hover:text-primary transition-colors text-center opacity-0 group-hover:opacity-100 absolute bottom-2">
                {item.name}
            </span>
        </div>
    );
};

export default function ExperienceMarquee() {
    const { isLowPowerMode } = usePerformance();
    const row1 = portfolioData.techStack;
    const row2 = portfolioData.tools;

    const ensureLength = (items: any[]) => {
        if (!items || items.length === 0) return [];
        let repeated = [...items];
        while (repeated.length < 12) {
            repeated = [...repeated, ...items];
        }
        return repeated;
    };

    return (
        <section className="py-2 md:py-8 bg-background relative z-10 overflow-hidden">
            {/* Fog/Blur Blending */}
            <div className="absolute top-0 left-0 w-full h-16 md:h-32 bg-gradient-to-b from-background via-background/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-16 md:h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none" />

            <div className="flex flex-col gap-2">
                {/* Row 1: LEFT → RIGHT */}
                <ParallaxText baseVelocity={40} isLowPowerMode={isLowPowerMode}>
                    {ensureLength(row1).map((item: any, idx: number) => (
                        <GalleryItem key={`r1-${idx}`} item={item} />
                    ))}
                </ParallaxText>

                {/* Row 2: RIGHT → LEFT */}
                <ParallaxText baseVelocity={-40} isLowPowerMode={isLowPowerMode}>
                    {ensureLength(row2).map((item: any, idx: number) => (
                        <GalleryItem key={`r2-${idx}`} item={item} />
                    ))}
                </ParallaxText>
            </div>
        </section>
    );
}
