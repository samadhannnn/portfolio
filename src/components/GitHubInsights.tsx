"use client";

import { Code2, Users, Star, GitCommit } from "lucide-react";
import { Github } from "@/components/icons";

export default function GitHubInsights() {
  const stats = [
    { label: "Public Repositories", value: 9, icon: Github },
    { label: "Followers", value: 0, icon: Users },
    { label: "Following", value: 0, icon: Users },
    { label: "Starred Repos", value: 0, icon: Star },
  ];

  const languages = [
    { name: "Python", percentage: 45, color: "bg-blue-500", rawBytes: "85.0 MB" },
    { name: "JavaScript & TS", percentage: 25, color: "bg-yellow-500", rawBytes: "270 KB" },
    { name: "PHP", percentage: 15, color: "bg-purple-500", rawBytes: "420 KB" },
    { name: "Solidity", percentage: 10, color: "bg-indigo-500", rawBytes: "11 KB" },
    { name: "Java & C/C++", percentage: 5, color: "bg-red-500", rawBytes: "320 KB" },
  ];

  // Helper to generate coordinates for a mock contributions map
  // Let's create a 53-week, 7-day grid of contributions
  const weeks = 53;
  const days = 7;
  
  // Generating a seed-based activity level (0 to 4) deterministically to ensure render purity
  const getActivityLevel = (week: number, day: number): number => {
    const seed = Math.sin(week * 12.9898 + day * 78.233) * 43758.5453;
    const pseudoRand = seed - Math.floor(seed);
    const val = Math.sin(week * 0.1) * Math.cos(day * 0.5) + pseudoRand * 0.5;
    if (val > 0.8) return 4; // High
    if (val > 0.4) return 3; // Med-High
    if (val > 0) return 2;   // Med
    if (val > -0.4) return 1; // Low
    return 0; // None
  };

  const activityColors = [
    "bg-muted border border-border/20",
    "bg-emerald-950/20 dark:bg-emerald-900/10 border border-emerald-900/30",
    "bg-emerald-700/40 dark:bg-emerald-800/30 border border-emerald-700/30",
    "bg-emerald-500/60 dark:bg-emerald-600/50 border border-emerald-500/30",
    "bg-emerald-400 dark:bg-emerald-400 border border-emerald-400/30",
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-muted/20 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-accent font-extrabold">Insights</h2>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
            GitHub Activity & Metrics
          </p>
          <div className="h-1 w-12 bg-accent mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Stats and Languages */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="text-lg font-bold font-heading text-foreground mb-4 flex items-center gap-2">
                <Github className="w-5 h-5 text-accent" /> Profile Stats
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="p-4 rounded-lg bg-muted/50 border border-border/60">
                      <Icon className="w-4 h-4 text-secondary mb-2" />
                      <div className="text-2xl font-black text-foreground">{stat.value}</div>
                      <div className="text-[10px] uppercase font-bold text-secondary tracking-wider mt-1">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Language Breakdown */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="text-lg font-bold font-heading text-foreground mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-accent" /> Languages Breakdown
              </h3>
              
              {/* Segmented bar */}
              <div className="h-3 w-full rounded-full overflow-hidden flex mb-6">
                {languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className={`${lang.color} h-full`}
                    style={{ width: `${lang.percentage}%` }}
                    title={`${lang.name}: ${lang.percentage}%`}
                  />
                ))}
              </div>

              {/* Languages List */}
              <div className="space-y-3">
                {languages.map((lang, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${lang.color}`} />
                      <span className="font-semibold text-foreground">{lang.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-secondary text-xs">
                      <span>{lang.rawBytes}</span>
                      <span className="font-bold text-foreground">{lang.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Contribution Grid */}
          <div className="lg:col-span-8 p-6 rounded-xl border border-border bg-card">
            <h3 className="text-lg font-bold font-heading text-foreground mb-4 flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-accent" /> Contribution Calendar
            </h3>
            
            <p className="text-xs text-secondary mb-6 leading-relaxed">
              Based on commits, pull requests, and code review activity. Showcase of regular code commits and build triggers compiled from repository records.
            </p>

            {/* Calendar grid */}
            <div className="overflow-x-auto pb-4">
              <div className="flex flex-col gap-1 min-w-[720px]">
                <div className="flex gap-1">
                  {Array.from({ length: weeks }).map((_, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1">
                      {Array.from({ length: days }).map((_, dIdx) => {
                        const level = getActivityLevel(wIdx, dIdx);
                        return (
                          <div
                            key={dIdx}
                            className={`w-2.5 h-2.5 rounded-[2px] transition-all hover:scale-125 ${activityColors[level]}`}
                            title={`Contribution level: ${level}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1.5 mt-4 text-[10px] text-secondary font-bold">
              <span>Less</span>
              {activityColors.map((color, idx) => (
                <span key={idx} className={`w-2.5 h-2.5 rounded-[1px] ${color}`} />
              ))}
              <span>More</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
