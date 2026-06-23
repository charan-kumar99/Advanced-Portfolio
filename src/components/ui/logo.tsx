import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export function Logo({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <Image 
      src={isDark ? "/icons/Charan_Kumar_Logo_Light.svg" : "/icons/Charan_Kumar_Logo_Dark.svg"} 
      alt="Logo" 
      width={32} 
      height={32} 
      className={cn("w-8 h-8", className)} 
    />
  );
}
