'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';
import { useTheme } from 'next-themes';
import { 
    BadgeCheck, 
    MapPin, 
    Clock, 
    ChevronRight,
    ExternalLink,
    Code2,
    Terminal,
    Brain,
    MessageSquare,
    Home,
    FileText,
    Linkedin,
    Github,
    Mail,
    Globe,
    Sun,
    Moon,
    Bot
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

export default function BentoPage() {
    const { personal, experiences, education, techStack, tools, projects, achievements } = portfolioData;
    const [time, setTime] = useState('');
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const updateTime = () => {
            const now = new Date();
            const h = String(now.getHours() % 12 || 12).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
            setTime(`${h}:${m}:${s} ${ampm}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-white selection:bg-primary/30 font-sans pb-32 transition-colors duration-300">
            {/* Noise Overlay */}
            <div 
                className="fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.03] opacity-0 pointer-events-none" 
                style={{ backgroundImage: 'url("/noise.png")' }}
            />

            <main className="relative z-10 max-w-[800px] mx-auto px-6 pt-20 flex flex-col gap-12">
                
                {/* Header Section */}
                <section className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{personal.name}</h1>
                            <BadgeCheck className="w-6 h-6 text-blue-500 mt-2" />
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-md leading-relaxed">
                            {personal.subtitle}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500 mt-2">
                            <div className="flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Available for opportunity
                            </div>
                            <div className="flex items-center gap-1.5 border-l border-zinc-300 dark:border-zinc-800 pl-4">
                                <MapPin className="w-3.5 h-3.5" />
                                {personal.location}
                            </div>
                            <div className="flex items-center gap-1.5 border-l border-zinc-300 dark:border-zinc-800 pl-4">
                                <Clock className="w-3.5 h-3.5" />
                                {time || '00:00:00 AM'}
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative shrink-0">
                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 relative">
                            <Image 
                                src={personal.avatar} 
                                alt={personal.name} 
                                fill
                                className="object-cover object-top scale-105"
                            />
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold">About</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-loose">
                        {personal.bio}
                    </p>
                </section>

                {/* Work Experience Section */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold">Work Experience</h2>
                    <div className="flex flex-col gap-6">
                        {experiences.map((exp, i) => (
                            <div key={exp.id} className="flex gap-4 group">
                                <div className="relative flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black overflow-hidden flex items-center justify-center shrink-0">
                                    <Image src={exp.logo || '/default-logo.png'} alt={exp.company} width={24} height={24} className="object-contain w-6 h-6" />
                                </div>
                                    {i !== experiences.length - 1 && (
                                        <div className="absolute top-10 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800 -mb-6 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-600 transition-colors" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-1 pb-6 w-full">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-base">{exp.company}</h3>
                                            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                                                {exp.position} {exp.location && `• ${exp.location}`}
                                            </p>
                                        </div>
                                        <span className="text-xs text-zinc-500 whitespace-nowrap">
                                            {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - {exp.isOngoing ? 'Present' : exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button className="self-start px-4 py-2 mt-2 text-xs font-medium border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                        View All Experience <ChevronRight className="w-3 h-3" />
                    </button>
                </section>

                {/* Education Section */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold">Education</h2>
                    <div className="flex flex-col gap-6">
                        {education.map((edu) => (
                            <div key={edu.id} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center shrink-0 overflow-hidden">
                                    <span className="text-xl">🎓</span>
                                </div>
                                <div className="flex justify-between items-start w-full">
                                    <div className="flex flex-col gap-0.5">
                                        <h3 className="font-bold text-base">{edu.institution}</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">{edu.degree} - {edu.major}</p>
                                    </div>
                                    <span className="text-xs text-zinc-500 whitespace-nowrap">
                                        {new Date(edu.startDate).getFullYear()} - {edu.isOngoing ? 'Present' : edu.endDate && new Date(edu.endDate).getFullYear()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Skills Section */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold">Skills</h2>
                    
                    <div className="flex flex-col gap-6">
                        {/* Tech Stack */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-xs font-bold text-zinc-500 tracking-wider uppercase">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {techStack.map(skill => (
                                    <div key={skill.name} className="flex items-center gap-2 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-full bg-white dark:bg-zinc-900/50 text-sm shadow-sm dark:shadow-none">
                                        <Image src={skill.icon} alt={skill.name} width={14} height={14} className="shrink-0" />
                                        <span>{skill.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tools */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-xs font-bold text-zinc-500 tracking-wider uppercase">Tools</h3>
                            <div className="flex flex-wrap gap-2">
                                {tools.map(tool => (
                                    <div key={tool.name} className="flex items-center gap-2 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-full bg-white dark:bg-zinc-900/50 text-sm shadow-sm dark:shadow-none">
                                        <Image src={tool.icon} alt={tool.name} width={14} height={14} className="shrink-0" />
                                        <span>{tool.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                         {/* Hard Skills Mockup */}
                         <div className="flex flex-col gap-3">
                            <h3 className="text-xs font-bold text-zinc-500 tracking-wider uppercase">Hard Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Clean Architecture', 'Microservices', 'REST APIs', 'Backend Development'].map(skill => (
                                    <div key={skill} className="px-4 py-1.5 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 rounded-full bg-blue-50 dark:bg-blue-500/10 text-sm font-medium">
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>

                {/* Projects Section */}
                <section className="flex flex-col gap-8 pt-8 items-center">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <span className="px-4 py-1.5 bg-zinc-200 dark:bg-zinc-100 text-zinc-800 dark:text-zinc-900 rounded-full text-sm font-bold">My Projects</span>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Check out my latest work</h2>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-md">I've worked on a variety of projects, from simple tools to full-stack web applications. Here are a few of my favorites.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {projects.map((project) => (
                            <Link href={project.repoUrl || '#'} target="_blank" key={project.id} className="group flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shadow-sm dark:shadow-none">
                                <div className="h-48 w-full bg-zinc-100 dark:bg-zinc-800/50 relative overflow-hidden flex flex-col items-center justify-center text-center">
                                     {project.image ? (
                                         <>
                                             <Image src={project.image} alt={project.title} fill className={`object-cover object-top transition-all duration-500 group-hover:scale-105 ${project.galleryImages && project.galleryImages.length > 0 ? 'group-hover:opacity-0' : ''}`} />
                                             {project.galleryImages && project.galleryImages.length > 0 && (
                                                 <Image src={project.galleryImages[0]} alt={`${project.title} inside`} fill className="object-cover object-top opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105" />
                                             )}
                                         </>
                                     ) : (
                                         <div className="p-6">
                                             <h3 className="text-2xl font-black text-black/10 dark:text-white/20 uppercase break-all">{project.title}</h3>
                                         </div>
                                     )}
                                     <div className="absolute top-3 right-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-zinc-200 dark:border-zinc-700 z-10">
                                        <Github className="w-3 h-3" /> Source
                                     </div>
                                </div>
                                <div className="p-5 flex flex-col gap-3 flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                            {project.title}
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h3>
                                    </div>
                                    <p className="text-xs text-zinc-500">{new Date(project.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">{project.description}</p>
                                    
                                    <div className="flex flex-wrap gap-1.5 mt-auto pt-4">
                                        {project.techStack.map(tech => (
                                            <span key={tech} className="text-[10px] font-mono px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Contact Section */}
                <section className="mt-12 flex flex-col items-center">
                    <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-center flex flex-col items-center gap-4 relative overflow-hidden shadow-sm dark:shadow-none">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/50 dark:from-blue-500/10 to-transparent pointer-events-none" />
                        <span className="px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full text-xs font-bold uppercase tracking-wider relative z-10">Contact</span>
                        <h2 className="text-3xl font-bold tracking-tight relative z-10">Get in Touch</h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 relative z-10">
                            Want to collaborate or have a question? Reach out to me on <a href={personal.socialLinks.find(l => l.platform === 'LinkedIn')?.url} className="text-blue-600 dark:text-blue-400 hover:underline">LinkedIn</a> or send me an <a href={`mailto:${personal.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">email</a>. I'm always open to new opportunities and discussions.
                        </p>
                    </div>
                </section>

            </main>

            {/* Floating Dock */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl">
                    <Link href="/" className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white" title="Home">
                        <Home className="w-4 h-4" />
                    </Link>
                    <Link href="/resume" className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white" title="Resume">
                        <FileText className="w-4 h-4" />
                    </Link>
                    <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-800 mx-1" />
                    {personal.socialLinks.map((link) => {
                        const Icon = link.platform === 'LinkedIn' ? Linkedin : link.platform === 'GitHub' ? Github : Globe;
                        return (
                            <Link key={link.platform} href={link.url} target="_blank" className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white" title={link.platform}>
                                <Icon className="w-4 h-4" />
                            </Link>
                        )
                    })}
                    <Link href={`mailto:${personal.email}`} className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white" title="Email">
                        <Mail className="w-4 h-4" />
                    </Link>
                    <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-800 mx-1" />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            window.dispatchEvent(new CustomEvent('portfolio:toggle-chatbot'));
                        }}
                        className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        title="Chat with AI"
                    >
                        <Bot className="w-4 h-4" />
                    </button>
                    <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-800 mx-1" />
                    <AnimatedThemeToggler className="!bg-transparent !p-2.5 hover:!bg-zinc-100 dark:hover:!bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:!text-zinc-900 dark:hover:!text-white" />
                </div>
            </div>
        </div>
    );
}
