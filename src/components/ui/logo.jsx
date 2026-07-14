import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import styles from './logo.module.css';

export function Logo({ className }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <Image 
      src={isDark ? "/icons/Charan_Kumar_Logo_Light.svg" : "/icons/Charan_Kumar_Logo_Dark.svg"} 
      alt="Logo" 
      width={32} 
      height={32} 
      className={cn(styles.logo, className)} 
    />
  );
}
