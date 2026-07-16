'use client';

import { useRef, useState, useEffect } from "react";
import { usePerformance } from "@/hooks/usePerformance";
import { cn } from "@/lib/utils";
import styles from './SplineScene.module.css';

export const SplineScene = ({ scene, className }) => {
    const splineRef = useRef(null);
    const isMounted = useRef(true);
    const { isLowPowerMode } = usePerformance();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        isMounted.current = true;

        if (isLowPowerMode) return;

        const SCRIPT_ID = 'spline-viewer-script';
        let script = document.getElementById(SCRIPT_ID);

        const handleLoad = () => {
            if (isMounted.current) setIsLoaded(true);
        };

        if (!script) {
            script = document.createElement('script');
            script.id = SCRIPT_ID;
            script.type = 'module';
            script.src = '/spline-viewer.js'; // Load locally for instant response
            script.async = true;
            script.addEventListener('load', handleLoad);
            document.body.appendChild(script);
        } else {
            if (customElements.get('spline-viewer')) {
                handleLoad();
            } else {
                script.addEventListener('load', handleLoad);
            }
        }

        return () => {
            isMounted.current = false;
            if (script) script.removeEventListener('load', handleLoad);
        };
    }, [isLowPowerMode]);

    useEffect(() => {
        if (isLowPowerMode) return;

        let intervalId;

        const injectStyles = () => {
            if (!isMounted.current) return;

            const currentRef = splineRef.current;
            if (currentRef && currentRef.shadowRoot) {
                const shadow = currentRef.shadowRoot;

                if (!shadow.querySelector('#spline-hide-logo-style')) {
                    const style = document.createElement('style');
                    style.id = 'spline-hide-logo-style';
                    style.textContent = `
                        #logo, 
                        a[href*="spline.design"], 
                        .spline-watermark,
                        #spline-watermark-overlay,
                        div[style*="bottom: 10px"],
                        div[style*="position: absolute; bottom: 10px; right: 10px;"] { 
                            display: none !important; 
                            opacity: 0 !important; 
                            visibility: hidden !important; 
                            pointer-events: none !important;
                        }
                    `;
                    shadow.appendChild(style);
                }
            }
        };

        const currentRef = splineRef.current;
        if (currentRef) {
            injectStyles();
            currentRef.addEventListener('load', injectStyles);

            let attempts = 0;
            intervalId = setInterval(() => {
                if (currentRef.shadowRoot && isMounted.current) {
                    injectStyles();
                    attempts++;
                    if (attempts > 30) clearInterval(intervalId);
                }
            }, 1000);
        }

        return () => {
            if (currentRef) currentRef.removeEventListener('load', injectStyles);
            if (intervalId) clearInterval(intervalId);
        };
    }, [isLowPowerMode]);

    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isLowPowerMode) return;

        let resizeObserver = null;
        let intersectionObserver = null;
        const state = { isIntersecting: false };

        const updateVisibility = () => {
            if (!containerRef.current || !isMounted.current) return;
            const { width, height } = containerRef.current.getBoundingClientRect();
            const hasValidSize = width > 1 && height > 1;
            setIsVisible(state.isIntersecting && hasValidSize);
        };

        intersectionObserver = new IntersectionObserver(
            ([entry]) => {
                if (isMounted.current) {
                    state.isIntersecting = entry.isIntersecting;
                    updateVisibility();
                }
            },
            { threshold: 0.1 }
        );

        resizeObserver = new ResizeObserver(() => {
            if (isMounted.current) {
                updateVisibility();
            }
        });

        if (containerRef.current) {
            intersectionObserver.observe(containerRef.current);
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            intersectionObserver?.disconnect();
            resizeObserver?.disconnect();
        };
    }, [isLowPowerMode]);

    if (isLowPowerMode) {
        return (
            <div className={cn(styles.container, className)}>
                <div className={styles.gradient} />
                <div className={styles.centerBox}>
                    <div className={styles.glow} />
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={cn(styles.container, className)}>
            <div className={styles.innerViewer}>
                <spline-viewer
                    ref={splineRef}
                    url={scene}
                    loading-anim-type="spinner-small-dark"
                    style={{
                        width: '100%',
                        height: '100%',
                        transform: 'scale(1.2) translate3d(0,0,0)',
                        transformOrigin: 'center center',
                        display: isLoaded ? 'block' : 'none',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.8s ease-in-out'
                    }}
                />
            </div>
        </div>
    );
}
export default SplineScene;
