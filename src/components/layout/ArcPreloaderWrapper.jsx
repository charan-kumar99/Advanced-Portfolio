"use client";

import React from "react";
import { ArcRevealHero } from "@/components/ui/arc-preloader-hero";

export function ArcPreloaderWrapper({ children }) {
    return (
        <ArcRevealHero>
            {children}
        </ArcRevealHero>
    );
}
