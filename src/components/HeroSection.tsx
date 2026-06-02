"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Download, MessageSquare, Bot, Code2, Cpu, Database, FolderGit2 } from "lucide-react";

interface HeroSectionProps {
  onOpenChat: () => void;
}

export default function HeroSection({ onOpenChat }: HeroSectionProps) {
  const titles = [
    "AI Engineer",
    "Machine Learning Engineer",
    "Software Engineer",
    "Full Stack Developer",
    "Problem Solver",
  ];

  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [titles.length]);

  const handleResumeDownload = async () => {
    try {
      // Record download analytics
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "resume_download" }),
      });
    } catch (err) {
      console.error("Failed to record analytics:", err);
    }
  };

  const stats = [
    { label: "GitHub Repos", value: 9, icon: FolderGit2 },
    { label: "Avg Diploma %", value: "90.7%", icon: Cpu },
    { label: "Languages Mastered", value: 8, icon: Code2 },
    { label: "Database Engine", value: "Supabase", icon: Database },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-dot-pattern">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-semibold text-accent mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Available for Internships & AI/ML Projects
        </motion.div>

        {/* Main Header */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold font-heading text-foreground tracking-tight leading-none max-w-4xl"
        >
          Building intelligent systems that connect models with markets.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-xl sm:text-2xl font-medium text-secondary flex flex-col sm:flex-row items-center justify-center gap-x-2 gap-y-1 sm:h-10 min-h-[2.5rem]"
        >
          <span>Hi, I am Samadhan Bodkhe<span className="hidden sm:inline">,</span></span>
          <div className="relative inline-block text-accent font-bold text-center sm:text-left overflow-hidden min-w-[220px] h-8 sm:h-10">
            <AnimatePresence>
              <motion.span
                key={titleIndex}
                initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -16, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 right-0 sm:right-auto sm:left-0 text-center sm:text-left mx-auto sm:mx-0"
              >
                {titles[titleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Short Summary */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-md sm:text-lg text-secondary max-w-2xl leading-relaxed text-center mx-auto"
        >
          Specializing in Deep Learning, Blockchain decentralized architectures, and full-stack API integration. Undergrad in Artificial Intelligence & Machine Learning.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-accent/25 transition-all duration-200"
          >
            View Projects <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="/Samadhan_Bodkhe_Resume.pdf"
            download
            onClick={handleResumeDownload}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-muted transition-all duration-200"
          >
            Download Resume <Download className="w-4 h-4" />
          </a>

          <a
            href="#contact"
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-muted transition-all duration-200"
          >
            Contact <MessageSquare className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-accent bg-accent/5 text-accent font-medium hover:bg-accent/10 transition-all duration-200"
          >
            Talk to SAM AI <Bot className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Live Metrics Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 px-4"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm shadow-sm relative group hover:border-accent/40 transition-colors duration-300"
              >
                <Icon className="w-5 h-5 text-accent/70 group-hover:text-accent mb-3 transition-colors duration-300" />
                <span className="text-3xl font-extrabold text-foreground tracking-tight font-heading">
                  {stat.value}
                </span>
                <span className="text-xs text-secondary mt-1 uppercase tracking-wider font-semibold">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
