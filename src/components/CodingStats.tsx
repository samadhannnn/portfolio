"use client";

import { useEffect, useState } from "react";
import { Award, Trophy, Star, ExternalLink, Code2 } from "lucide-react";

interface LeetcodeStats {
  solved: number;
  easy: number;
  medium: number;
  hard: number;
}

interface HackerRankBadge {
  name: string;
  stars: number;
  solved: number;
}

export default function CodingStats() {
  const [stats, setStats] = useState<{
    leetcode: LeetcodeStats;
    hackerrank: HackerRankBadge[];
  }>({
    leetcode: { solved: 58, easy: 29, medium: 17, hard: 12 },
    hackerrank: [
      { name: "Java", stars: 5, solved: 24 },
      { name: "Python", stars: 5, solved: 7 },
      { name: "C", stars: 4, solved: 14 },
    ],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/coding-stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load coding statistics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-accent font-extrabold">Competitive Programming</h2>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
            Coding Profiles & Status
          </p>
          <p className="mt-3 text-sm text-secondary">
            Syncing live solving accomplishments dynamically from platforms daily.
          </p>
          <div className="h-1 w-12 bg-accent mx-auto mt-4 rounded-full" />
        </div>

        {/* Two Column Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* LeetCode Card */}
          <div className="p-6 sm:p-8 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between hover:border-accent/40 transition-colors duration-300 relative group">
            <div className="absolute top-6 right-6">
              <a
                href="https://leetcode.com/u/Samadhannnnn/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border bg-card text-secondary hover:text-accent hover:bg-accent/5 transition-all flex items-center gap-1 text-xs font-bold"
              >
                Profile <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold font-heading text-foreground text-lg sm:text-xl">LeetCode</h3>
                  <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">
                    @Samadhannnnn
                  </span>
                </div>
              </div>

              {/* Solved Count Breakdown */}
              <div className="flex flex-col sm:flex-row items-center gap-8 my-8">
                {/* Circular indicator */}
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-muted"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-amber-500 transition-all duration-1000"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={251.2}
                      // Solved out of arbitrary goal e.g. 500
                      strokeDashoffset={251.2 - (251.2 * Math.min(stats.leetcode.solved, 500)) / 500}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-foreground">
                      {loading ? "..." : stats.leetcode.solved}
                    </span>
                    <span className="text-[9px] uppercase font-extrabold text-secondary tracking-wider">
                      Solved
                    </span>
                  </div>
                </div>

                {/* Sub-counts */}
                <div className="flex-grow w-full space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-emerald-500">Easy</span>
                      <span className="text-foreground">{stats.leetcode.easy}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (stats.leetcode.easy / stats.leetcode.solved) * 100 || 0)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-amber-500">Medium</span>
                      <span className="text-foreground">{stats.leetcode.medium}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (stats.leetcode.medium / stats.leetcode.solved) * 100 || 0)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-rose-500">Hard</span>
                      <span className="text-foreground">{stats.leetcode.hard}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, (stats.leetcode.hard / stats.leetcode.solved) * 100 || 0)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-secondary mt-4 leading-relaxed">
              *LeetCode circle progress bar is calibrated against a milestone target of 500 problems. Statistics updated dynamically from profile state.
            </p>
          </div>

          {/* HackerRank Card */}
          <div className="p-6 sm:p-8 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between hover:border-accent/40 transition-colors duration-300 relative group">
            <div className="absolute top-6 right-6">
              <a
                href="https://www.hackerrank.com/profile/samadhan_bodkhe"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border bg-card text-secondary hover:text-accent hover:bg-accent/5 transition-all flex items-center gap-1 text-xs font-bold"
              >
                Profile <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold font-heading text-foreground text-lg sm:text-xl">HackerRank</h3>
                  <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">
                    @samadhan_bodkhe
                  </span>
                </div>
              </div>

              {/* Badges List */}
              <div className="space-y-4 my-8">
                {stats.hackerrank.map((badge, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-muted/40 border border-border/80 flex items-center justify-between hover:border-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-card border border-border flex items-center justify-center">
                        <Code2 className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{badge.name} Proficiency</h4>
                        <span className="text-[10px] text-secondary font-semibold">
                          Solved: {badge.solved} challenges
                        </span>
                      </div>
                    </div>

                    {/* Star ratings */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, sIdx) => (
                        <Star
                          key={sIdx}
                          className={`w-3.5 h-3.5 ${
                            sIdx < badge.stars
                              ? "text-amber-400 fill-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-secondary mt-4 leading-relaxed">
              *HackerRank proficiency badges representing language certifications (Java, Python, C) parsed dynamically from profile star allocations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
