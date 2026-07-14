"use client";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { portfolioData } from "@/data/portfolio";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from 'next-intl';

export const NavigationShortcuts = () => {
    return null; // Component disabled per user request
};
