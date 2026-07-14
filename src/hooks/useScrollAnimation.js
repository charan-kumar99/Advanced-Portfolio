'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export function useScrollAnimation(animationCallback, options = {}) {
    const elementRef = useRef(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            return;
        }

        const element = elementRef.current;
        if (!element) return;

        const ctx = gsap.context(() => {
            const animation = animationCallback(element, gsap);

            if (animation) {
                ScrollTrigger.create({
                    trigger: options.trigger || element,
                    start: options.start || 'top 80%',
                    end: options.end || 'bottom 20%',
                    scrub: options.scrub,
                    markers: options.markers,
                    toggleActions: options.toggleActions || 'play none none reverse',
                    animation,
                    onEnter: options.onEnter,
                    onLeave: options.onLeave,
                    onEnterBack: options.onEnterBack,
                    onLeaveBack: options.onLeaveBack,
                });
            }
        }, element);

        return () => {
            ctx.revert();
        };
    }, [animationCallback, options]);

    return elementRef;
}

export function useFadeIn(delay = 0, duration = 0.6) {
    return useScrollAnimation((element, g) => {
        return g.fromTo(
            element,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration, delay, ease: 'power2.out' }
        );
    });
}

export function useSlideIn(direction = 'up', delay = 0, duration = 0.6) {
    const getInitialPosition = () => {
        switch (direction) {
            case 'left':
                return { x: -50, y: 0 };
            case 'right':
                return { x: 50, y: 0 };
            case 'up':
                return { x: 0, y: 50 };
            case 'down':
                return { x: 0, y: -50 };
            default:
                return { x: 0, y: 50 };
        }
    };

    const { x, y } = getInitialPosition();

    return useScrollAnimation((element, g) => {
        return g.fromTo(
            element,
            { opacity: 0, x, y },
            { opacity: 1, x: 0, y: 0, duration, delay, ease: 'power2.out' }
        );
    });
}

export function useStaggerChildren(childSelector = '> *', staggerAmount = 0.1, duration = 0.5) {
    return useScrollAnimation((element, g) => {
        const children = element.querySelectorAll(childSelector);
        return g.fromTo(
            children,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration,
                stagger: staggerAmount,
                ease: 'power2.out'
            }
        );
    });
}

export function useParallax(speed = 0.5) {
    return useScrollAnimation(
        (element, g) => {
            return g.to(element, {
                y: () => -window.innerHeight * speed,
                ease: 'none',
            });
        },
        { scrub: true, start: 'top bottom', end: 'bottom top' }
    );
}

export function useScaleOnScroll(fromScale = 0.8, toScale = 1) {
    return useScrollAnimation((element, g) => {
        return g.fromTo(
            element,
            { scale: fromScale, opacity: 0.5 },
            { scale: toScale, opacity: 1, duration: 0.8, ease: 'power2.out' }
        );
    });
}
