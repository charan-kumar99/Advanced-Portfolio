'use client';

import { ReactLenis } from 'lenis/react';

export function SmoothScrollProvider({ children }) {
    return (
        <ReactLenis root options={{
            lerp: 0.1,
            duration: 1.5,
            smoothWheel: true,
            smoothTouch: false
        }}>
            {children}
        </ReactLenis>
    );
}
