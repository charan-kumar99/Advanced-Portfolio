"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Play, Maximize2, ChevronLeft, ChevronRight, Minimize2, ListFilter, ArrowDownUp, ImageIcon, Video, LayoutGrid, StretchHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllGalleryImages } from "@/app/actions/getGalleryImages";
import styles from "./CleanFilmGrid.module.css";

export default function CleanFilmGrid({ isLowPowerMode }) {
    const [selectedId, setSelectedId] = useState(null);
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [isLightboxMaximized, setIsLightboxMaximized] = useState(false);
    const [visibleCount, setVisibleCount] = useState(12);
    const [galleryItems, setGalleryItems] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const images = await getAllGalleryImages();
                const formattedItems = images.map((img, index) => ({
                    id: `gallery-${index}`,
                    title: img.filename.split('.')[0].replace(/-/g, ' '),
                    type: 'image',
                    category: 'Gallery',
                    date: '2024',
                    thumbnail: img.src,
                    url: img.src,
                    description: 'Gallery Image'
                }));
                setGalleryItems(formattedItems);
            } catch (error) {
                console.error("Failed to load gallery images", error);
            }
        };
        fetchImages();
    }, []);

    const allItems = galleryItems;

    // Grouping Logic
    const groupedItems = useMemo(() => {
        let items = [...allItems];

        if (filter !== 'all') {
            items = items.filter(item => item.type === filter);
        }

        const groups = {};
        items.forEach(item => {
            const category = item.category || 'Uncategorized';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(item);
        });

        return groups;
    }, [filter, allItems]);

    const categories = Object.keys(groupedItems).sort();

    const flattenedFilteredItems = useMemo(() => {
        return categories.flatMap(cat => groupedItems[cat]);
    }, [categories, groupedItems]);

    useEffect(() => {
        setVisibleCount(12);
    }, [filter]);

    const visibleItems = useMemo(() => {
        if (viewMode === 'rows') return [];
        return flattenedFilteredItems.slice(0, visibleCount);
    }, [flattenedFilteredItems, visibleCount, viewMode]);

    const currentIndex = flattenedFilteredItems.findIndex(item => item.id === selectedId);

    const openLightbox = (id) => {
        setSelectedId(id);
        setIsLightboxMaximized(false);
    }
    const closeLightbox = () => setSelectedId(null);
    const toggleMaximize = (e) => {
        e.stopPropagation();
        setIsLightboxMaximized(prev => !prev);
    }

    const nextImage = (e) => {
        e.stopPropagation();
        const next = (currentIndex + 1) % flattenedFilteredItems.length;
        setSelectedId(flattenedFilteredItems[next].id);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        const prev = (currentIndex - 1 + flattenedFilteredItems.length) % flattenedFilteredItems.length;
        setSelectedId(flattenedFilteredItems[prev].id);
    };

    const scrollToCategory = (category) => {
        const element = document.getElementById(`category-${category}`);
        if (element) {
            const y = element.getBoundingClientRect().top + window.pageYOffset - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const scrollContainerRef = useRef({});
    const scrollHorizontal = (category, direction) => {
        const container = scrollContainerRef.current[category];
        if (container) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }

    return (
        <section className={styles.section}>

            {/* Header & Controls */}
            <div className={styles.header}>
                <div className={styles.headerTitleWrapper}>
                    <span className={styles.headerSubtitle}>
                        Exhibition Space
                    </span>
                    <h2 className={styles.headerTitle}>
                        Selected Works
                    </h2>
                </div>

                <div className={styles.controlsArea}>
                    {/* Filter Tabs */}
                    <div className={styles.filterWrapper}>
                        {['all', 'image', 'video'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={filter === f ? styles.filterBtnActive : styles.filterBtnInactive}
                            >
                                {f === 'all' ? 'All' : f === 'image' ? 'Photos' : 'Videos'}
                            </button>
                        ))}
                    </div>

                    <div className={styles.controlsDivider} />

                    {/* View Toggle */}
                    <div className={styles.viewToggleWrapper}>
                        <button
                            onClick={() => setViewMode('rows')}
                            className={viewMode === 'rows' ? styles.viewToggleBtnActive : styles.viewToggleBtnInactive}
                            title="Rows View"
                        >
                            <StretchHorizontal className={styles.viewToggleIcon} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={viewMode === 'grid' ? styles.viewToggleBtnActive : styles.viewToggleBtnInactive}
                            title="Grid View"
                        >
                            <LayoutGrid className={styles.viewToggleIcon} />
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.layoutContainer}>
                {/* Sticky Sidebar */}
                {viewMode === 'rows' && (
                    <div className={styles.sidebar}>
                        <div className={styles.sidebarInner}>
                            <h3 className={styles.sidebarTitle}>
                                <ListFilter className={styles.sidebarTitleIcon} />
                                Collections
                            </h3>
                            <div className={styles.sidebarList}>
                                {categories.map((category, idx) => (
                                    <button
                                        key={category}
                                        onClick={() => scrollToCategory(category)}
                                        className={styles.sidebarBtn}
                                    >
                                        <span className={styles.sidebarBtnNum}>
                                            {(idx + 1).toString().padStart(2, '0')}
                                        </span>
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className={styles.contentArea}>
                    {/* Rows View */}
                    {viewMode === 'rows' && categories.map((category) => (
                        <div key={category} id={`category-${category}`} className={styles.rowSection}>
                            <div className={styles.rowHeader}>
                                <h3 className={styles.rowTitle}>
                                    {category}
                                    <span className={styles.rowTitleBadge}>
                                        {groupedItems[category].length}
                                    </span>
                                </h3>

                                <div className={styles.rowControls}>
                                    <button
                                        onClick={() => scrollHorizontal(category, 'left')}
                                        className={styles.rowControlBtn}
                                    >
                                        <ChevronLeft className={styles.rowControlIcon} />
                                    </button>
                                    <button
                                        onClick={() => scrollHorizontal(category, 'right')}
                                        className={styles.rowControlBtn}
                                    >
                                        <ChevronRight className={styles.rowControlIcon} />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.rowSliderGroup}>
                                <div
                                    ref={el => {
                                        scrollContainerRef.current[category] = el;
                                    }}
                                    className={styles.rowSliderTrack}
                                >
                                    {groupedItems[category].map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={isLowPowerMode ? { opacity: 0 } : { opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "0px -50px 0px 0px" }}
                                            transition={{ duration: 0.5, delay: isLowPowerMode ? 0 : index * 0.1 }}
                                            className={styles.rowCard}
                                            onClick={() => openLightbox(item.id)}
                                        >
                                            <div className={styles.cardInner}>
                                                <Image
                                                    src={item.thumbnail || item.url}
                                                    alt={item.title}
                                                    fill
                                                    loading="lazy"
                                                    className={styles.cardImage}
                                                />

                                                {/* Type Badge */}
                                                <div className={styles.typeBadge}>
                                                    {item.type === 'video' ? <Video className={styles.typeBadgeIcon} /> : <ImageIcon className={styles.typeBadgeIcon} />}
                                                    <span>{item.type}</span>
                                                </div>

                                                {/* Hover Overlay */}
                                                <div className={styles.cardHoverOverlay}>
                                                    <div className={styles.cardHoverIconWrapper}>
                                                        {item.type === 'video' ? (
                                                            <Play className={styles.cardHoverPlayIcon} />
                                                        ) : (
                                                            <Maximize2 className={styles.cardHoverZoomIcon} />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Gradient Overlay */}
                                                <div className={styles.cardGradientOverlay} />
                                            </div>

                                            {/* Info overlay */}
                                            <div className={styles.cardInfoOverlay}>
                                                <h4 className={styles.cardTitle}>
                                                    {item.title}
                                                </h4>
                                                <div className={styles.cardMeta}>
                                                    <span className={styles.cardMetaText} />
                                                    <span className={styles.cardMetaBadge}>
                                                        View
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Grid View */}
                    {viewMode === 'grid' && (
                        <div className={styles.gridWrapper}>
                            <div className={styles.gridCols}>
                                {visibleItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={isLowPowerMode ? { opacity: 0 } : { opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-10%" }}
                                        transition={{ duration: 0.4, delay: isLowPowerMode ? 0 : index * 0.05 }}
                                        className={styles.gridCard}
                                        onClick={() => openLightbox(item.id)}
                                    >
                                        <div className={styles.gridCardImageWrapper}>
                                            <Image
                                                src={item.thumbnail || item.url}
                                                alt={item.title}
                                                width={800}
                                                height={600}
                                                loading="lazy"
                                                className={styles.gridCardImage}
                                            />

                                            {/* Type Badge */}
                                            <div className={styles.typeBadge}>
                                                {item.type === 'video' ? <Video className={styles.typeBadgeIcon} /> : <ImageIcon className={styles.typeBadgeIcon} />}
                                                <span>{item.type}</span>
                                            </div>

                                            {/* Hover Overlay */}
                                            <div className={styles.gridCardHoverOverlay}>
                                                <div className={styles.gridCardHoverIcon}>
                                                    {item.type === 'video' ? (
                                                        <Play className="w-5 h-5 text-white fill-current" />
                                                    ) : (
                                                        <Maximize2 className="w-5 h-5 text-white" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.gridCardMetaWrapper}>
                                            <div>
                                                <h3 className={styles.gridCardTitle}>
                                                    {item.title}
                                                </h3>
                                                <p className={styles.gridCardCategory}>
                                                    {item.category}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Load More Button */}
                            {visibleCount < flattenedFilteredItems.length && (
                                <div className={styles.loadMoreWrapper}>
                                    <button
                                        onClick={() => setVisibleCount(prev => prev + 12)}
                                        className={styles.loadMoreBtn}
                                    >
                                        <span className={styles.loadMoreLabel}>
                                            Load More Archives
                                        </span>
                                        <div className={styles.loadMoreIconWrapper}>
                                            <ArrowDownUp className={styles.loadMoreIcon} />
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {categories.length === 0 && (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyStateText}>No items found matching filter.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Advanced Lightbox */}
            <AnimatePresence>
                {selectedId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                            "fixed inset-0 z-[100] bg-background/95 flex flex-col items-center justify-center transition-all duration-300",
                            !isLowPowerMode && "backdrop-blur-xl",
                            isLightboxMaximized ? "bg-black" : ""
                        )}
                        onClick={closeLightbox}
                    >
                        {/* Toolbar */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-[110]" onClick={(e) => e.stopPropagation()}>
                            <div className="text-sm font-mono text-foreground/70">
                                {currentIndex + 1} / {flattenedFilteredItems.length}
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleMaximize}
                                    className="p-3 bg-foreground/5 hover:bg-foreground/10 rounded-full transition-colors"
                                    title={isLightboxMaximized ? "Minimize" : "Maximize"}
                                >
                                    {isLightboxMaximized ? (
                                        <Minimize2 className="w-5 h-5 text-foreground" />
                                    ) : (
                                        <Maximize2 className="w-5 h-5 text-foreground" />
                                    )}
                                </button>
                                <button
                                    onClick={closeLightbox}
                                    className="p-3 bg-foreground/5 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 border border-white/20 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all z-[110] hidden md:block backdrop-blur-sm">
                            <ChevronLeft className="w-8 h-8" />
                        </button>

                        <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 border border-white/20 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all z-[110] hidden md:block backdrop-blur-sm">
                            <ChevronRight className="w-8 h-8" />
                        </button>

                        {/* Content Container */}
                        <motion.div
                            layout
                            className={cn(
                                "relative w-full transition-all duration-500",
                                isLightboxMaximized
                                    ? "h-screen w-screen px-0 py-0"
                                    : "max-w-5xl px-6 h-[70vh] aspect-video"
                             )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={cn(
                                "relative w-full h-full overflow-hidden flex items-center justify-center",
                                isLightboxMaximized ? "rounded-none" : "rounded-sm"
                            )}>
                                {flattenedFilteredItems[currentIndex].type === 'video' ? (
                                    <iframe
                                        src={`${flattenedFilteredItems[currentIndex].url}${flattenedFilteredItems[currentIndex].url.includes('?') ? '&' : '?'}autoplay=1&rel=0`}
                                        className="w-full h-full"
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={flattenedFilteredItems[currentIndex].url}
                                            alt={flattenedFilteredItems[currentIndex].title}
                                            fill
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Caption */}
                        {!isLightboxMaximized && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 text-center max-w-2xl px-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-2xl font-serif text-foreground mb-2">
                                    {flattenedFilteredItems[currentIndex].title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {flattenedFilteredItems[currentIndex].description}
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
