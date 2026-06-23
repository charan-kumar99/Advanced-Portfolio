"use client";
import React from "react";
import Image from "next/image";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { GraduationCap, BookOpen, Star, Binary, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExperienceStickyScroll({ isLowPowerMode = false }: { isLowPowerMode?: boolean }) {
    const journeyContent = [
        {
            label: "Higher Education • Current",
            title: "MIT, Jaipur",
            description: "Master of Computer Applications (MCA). Focused on advanced software engineering, system architecture, and modern application development.",
            content: (
                <div className="h-full w-full flex items-center justify-center p-8 bg-black/5 dark:bg-white/5 relative group overflow-hidden border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 via-black/50 to-black/80" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="relative mb-6">
                            <GraduationCap className={cn("w-20 h-20 text-white drop-shadow-lg", !isLowPowerMode && "animate-pulse")} />
                            <Binary className={cn("w-8 h-8 text-blue-400 absolute -top-2 -right-2 opacity-80", !isLowPowerMode && "animate-bounce")} />
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                            {["MCA", "Software Engineering", "2025-Ongoing"].map(s => (
                                <span key={s} className="px-3 py-1 rounded-full text-[10px] bg-white/10 text-white border border-white/20 font-mono font-bold backdrop-blur-md shadow-lg">
                                    {s}
                                </span>
                            ))}
                        </div>
                        <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest bg-black/20 px-2 py-1 rounded">Advanced Engineering</p>
                    </div>
                </div>
            ),
        },
        {
            label: "Foundation • Undergraduate",
            title: "Mangalore University",
            description: "Bachelor of Computer Applications (BCA). Developed strong analytical foundations in software development and database management.",
            content: (
                <div className="h-full w-full flex items-center justify-center p-8 bg-black/5 dark:bg-white/5 relative group overflow-hidden border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-900/50 via-rose-900/30 to-black/80 mix-blend-multiply" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="relative mb-6">
                            <BookOpen className="w-20 h-20 text-white drop-shadow-lg hover:rotate-6 transition-transform duration-500" />
                            <Sparkles className={cn("w-6 h-6 text-yellow-400 absolute -bottom-2 -left-2", !isLowPowerMode && "animate-pulse")} />
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                            {["BCA", "Mangalore", "2022-2025"].map(s => (
                                <span key={s} className="px-3 py-1 rounded-full text-[10px] bg-white/10 text-white border border-white/20 font-mono font-bold backdrop-blur-md shadow-lg">
                                    {s}
                                </span>
                            ))}
                        </div>
                        <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest bg-black/20 px-2 py-1 rounded">Logical Foundation</p>
                    </div>
                </div>
            ),
        }
    ];

    return (
        <div className="w-full">
            <StickyScroll content={journeyContent} isLowPowerMode={isLowPowerMode} />
        </div>
    );
}
