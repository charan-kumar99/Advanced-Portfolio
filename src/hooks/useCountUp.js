import { useState, useEffect } from 'react';

export const useCountUp = (
    end,
    duration = 2000,
    decimal = 0,
    trigger = true
) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!trigger) return;

        let startTime = null;
        let frameId;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Ease-out expo for premium feel
            const easedProgress = 1 - Math.pow(2, -10 * progress);
            const currentCount = easedProgress * end;

            setCount(parseFloat(currentCount.toFixed(decimal)));

            if (progress < 1) {
                frameId = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [end, duration, decimal, trigger]);

    return count;
};
