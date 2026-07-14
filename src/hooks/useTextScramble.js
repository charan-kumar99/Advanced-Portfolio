import { useState, useEffect, useCallback } from 'react';

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

export const useTextScramble = (
    text,
    trigger = true,
    delay = 300,
    chars = DEFAULT_CHARS
) => {
    const [scrambledText, setScrambledText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!trigger) return;

        let frameId;
        let timeoutId;

        const runScramble = async () => {
            timeoutId = setTimeout(() => {
                let currentIteration = 0;
                const totalChars = text.length;
                const charsArray = text.split('');

                const update = () => {
                    const output = charsArray.map((targetChar, i) => {
                        if (targetChar === ' ') return ' ';

                        // We stagger the "lock" time for each character
                        // Lower index characters lock sooner
                        const lockThreshold = i * 2;

                        if (currentIteration > lockThreshold + 10) {
                            return targetChar;
                        }

                        return chars[Math.floor(Math.random() * chars.length)];
                    }).join('');

                    setScrambledText(output);

                    if (currentIteration < totalChars + 20) {
                        currentIteration++;
                        frameId = requestAnimationFrame(update);
                    } else {
                        setScrambledText(text);
                        setIsComplete(true);
                    }
                };

                update();
            }, delay);
        };

        runScramble();

        return () => {
            cancelAnimationFrame(frameId);
            clearTimeout(timeoutId);
        };
    }, [text, trigger, delay, chars]);

    return { scrambledText, isComplete };
};
