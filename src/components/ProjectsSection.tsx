"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ExternalLink, Star, GitFork, Calendar, Layers } from "lucide-react";
import { Github } from "@/components/icons";

import { PROJECTS_DATA, type Project } from "@/data/projects";

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS_DATA);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"updated" | "alphabetical">("updated");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      }
    }
    fetchProjects();
  }, []);

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "ai", label: "AI & ML" },
    { id: "blockchain", label: "Blockchain & Web3" },
    { id: "fullstack", label: "Full Stack" },
    { id: "web", label: "Web Dev" },
    { id: "java", label: "Java" },
  ];

  const handleProjectClick = async (projectName: string) => {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "project_click", metadata: { project: projectName } }),
      });
    } catch (err) {
      console.error("Failed to track project click:", err);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));

      const matchCategory = activeCategory === "all" || project.category === activeCategory;

      return matchSearch && matchCategory;
    }).sort((a, b) => {
      if (sortBy === "updated") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return a.title.localeCompare(b.title);
    });
  }, [projects, search, activeCategory, sortBy]);

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-accent font-extrabold">Projects</h2>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
            Repository Showcase
          </p>
          <div className="h-1 w-12 bg-accent mx-auto mt-4 rounded-full" />
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 pb-6 border-b border-border">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-primary border-primary text-background"
                    : "bg-card border-border text-secondary hover:text-foreground hover:bg-muted"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search and Sort controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow md:w-60">
              <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "updated" | "alphabetical")}
              className="px-3 py-2 text-sm rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-accent"
            >
              <option value="updated">Recent</option>
              <option value="alphabetical">Name</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.name}
              className="p-6 rounded-xl border border-border bg-card glow-card flex flex-col justify-between"
            >
              <div>
                {/* Language / Header info */}
                <div className="flex justify-between items-center mb-4">
                  <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase border border-border/80 text-secondary bg-muted rounded-md flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    {project.language}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{project.updatedAt}</span>
                  </div>
                </div>

                {/* Title */}
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleProjectClick(project.name)}
                  className="hover:text-accent transition-colors duration-200 block group"
                >
                  <h3 className="text-xl font-bold font-heading mb-3 text-foreground group-hover:text-accent">
                    {project.title}
                  </h3>
                </a>

                {/* Description */}
                <p className="text-sm text-secondary leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              <div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-semibold bg-muted/60 text-secondary border border-border/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Card footer links and metrics */}
                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <div className="flex items-center gap-3 text-secondary text-xs">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" />
                      {project.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5" />
                      {project.forks}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleProjectClick(project.name)}
                      className="p-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted hover:text-accent transition-colors"
                      title="View GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    {project.liveUrl && project.liveUrl !== "deploying" ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleProjectClick(project.name)}
                        className="p-2 rounded-lg bg-accent text-white hover:bg-indigo-700 transition-colors"
                        title="View Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <span
                        className="px-2.5 py-1 rounded border border-border bg-muted/40 text-[9px] font-bold text-secondary cursor-default uppercase tracking-wider"
                        title="Deployment in progress"
                      >
                        Deploying...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border rounded-xl bg-card/50">
            <Layers className="w-8 h-8 text-secondary mx-auto mb-3" />
            <p className="text-secondary font-medium">No projects found matching the criteria.</p>
          </div>
        )}

      </div>
    </section>
  );
}
