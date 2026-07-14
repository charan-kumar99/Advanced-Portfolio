"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    X,
    Send,
    Bot,
    User,
    Loader2,
    AlertCircle,
    RotateCcw,
    ChevronDown,
} from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import { useTranslations, useLocale } from "next-intl";
import styles from "./ChatBot.module.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateId() {
    return Math.random().toString(36).slice(2, 11);
}

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Markdown renderer (simple, no external deps) ─────────────────────────────
function SimpleMarkdown({ text }) {
    const lines = text.split("\n");
    const elements = [];
    let i = 0;
    let k = 0; // Separate key counter — always unique regardless of i's position

    while (i < lines.length) {
        const line = lines[i];

        // Empty line → spacing
        if (line.trim() === "") {
            elements.push(<div key={k++} className={styles.markdownSpacer} />);
            i++;
            continue;
        }

        // Heading ##
        if (line.startsWith("## ")) {
            elements.push(
                <p key={k++} className={styles.markdownHeading}>
                    {inlineFormat(line.slice(3))}
                </p>
            );
            i++;
            continue;
        }

        // Heading #
        if (line.startsWith("# ")) {
            elements.push(
                <p key={k++} className={styles.markdownHeadingBold}>
                    {inlineFormat(line.slice(2))}
                </p>
            );
            i++;
            continue;
        }

        // Bullet list
        if (line.match(/^[-*•] /)) {
            const items = [];
            while (i < lines.length && lines[i].match(/^[-*•] /)) {
                items.push(lines[i].replace(/^[-*•] /, ""));
                i++;
            }
            elements.push(
                <ul key={k++} className={styles.markdownListBullet}>
                    {items.map((item, idx) => (
                        <li key={idx} className={styles.markdownListItem}>
                            {inlineFormat(item)}
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        // Numbered list
        if (line.match(/^\d+\. /)) {
            const items = [];
            while (i < lines.length && lines[i].match(/^\d+\. /)) {
                items.push(lines[i].replace(/^\d+\. /, ""));
                i++;
            }
            elements.push(
                <ol key={k++} className={styles.markdownListOrdered}>
                    {items.map((item, idx) => (
                        <li key={idx} className={styles.markdownListItem}>
                            {inlineFormat(item)}
                        </li>
                    ))}
                </ol>
            );
            continue;
        }

        // Regular paragraph
        elements.push(
            <p key={k++} className={styles.markdownParagraph}>
                {inlineFormat(line)}
            </p>
        );
        i++;
    }

    return <div className={styles.markdownContainer}>{elements}</div>;
}

function inlineFormat(text) {
    // Bold (**text**), italic (*text*), code (`code`), links [text](url)
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={idx}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
            return <em key={idx}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
            return (
                <code key={idx} className={styles.markdownCode}>
                    {part.slice(1, -1)}
                </code>
            );
        }
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
            return (
                <a
                    key={idx}
                    href={linkMatch[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.markdownLink}
                >
                    {linkMatch[1]}
                </a>
            );
        }
        return part;
    });
}

// ─── Message bubble ───────────────────────────────────────────────────────────
const MessageBubble = React.memo(function MessageBubble({
    message,
    onRetry,
}) {
    const t = useTranslations("chatbot");
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={isUser ? styles.messageBubbleUser : styles.messageBubbleAssistant}
        >
            {/* Avatar */}
            <div className={isUser ? styles.bubbleAvatarUser : styles.bubbleAvatarAssistant}>
                {isUser ? (
                    <User className={styles.bubbleAvatarIconUser} />
                ) : (
                    <Bot className={styles.bubbleAvatarIconAssistant} />
                )}
            </div>

            {/* Content */}
            <div className={isUser ? styles.bubbleContentUser : styles.bubbleContentAssistant}>
                <div
                    className={
                        isUser
                            ? styles.bubbleBodyUser
                            : message.error
                                ? styles.bubbleBodyError
                                : styles.bubbleBodyAssistant
                    }
                >
                    {isUser ? (
                        <p className={styles.bubbleText}>{message.content}</p>
                    ) : message.error ? (
                        <div className={styles.errorContent}>
                            <div className={styles.errorHeader}>
                                <AlertCircle className={styles.errorIcon} />
                                <p className={styles.errorText}>{message.content}</p>
                            </div>
                            {onRetry && (
                                <button
                                    onClick={onRetry}
                                    className={styles.retryBtn}
                                >
                                    <RotateCcw className={styles.retryIcon} />
                                    {t("retry")}
                                </button>
                            )}
                        </div>
                    ) : (
                        <SimpleMarkdown text={message.content} />
                    )}
                </div>
                <span className={styles.bubbleTimestamp}>{formatTime(message.timestamp)}</span>
            </div>
        </motion.div>
    );
});

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className={styles.typingContainer}
        >
            <div className={styles.bubbleAvatarAssistant}>
                <Bot className={styles.bubbleAvatarIconAssistant} />
            </div>
            <div className={styles.typingBubble}>
                <div className={styles.typingDots}>
                    {[0, 1, 2].map((i) => (
                        <motion.span
                            key={i}
                            className={styles.typingDot}
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// ─── ChatWindow ───────────────────────────────────────────────────────────────
function ChatWindow({ onClose }) {
    const t = useTranslations("chatbot");
    const locale = useLocale();

    const [messages, setMessages] = useState([
        {
            id: generateId(),
            role: "assistant",
            content: t("greeting", { name: portfolioData.personal.name }),
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const [lastUserMessage, setLastUserMessage] = useState(null);

    const messagesEndRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const inputRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = useCallback((smooth = true) => {
        messagesEndRef.current?.scrollIntoView({
            behavior: smooth ? "smooth" : "instant",
        });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, scrollToBottom]);

    // Show scroll-to-bottom button when not at bottom
    const handleScroll = useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        setShowScrollBtn(distFromBottom > 60);
    }, []);

    // Focus input on open
    useEffect(() => {
        const timer = setTimeout(() => inputRef.current?.focus(), 100);
        return () => clearTimeout(timer);
    }, []);

    // Cleanup abort controller on unmount
    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const sendMessage = useCallback(
        async (text) => {
            const trimmed = text.trim();
            if (!trimmed || isLoading) return;

            setLastUserMessage(trimmed);
            setInput("");

            const userMsg = {
                id: generateId(),
                role: "user",
                content: trimmed,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, userMsg]);
            setIsLoading(true);

            // Build messages array for API (exclude error messages)
            const apiMessages = [...messages, userMsg]
                .filter((m) => !m.error)
                .map(({ role, content }) => ({ role, content }));

            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();

            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ messages: apiMessages, locale }),
                    signal: abortControllerRef.current.signal,
                });

                if (!res.ok) {
                    let errorMessage = t("error");
                    try {
                        const errData = await res.json();
                        errorMessage = errData?.error ?? errorMessage;
                    } catch {
                        // ignore JSON parse errors
                    }
                    throw new Error(errorMessage);
                }

                const data = await res.json();
                const reply = data?.reply;

                if (!reply || typeof reply !== "string") {
                    throw new Error(t("invalidResponse"));
                }

                setMessages((prev) => [
                    ...prev,
                    {
                        id: generateId(),
                        role: "assistant",
                        content: reply,
                        timestamp: new Date(),
                    },
                ]);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;

                const errorMsg =
                    err instanceof Error
                        ? err.message
                        : t("unknownError");

                setMessages((prev) => [
                    ...prev,
                    {
                        id: generateId(),
                        role: "assistant",
                        content: errorMsg,
                        timestamp: new Date(),
                        error: true,
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        },
        [messages, isLoading]
    );

    const handleRetry = useCallback(() => {
        if (!lastUserMessage) return;
        // Remove last error message
        setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.error) return prev.slice(0, -1);
            return prev;
        });
        sendMessage(lastUserMessage);
    }, [lastUserMessage, sendMessage]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
            }
        },
        [input, sendMessage]
    );

    // Auto-resize textarea
    const handleInputChange = useCallback(
        (e) => {
            setInput(e.target.value);
            const el = e.target;
            el.style.height = "auto";
            el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
        },
        []
    );

    const SUGGESTED_QUESTIONS = t.raw("suggestions");
    const showSuggestions = messages.length <= 1;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", damping: 24, stiffness: 320 }}
            className={styles.chatWindow}
        >
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.avatarWrapper}>
                        <div className={styles.avatarBot}>
                            <Bot className={styles.avatarBotIcon} />
                        </div>
                        <span className={styles.onlineDot} />
                    </div>
                    <div>
                        <p className={styles.headerTitle}>{t("title")}</p>
                        <p className={styles.headerSubtitle}>
                            {t("subtitle")}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className={styles.closeBtn}
                    aria-label={t("close")}
                >
                    <X className={styles.closeBtnIcon} />
                </button>
            </div>

            {/* Messages area wrapper */}
            <div className={styles.messagesWrapper}>
                <div
                    ref={scrollContainerRef}
                    data-lenis-prevent="true"
                    className={styles.messagesScroll}
                >
                    {messages.map((msg, idx) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            onRetry={msg.error && idx === messages.length - 1 ? handleRetry : undefined}
                        />
                    ))}

                    <AnimatePresence>
                        {isLoading && <TypingIndicator />}
                    </AnimatePresence>

                    {/* Suggested questions */}
                    <AnimatePresence>
                        {showSuggestions && !isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                className={styles.suggestionsContainer}
                            >
                                {SUGGESTED_QUESTIONS.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => sendMessage(q)}
                                        className={styles.suggestionBtn}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input area */}
            <div className={styles.inputArea}>
                <div className={styles.inputRow}>
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        placeholder={t("placeholder")}
                        rows={1}
                        className={styles.textarea}
                        style={{ height: "40px" }}
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        disabled={isLoading || !input.trim()}
                        className={styles.sendBtn}
                        aria-label="Send message"
                    >
                        {isLoading ? (
                            <Loader2 className={`${styles.sendBtnIcon} animate-spin`} />
                        ) : (
                            <Send className={styles.sendBtnIcon} />
                        )}
                    </button>
                </div>
                <p className={styles.inputHint}>
                    {t("inputHint")}
                </p>
            </div>
        </motion.div>
    );
}

// ─── Main ChatBot component ───────────────────────────────────────────────────
export function ChatBot({ headless = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasNewMsg, setHasNewMsg] = useState(false);

    const toggle = useCallback(() => {
        setIsOpen((prev) => !prev);
        setHasNewMsg(false);
    }, []);

    const close = useCallback(() => setIsOpen(false), []);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) close();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, close]);

    // Listen for external toggle events (e.g. from Footer)
    useEffect(() => {
        const handleToggle = () => setIsOpen(true);
        window.addEventListener("portfolio:toggle-chatbot", handleToggle);
        return () => window.removeEventListener("portfolio:toggle-chatbot", handleToggle);
    }, []);

    return (
        <>
            {/* Chat window */}
            <AnimatePresence>{isOpen && <ChatWindow onClose={close} />}</AnimatePresence>

            {/* Trigger button — globally fixed corner button */}
            {!headless && (
                <motion.button
                    onClick={toggle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={isOpen ? styles.triggerBtnOpen : styles.triggerBtn}
                    aria-label="Open portfolio chatbot"
                    aria-expanded={isOpen}
                >
                    <MessageSquare
                        className={styles.triggerIcon}
                    />
                    {/* Notification dot */}
                    {hasNewMsg && !isOpen && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={styles.notificationDot}
                        />
                    )}
                    {/* Pulse ring when closed */}
                    {!isOpen && (
                        <motion.span
                            className={styles.pulseRing}
                            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    )}
                </motion.button>
            )}
        </>
    );
}
