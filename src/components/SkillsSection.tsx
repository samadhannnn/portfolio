"use client";

import { Cpu, Brain, Code2, Globe, Database, GitFork, ShieldAlert } from "lucide-react";

export default function SkillsSection() {
  const skillCategories = [
    {
      title: "AI & Deep Learning",
      icon: Brain,
      skills: [
        "Convolutional Neural Networks (CNN)",
        "Keras",
        "TensorFlow",
        "Image Classification",
        "Data Augmentation",
        "Data Preprocessing",
        "Model Optimization",
      ],
    },
    {
      title: "Languages",
      icon: Code2,
      skills: ["Python", "JavaScript", "TypeScript", "Solidity", "Java", "C++", "C", "PHP"],
    },
    {
      title: "Frontend Development",
      icon: Globe,
      skills: ["React.js", "Next.js (App Router)", "Tailwind CSS", "Framer Motion", "HTML5 & CSS3", "Bootstrap"],
    },
    {
      title: "Backend & APIs",
      icon: Cpu,
      skills: ["Node.js", "RESTful APIs", "Laravel", "PHP Scripting", "Express.js"],
    },
    {
      title: "Databases & Storage",
      icon: Database,
      skills: ["PostgreSQL", "Supabase", "MySQL", "SQLite", "Relational Database Design"],
    },
    {
      title: "Web3 & Blockchain",
      icon: ShieldAlert,
      skills: ["Solidity Smart Contracts", "Hardhat Environment", "Ethers.js", "Decentralized Apps (DApps)", "Web3 Wallet Auth"],
    },
    {
      title: "Developer Tools",
      icon: GitFork,
      skills: ["Git & GitHub", "Docker (Containers)", "Figma Design", "VS Code", "XAMPP", "NPM / Yarn"],
    },
  ];

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-accent font-extrabold">Skills</h2>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
            Technical Matrix
          </p>
          <div className="h-1 w-12 bg-accent mx-auto mt-4 rounded-full" />
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl border border-border bg-card glow-card flex flex-col justify-between hover:shadow-lg hover:shadow-indigo-500/5 duration-300"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 rounded-lg bg-accent/5 text-accent">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold font-heading text-foreground text-md sm:text-lg">
                      {category.title}
                    </h3>
                  </div>

                  {/* Skills Badges */}
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-md bg-muted text-xs font-semibold text-secondary hover:text-foreground border border-border/60 hover:border-accent/40 transition-colors duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
