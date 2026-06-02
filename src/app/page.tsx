"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import GitHubInsights from "@/components/GitHubInsights";
import CodingStats from "@/components/CodingStats";
import ContactForm from "@/components/ContactForm";
import SamAI from "@/components/SamAI";
import { Cpu, Mail } from "lucide-react";
import { Github, Linkedin } from "@/components/icons";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  // Track visitor metrics on page mount
  useEffect(() => {
    const recordVisitor = async () => {
      try {
        let sessionId = localStorage.getItem("visitor_session_id");
        let isNew = false;
        
        if (!sessionId) {
          sessionId = Math.random().toString(36).substring(2, 15);
          localStorage.setItem("visitor_session_id", sessionId);
          isNew = true;
        }

        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: "visit", metadata: { sessionId, isNew } }),
        });
      } catch (err) {
        console.error("Failed to record visitor analytics:", err);
      }
    };
    recordVisitor();
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <HeroSection onOpenChat={() => setChatOpen(true)} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <GitHubInsights />
        <CodingStats />
        <ContactForm />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left spacer for desktop centering */}
          <div className="hidden md:block w-32" />

          {/* Copyright Info */}
          <div className="flex items-center justify-center gap-2 flex-grow">
            <Cpu className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold font-heading text-foreground">
              Samadhan Bodkhe &copy; {new Date().getFullYear()}
            </span>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 justify-center md:justify-end w-auto md:w-32">
            <a
              href="https://github.com/samadhannnn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-foreground transition-colors"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/samadhan-bodkhe-766308270/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-foreground transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:samadhanbodkhe222@gmail.com"
              className="text-secondary hover:text-foreground transition-colors"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* Chatbot Overlay Widget */}
      <SamAI isOpen={chatOpen} onOpen={() => setChatOpen(true)} onClose={() => setChatOpen(false)} />
    </div>
  );
}
