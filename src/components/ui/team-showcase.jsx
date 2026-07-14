import { useState, memo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useSpring, useVelocity } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './team-showcase.module.css';

const DEFAULT_MEMBERS = [
    {
        id: '1',
        name: 'Chadrack',
        role: 'director of photography',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
        social: { twitter: '#', linkedin: '#', behance: '#' },
    },
    {
        id: '2',
        name: 'Mak VieSAinte',
        role: 'FOUNDER',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
        social: { twitter: '#', linkedin: '#' },
    },
    {
        id: '3',
        name: 'Osiris Balonga',
        role: 'LEAD FRONT-END',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        social: { twitter: '#', linkedin: '#' },
    },
    {
        id: '4',
        name: 'Jacques',
        role: 'PRODUCT OWNER',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
        social: { linkedin: '#' },
    },
    {
        id: '5',
        name: 'Riche Makso',
        role: 'CTO - PRODUCT DESIGNER',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
        social: { twitter: '#', linkedin: '#' },
    },
    {
        id: '6',
        name: 'Jemima',
        role: 'MAKE-UP ARTISTE',
        image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
        social: { instagram: '#' },
    },
];

export default function TeamShowcase({ members = DEFAULT_MEMBERS }) {
    const [hoveredId, setHoveredId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 35,
        mass: 0.5,
        restDelta: 0.0001
    });

    const scrollVelocity = useVelocity(scrollYProgress);

    const activeIndex = useTransform(smoothProgress, (p) => {
        const total = members.length;
        if (p >= 1) return total - 1;
        if (p <= 0) return 0;
        
        const segmentSize = 1 / (total - 1);
        const i = Math.floor(p / segmentSize);
        const progressInSegment = (p % segmentSize) / segmentSize;

        return progressInSegment < 0.95 ? i : i + 1;
    });

    useMotionValueEvent(smoothProgress, "change", (p) => {
        const velocity = Math.abs(scrollVelocity.get());
        const targetIdx = Math.min(Math.max(Math.round(activeIndex.get()), 0), members.length - 1);
        const targetId = members[targetIdx]?.id || null;

        if (p < 0.02) {
            if (expandedId !== null) setExpandedId(null);
            return;
        }

        if (p > 0.98) {
            if (expandedId !== members[members.length - 1]?.id) {
                setExpandedId(members[members.length - 1]?.id);
            }
            return;
        }

        if (velocity > 0.015) {
            if (expandedId !== null) setExpandedId(null);
        } else if (velocity < 0.008) {
            if (expandedId !== targetId) setExpandedId(targetId);
        }
    });

    const col1 = members.filter((_, i) => i % 3 === 0);
    const col2 = members.filter((_, i) => i % 3 === 1);
    const col3 = members.filter((_, i) => i % 3 === 2);

    const toggleExpand = (id) => {
        if (id === 'view-more') return;
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <section 
            ref={containerRef} 
            className={styles.section}
            style={{ height: `${members.length * 80}vh` }} 
        >
            <div className={styles.stickyWrapper}>
                <div className={styles.rowFlex}>
                    {/* Left Side: Photo Grid */}
                    <div className={styles.perspectiveContainer}>
                        <div className={styles.colsRow}>
                            {/* Column 1 */}
                            <div className={styles.col}>
                                {col1.map((member) => (
                                    <PhotoCard
                                        key={member.id}
                                        member={member}
                                        className="w-[20vw] h-[22vw] sm:w-[15vw] sm:h-[17vw] md:w-[12vw] md:h-[14vw] lg:w-[11vw] lg:h-[13vw] max-w-[180px] max-h-[200px]"
                                        activeId={hoveredId || expandedId}
                                        onHover={setHoveredId}
                                        onClick={() => toggleExpand(member.id)}
                                    />
                                ))}
                            </div>

                            {/* Column 2 */}
                            <div className={cn(styles.col, styles.col2)}>
                                {col2.map((member) => (
                                    <PhotoCard
                                        key={member.id}
                                        member={member}
                                        className="w-[22vw] h-[24vw] sm:w-[17vw] sm:h-[19vw] md:w-[14vw] md:h-[16vw] lg:w-[13vw] lg:h-[15vw] max-w-[200px] max-h-[220px]"
                                        activeId={hoveredId || expandedId}
                                        onHover={setHoveredId}
                                        onClick={() => toggleExpand(member.id)}
                                    />
                                ))}
                            </div>

                            {/* Column 3 */}
                            <div className={cn(styles.col, styles.col3)}>
                                {col3.map((member) => (
                                    <PhotoCard
                                        key={member.id}
                                        member={member}
                                        className="w-[21vw] h-[23vw] sm:w-[16vw] sm:h-[18vw] md:w-[13vw] md:h-[15vw] lg:w-[12vw] lg:h-[14vw] max-w-[190px] max-h-[210px]"
                                        activeId={hoveredId || expandedId}
                                        onHover={setHoveredId}
                                        onClick={() => toggleExpand(member.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Narrative List */}
                    <div className={styles.rightCol}>
                        <div className={styles.timelineBgLine} />

                        <motion.div 
                            className={styles.timelineActiveLine} 
                            style={{ 
                                scaleY: smoothProgress 
                            }} 
                        />

                        <AnimatePresence initial={false} mode="popLayout">
                            {members.map((member, index) => (
                                <MemberRow
                                    key={member.id}
                                    member={member}
                                    hoveredId={hoveredId}
                                    onHover={setHoveredId}
                                    isExpanded={expandedId === member.id}
                                    onToggle={() => toggleExpand(member.id)}
                                    isLast={index === members.length - 1}
                                    index={index}
                                    total={members.length}
                                    progress={smoothProgress}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}

function PhotoCard({
    member,
    className,
    activeId,
    onHover,
    onClick,
}) {
    const isActive = activeId === member.id;
    const isDimmed = activeId !== null && !isActive;
    const isViewMore = member.id === 'view-more';

    const content = (
        <div
            className={cn(
                styles.cardInner,
                isDimmed ? 'opacity-60 scale-[0.98]' : 'opacity-100 scale-100',
            )}
            onMouseEnter={() => onHover(member.id)}
            onMouseLeave={() => onHover(null)}
            onClick={onClick}
        >
            <img
                src={member.image}
                alt={member.name}
                className={styles.cardImage}
                style={{
                    filter: isActive 
                        ? 'grayscale(0) brightness(1) contrast(1.1)' 
                        : 'grayscale(1) brightness(0.6) contrast(0.9)',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
            />
        </div>
    );

    if (isViewMore && member.social?.website) {
        return (
            <a href={member.social.website} className={cn('block h-full w-full', className)}>
                {content}
            </a>
        );
    }

    return <div className={className}>{content}</div>;
}

const MemberRow = memo(({
    member,
    hoveredId,
    onHover,
    isExpanded,
    onToggle,
    isLast,
    index,
    total,
    progress,
}) => {
    const isHighlightedValue = useTransform(progress, (p) => {
        const threshold = index / (total - 1);
        return p >= threshold - 0.01;
    });

    const [isHighlighted, setIsHighlighted] = useState(index === 0);

    useMotionValueEvent(isHighlightedValue, "change", (latest) => {
        if (latest !== isHighlighted) setIsHighlighted(latest);
    });

    const isActive = hoveredId === member.id || isExpanded || isHighlighted;
    const isDimmed = hoveredId !== null && !isActive && !isExpanded;
    const isViewMore = member.id === 'view-more';

    const springConfig = { type: "spring", stiffness: 350, damping: 35, mass: 0.6 };

    const content = (
        <motion.div
            layout="size"
            transition={springConfig}
            className={cn(
                styles.memberRowContainer,
                isDimmed ? 'opacity-50' : 'opacity-100',
            )}
            onMouseEnter={() => onHover(member.id)}
            onMouseLeave={() => onHover(null)}
            onClick={onToggle}
        >
            <div className={styles.rowFlexItem}>
                <div className="flex-1">
                    <div className="flex items-start gap-2.5 h-full relative">
                        <div className={styles.bulletFlex}>
                            <motion.span
                                layout="position"
                                className={cn(
                                    styles.rowBullet,
                                    isActive ? styles.rowBulletActive : styles.rowBulletInactive,
                                )}
                            />
                        </div>
                        <div className={styles.rowTextGroup}>
                            <div className="flex items-center gap-2">
                                <span
                                    className={cn(
                                        styles.memberName,
                                        isActive ? 'text-foreground' : 'text-foreground/80',
                                    )}
                                >
                                    {member.name}
                                </span>
                                {!isViewMore && isExpanded && (
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-foreground/40"
                                    >
                                        <ChevronUp size={14} />
                                    </motion.span>
                                )}
                            </div>
                            
                            {/* Role */}
                            <div className={cn(
                                styles.memberRole,
                                isActive ? "text-foreground/70" : "text-muted-foreground/50"
                            )}>
                                {member.role}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description Accordion */}
            {!isViewMore && member.description && (
                <motion.div
                    initial={false}
                    animate={{ 
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0,
                        marginTop: isExpanded ? 16 : 0
                    }}
                    transition={springConfig}
                    style={{ 
                        willChange: "height, opacity, margin-top", 
                        transform: "translateZ(0)",
                        overflow: "hidden"
                    }}
                    className={styles.rowDescriptionBlock}
                >
                    <div className="pb-2">
                        <p className={styles.rowDescText}>
                            {member.description}
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );

    if (isViewMore && member.social?.website) {
        return (
            <Link href={member.social.website} className="block w-full">
                {content}
            </Link>
        );
    }

    return content;
});

MemberRow.displayName = 'MemberRow';
export { TeamShowcase };
