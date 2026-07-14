'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Check, Sparkles } from 'lucide-react';
import styles from './ThoughtStreamClosing.module.css';

const THOUGHT_TOPICS = [
    { text: 'AI Ethics', delay: 0.2, size: 'sm' },
    { text: 'Web3 Future', delay: 0.4, size: 'md' },
    { text: 'Clean Code', delay: 0.6, size: 'sm' },
    { text: 'Innovation', delay: 0.8, size: 'lg' },
    { text: 'DevOps', delay: 1.0, size: 'sm' },
    { text: 'Design Patterns', delay: 1.2, size: 'md' },
];

const LiquidWave = () => {
    return (
        <div className={styles.waveContainer}>
            <svg
                className={styles.waveSvg}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
            >
                <motion.path
                    fill="hsl(var(--primary))"
                    fillOpacity="0.3"
                    initial={{ d: "M0,160 C320,200,420,100,720,140 C1020,180,1120,80,1440,120 L1440,320 L0,320 Z" }}
                    animate={{
                        d: [
                            "M0,160 C320,200,420,100,720,140 C1020,180,1120,80,1440,120 L1440,320 L0,320 Z",
                            "M0,140 C320,100,420,200,720,160 C1020,120,1120,180,1440,140 L1440,320 L0,320 Z",
                            "M0,160 C320,200,420,100,720,140 C1020,180,1120,80,1440,120 L1440,320 L0,320 Z"
                        ]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.path
                    fill="hsl(var(--secondary))"
                    fillOpacity="0.2"
                    initial={{ d: "M0,200 C360,240,540,160,720,200 C900,240,1080,160,1440,200 L1440,320 L0,320 Z" }}
                    animate={{
                        d: [
                            "M0,200 C360,240,540,160,720,200 C900,240,1080,160,1440,200 L1440,320 L0,320 Z",
                            "M0,220 C360,180,540,260,720,220 C900,180,1080,260,1440,220 L1440,320 L0,320 Z",
                            "M0,200 C360,240,540,160,720,200 C900,240,1080,160,1440,200 L1440,320 L0,320 Z"
                        ]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
            </svg>
        </div>
    );
};

const ThoughtBubble = ({
    text,
    delay,
    size = 'md',
    x,
    y
}) => {
    const sizeClass = size === 'sm' ? styles.bubbleSm : size === 'lg' ? styles.bubbleLg : styles.bubbleMd;

    return (
        <motion.div
            initial={{ opacity: 0, y: 100, scale: 0 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className={sizeClass}
            style={{ left: x, top: y }}
        >
            <motion.div
                animate={{
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay
                }}
                className={styles.bubbleInner}
            >
                {/* Main Bubble */}
                <div className={styles.bubbleShape}>
                    <p className={styles.bubbleText}>
                        {text}
                    </p>
                </div>

                {/* Bubble Tail */}
                <div className={styles.bubbleTail1} />
                <div className={styles.bubbleTail2} />
            </motion.div>
        </motion.div>
    );
};

const ParticleConnections = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = 600;

        const particles = [];
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Draw particle
                ctx.fillStyle = 'hsl(var(--primary))';
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();

                // Draw connections
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.strokeStyle = 'hsl(var(--primary))';
                        ctx.globalAlpha = (1 - dist / 150) * 0.2;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = 600;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <canvas ref={canvasRef} className={styles.connectionsCanvas} />;
};

export const ThoughtStreamClosing = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);
        setIsSubmitted(true);
        setEmail('');

        // Reset after 3 seconds
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <div className={styles.section}>
            {/* Particle Connections */}
            <ParticleConnections />

            {/* Liquid Wave */}
            <LiquidWave />

            {/* Content */}
            <div className={styles.containerInner}>
                {/* Floating Thought Bubbles */}
                <div className={styles.bubblesGrid}>
                    <ThoughtBubble text={THOUGHT_TOPICS[0].text} delay={THOUGHT_TOPICS[0].delay} size={THOUGHT_TOPICS[0].size} x="5%" y="20%" />
                    <ThoughtBubble text={THOUGHT_TOPICS[1].text} delay={THOUGHT_TOPICS[1].delay} size={THOUGHT_TOPICS[1].size} x="75%" y="10%" />
                    <ThoughtBubble text={THOUGHT_TOPICS[2].text} delay={THOUGHT_TOPICS[2].delay} size={THOUGHT_TOPICS[2].size} x="15%" y="60%" />
                    <ThoughtBubble text={THOUGHT_TOPICS[3].text} delay={THOUGHT_TOPICS[3].delay} size={THOUGHT_TOPICS[3].size} x="65%" y="55%" />
                    <ThoughtBubble text={THOUGHT_TOPICS[4].text} delay={THOUGHT_TOPICS[4].delay} size={THOUGHT_TOPICS[4].size} x="85%" y="70%" />
                    <ThoughtBubble text={THOUGHT_TOPICS[5].text} delay={THOUGHT_TOPICS[5].delay} size={THOUGHT_TOPICS[5].size} x="40%" y="75%" />
                </div>

                {/* Central Newsletter CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className={styles.contentBlock}
                >
                    {/* Icon */}
                    <motion.div
                        animate={{
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className={styles.iconWrapper}
                    >
                        <Sparkles className={styles.icon} />
                    </motion.div>

                    {/* Heading */}
                    <h2 className={styles.title}>
                        Don't Miss My Next Thought
                    </h2>

                    <p className={styles.desc}>
                        Subscribe to get fresh ideas, code insights, and tech musings delivered straight to your inbox.
                    </p>

                    {/* Newsletter Form */}
                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className={styles.form}
                            >
                                <div className={styles.inputWrapper}>
                                    <Mail className={styles.inputIcon} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        required
                                        disabled={isLoading}
                                        className={styles.input}
                                    />
                                </div>
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={styles.submitBtn}
                                >
                                    {isLoading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className={styles.loader}
                                        />
                                    ) : (
                                        <>
                                            <span>Subscribe</span>
                                            <Send className={styles.submitIcon} />
                                        </>
                                    )}
                                </motion.button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className={styles.successWrapper}
                            >
                                <div className={styles.successCheckWrapper}>
                                    <Check className={styles.successCheckIcon} />
                                </div>
                                <p className={styles.successTitle}>
                                    ✨ Thanks for subscribing!
                                </p>
                                <p className={styles.successDesc}>
                                    Check your inbox for confirmation.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Privacy Note */}
                    <p className={styles.privacyNote}>
                        No spam. Unsubscribe anytime. Your data is safe.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
