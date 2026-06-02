"use client";

import { useState } from "react";
import {
  addProjectAction,
  deleteProjectAction,
  updateProjectAction,
} from "@/app/admin-dashboard/actions";
import {
  Save,
  CloudLightning,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Plus,
  Settings,
  FolderPlus,
  Search,
  RefreshCw,
  Layers,
} from "lucide-react";
import { Github } from "@/components/icons";
import { type Project } from "@/data/projects";

interface ProjectManagerProps {
  projects: Project[];
}

interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  githubUrl: string;
  stars: number;
  forks: number;
  updatedAt: string;
}

export default function ProjectManager({ projects: initialProjects }: ProjectManagerProps) {
  const [projectsList, setProjectsList] = useState<Project[]>(initialProjects);
  const [activeTab, setActiveTab] = useState<"manage" | "add" | "github">("manage");

  // Global Notification
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  // --- TAB 1: MANAGE PROJECTS ---
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Project>>({});
  const [savingProject, setSavingProject] = useState<string | null>(null);
  const [deletingProject, setDeletingProject] = useState<string | null>(null);

  const handleStartEdit = (project: Project) => {
    setEditingProject(project.name);
    setEditForm({ ...project });
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setEditForm({});
  };

  const handleUpdateProject = async (name: string) => {
    if (!editForm.title || !editForm.githubUrl) {
      showFeedback("error", "Title and GitHub URL are required fields.");
      return;
    }

    setSavingProject(name);
    try {
      // Convert tags back to array if modified as string (optional safe-guard)
      const res = await updateProjectAction(name, editForm);
      if (res.success) {
        setProjectsList((prev) =>
          prev.map((p) => (p.name === name ? { ...p, ...editForm } as Project : p))
        );
        showFeedback("success", "Project updated successfully.");
        setEditingProject(null);
      } else {
        showFeedback("error", res.error || "Failed to update project.");
      }
    } catch {
      showFeedback("error", "An error occurred while updating the project.");
    } finally {
      setSavingProject(null);
    }
  };

  const handleDeleteProject = async (name: string) => {
    if (deletingProject !== name) {
      // First click: prompt confirmation
      setDeletingProject(name);
      setTimeout(() => setDeletingProject(null), 3000);
      return;
    }

    try {
      const res = await deleteProjectAction(name);
      if (res.success) {
        setProjectsList((prev) => prev.filter((p) => p.name !== name));
        showFeedback("success", "Project deleted successfully.");
      } else {
        showFeedback("error", res.error || "Failed to delete project.");
      }
    } catch {
      showFeedback("error", "An error occurred while deleting the project.");
    } finally {
      setDeletingProject(null);
    }
  };

  // --- TAB 2: ADD MANUALLY ---
  const [manualForm, setManualForm] = useState<Partial<Project>>({
    name: "",
    title: "",
    description: "",
    language: "TypeScript",
    tags: [],
    githubUrl: "",
    liveUrl: "deploying",
    category: "web",
    stars: 0,
    forks: 0,
    updatedAt: new Date().toISOString().split("T")[0],
  });
  const [manualFormTagsStr, setManualFormTagsStr] = useState("");
  const [addingManual, setAddingManual] = useState(false);

  const handleAddManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.title || !manualForm.name || !manualForm.githubUrl) {
      showFeedback("error", "Slug Name, Title, and GitHub URL are required.");
      return;
    }

    setAddingManual(true);
    const tagsArray = manualFormTagsStr
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    const newProject: Project = {
      name: manualForm.name.trim().replace(/\s+/g, "_"),
      title: manualForm.title.trim(),
      description: manualForm.description || "",
      language: manualForm.language || "TypeScript",
      tags: tagsArray,
      githubUrl: manualForm.githubUrl.trim(),
      liveUrl: manualForm.liveUrl || "deploying",
      category: manualForm.category || "web",
      stars: Number(manualForm.stars) || 0,
      forks: Number(manualForm.forks) || 0,
      updatedAt: manualForm.updatedAt || new Date().toISOString().split("T")[0],
    };

    try {
      const res = await addProjectAction(newProject);
      if (res.success) {
        setProjectsList((prev) => [...prev, newProject]);
        showFeedback("success", "Manual project added successfully.");
        // Reset Form
        setManualForm({
          name: "",
          title: "",
          description: "",
          language: "TypeScript",
          tags: [],
          githubUrl: "",
          liveUrl: "deploying",
          category: "web",
          stars: 0,
          forks: 0,
          updatedAt: new Date().toISOString().split("T")[0],
        });
        setManualFormTagsStr("");
      } else {
        showFeedback("error", res.error || "Failed to add project.");
      }
    } catch {
      showFeedback("error", "An error occurred while adding the project.");
    } finally {
      setAddingManual(false);
    }
  };

  // --- TAB 3: GITHUB IMPORTER ---
  const [githubUser, setGithubUser] = useState("samadhannnn");
  const [fetchingRepos, setFetchingRepos] = useState(false);
  const [fetchedRepos, setFetchedRepos] = useState<GitHubRepo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Repo expansion state for specific configuration before import
  const [repoToImport, setRepoToImport] = useState<string | null>(null);
  const [importConfig, setImportConfig] = useState<{
    category: "ai" | "blockchain" | "fullstack" | "web" | "java" | "other";
    tags: string;
    liveUrl: string;
  }>({
    category: "web",
    tags: "",
    liveUrl: "deploying",
  });
  const [importingRepo, setImportingRepo] = useState(false);

  const fetchGitHubRepos = async () => {
    setFetchingRepos(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/github-repos?username=${githubUser}`);
      if (res.ok) {
        const data = await res.json();
        setFetchedRepos(data);
        showFeedback("success", `Fetched ${data.length} repositories successfully.`);
      } else {
        const errData = await res.json();
        showFeedback("error", errData.error || "Failed to fetch repositories.");
      }
    } catch {
      showFeedback("error", "Network error while connecting to GitHub proxy API.");
    } finally {
      setFetchingRepos(false);
    }
  };

  const handleOpenImportConfig = (repo: GitHubRepo) => {
    setRepoToImport(repo.name);
    // Pre-populate tags from description/language
    const defaultTags = [repo.language];
    if (repo.description) {
      if (repo.description.toLowerCase().includes("learning") || repo.description.toLowerCase().includes("keras") || repo.description.toLowerCase().includes("model")) {
        defaultTags.push("AI", "Machine Learning");
      }
      if (repo.description.toLowerCase().includes("react") || repo.description.toLowerCase().includes("next")) {
        defaultTags.push("React.js", "Frontend");
      }
    }
    
    // Guess category
    let category: "ai" | "blockchain" | "fullstack" | "web" | "java" | "other" = "web";
    if (repo.language?.toLowerCase() === "solidity" || repo.description?.toLowerCase().includes("blockchain") || repo.description?.toLowerCase().includes("web3")) {
      category = "blockchain";
    } else if (repo.language?.toLowerCase() === "python" || repo.description?.toLowerCase().includes("deep learning") || repo.description?.toLowerCase().includes("keras")) {
      category = "ai";
    } else if (repo.language?.toLowerCase() === "java") {
      category = "java";
    } else if (repo.description?.toLowerCase().includes("fullstack") || repo.description?.toLowerCase().includes("full-stack") || repo.language?.toLowerCase() === "php") {
      category = "fullstack";
    }

    setImportConfig({
      category,
      tags: defaultTags.filter(Boolean).join(", "),
      liveUrl: "deploying",
    });
  };

  const handleExecuteImport = async (repo: GitHubRepo) => {
    setImportingRepo(true);
    const tagsArray = importConfig.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    // Format a nice Title from repository name (e.g. Plant_Disease_Detection -> Plant Disease Detection)
    const formattedTitle = repo.name
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    const newProject: Project = {
      name: repo.name,
      title: formattedTitle,
      description: repo.description,
      language: repo.language || "JavaScript",
      tags: tagsArray,
      githubUrl: repo.githubUrl,
      liveUrl: importConfig.liveUrl || "deploying",
      category: importConfig.category,
      stars: repo.stars,
      forks: repo.forks,
      updatedAt: repo.updatedAt,
    };

    try {
      const res = await addProjectAction(newProject);
      if (res.success) {
        setProjectsList((prev) => {
          // Remove existing duplicate slug if any
          const filtered = prev.filter((p) => p.name !== newProject.name);
          return [...filtered, newProject];
        });
        showFeedback("success", `Imported ${repo.name} successfully.`);
        setRepoToImport(null);
      } else {
        showFeedback("error", res.error || "Failed to import project.");
      }
    } catch {
      showFeedback("error", "An error occurred during repo import.");
    } finally {
      setImportingRepo(false);
    }
  };

  const filteredRepos = fetchedRepos.filter((repo) => {
    const query = searchQuery.toLowerCase();
    return (
      repo.name.toLowerCase().includes(query) ||
      repo.description.toLowerCase().includes(query) ||
      (repo.language || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-6">
      {/* CMS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-md font-bold font-heading text-foreground flex items-center gap-2">
            <CloudLightning className="w-4 h-4 text-accent" /> Portfolio Project CMS
          </h2>
          <p className="text-xs text-secondary mt-1">
            {"Manage existing projects, manually add new ones, or sync directly with GitHub."}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-muted/60 p-0.5 rounded-lg border border-border/80 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "manage"
                ? "bg-card text-foreground shadow-sm"
                : "text-secondary hover:text-foreground"
            }`}
          >
            {"Manage"}
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "add"
                ? "bg-card text-foreground shadow-sm"
                : "text-secondary hover:text-foreground"
            }`}
          >
            {"Add Manual"}
          </button>
          <button
            onClick={() => setActiveTab("github")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "github"
                ? "bg-card text-foreground shadow-sm"
                : "text-secondary hover:text-foreground"
            }`}
          >
            {"GitHub Importer"}
          </button>
        </div>
      </div>

      {/* --- TAB 1: MANAGE PORTFOLIO --- */}
      {activeTab === "manage" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-secondary">
            <span>{`Active Projects count: ${projectsList.length}`}</span>
            <span>{"(Double-click Delete to verify)"}</span>
          </div>

          <div className="space-y-4">
            {projectsList.map((project) => {
              const isEditing = editingProject === project.name;
              const isSaving = savingProject === project.name;
              const isDeleting = deletingProject === project.name;

              return (
                <div
                  key={project.name}
                  className={`p-4 rounded-lg border transition-all ${
                    isEditing
                      ? "border-accent bg-muted/10 shadow-sm"
                      : "border-border/60 bg-muted/10 hover:border-border"
                  }`}
                >
                  {isEditing ? (
                    /* Editor Layout */
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                            {"Project Title"}
                          </label>
                          <input
                            type="text"
                            value={editForm.title || ""}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs rounded border border-border bg-card text-foreground focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                            {"Language (e.g. Python, Solidity)"}
                          </label>
                          <input
                            type="text"
                            value={editForm.language || ""}
                            onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs rounded border border-border bg-card text-foreground focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                          {"Description"}
                        </label>
                        <textarea
                          rows={2}
                          value={editForm.description || ""}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded border border-border bg-card text-foreground focus:outline-none focus:border-accent resize-y"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                            {"Category"}
                          </label>
                          <select
                            value={editForm.category || "web"}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value as Project["category"] })}
                            className="w-full px-3 py-1.5 text-xs rounded border border-border bg-card text-foreground focus:outline-none focus:border-accent"
                          >
                            <option value="ai">{"AI & Machine Learning"}</option>
                            <option value="blockchain">{"Blockchain & Web3"}</option>
                            <option value="fullstack">{"Full Stack"}</option>
                            <option value="web">{"Web Development"}</option>
                            <option value="java">{"Java Tutorials & OOP"}</option>
                            <option value="other">{"Other/General"}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                            {"GitHub Link URL"}
                          </label>
                          <input
                            type="text"
                            value={editForm.githubUrl || ""}
                            onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs rounded border border-border bg-card text-foreground focus:outline-none focus:border-accent"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                            {"Live Deployment URL (or 'deploying')"}
                          </label>
                          <input
                            type="text"
                            value={editForm.liveUrl || ""}
                            onChange={(e) => setEditForm({ ...editForm, liveUrl: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs rounded border border-border bg-card text-foreground focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                          {"Tags (comma-separated)"}
                        </label>
                        <input
                          type="text"
                          value={Array.isArray(editForm.tags) ? editForm.tags.join(", ") : ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                            })
                          }
                          className="w-full px-3 py-1.5 text-xs rounded border border-border bg-card text-foreground focus:outline-none focus:border-accent"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg border border-border bg-card text-secondary hover:text-foreground transition-colors cursor-pointer"
                        >
                          {"Cancel"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateProject(project.name)}
                          disabled={isSaving}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-background font-bold text-xs rounded-lg hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {isSaving ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5" />
                          )}
                          {"Save Changes"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display Layout */
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">{project.title}</span>
                          <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-card border border-border/80 text-secondary rounded">
                            {project.language}
                          </span>
                        </div>
                        <p className="text-xs text-secondary line-clamp-1 max-w-md">{project.description}</p>
                        <div className="flex items-center gap-2 text-[10px] text-secondary">
                          <span className="capitalize">{`Category: ${project.category}`}</span>
                          <span>&bull;</span>
                          {project.liveUrl === "deploying" ? (
                            <span className="text-amber-500 font-bold uppercase tracking-wider">{"Deploying"}</span>
                          ) : (
                            <span className="text-emerald-500 font-bold uppercase tracking-wider">{"Live"}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-auto">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(project)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs text-secondary hover:text-foreground hover:border-secondary transition-all cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          {"Edit"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project.name)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            isDeleting
                              ? "bg-red-500 border-red-500 text-white animate-pulse"
                              : "border-border bg-card text-red-500 hover:bg-red-500/10 hover:border-red-500/30"
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {isDeleting ? "Click Again to Confirm" : "Delete"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 2: ADD PORTFOLIO MANUALLY --- */}
      {activeTab === "add" && (
        <form onSubmit={handleAddManual} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                {"Unique Slug Name (e.g. evoting_blockchain)"}
              </label>
              <input
                type="text"
                value={manualForm.name || ""}
                onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                placeholder="lowercase_slug_with_underscores"
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                {"Project Title"}
              </label>
              <input
                type="text"
                value={manualForm.title || ""}
                onChange={(e) => setManualForm({ ...manualForm, title: e.target.value })}
                placeholder="E-Voting Platform DApp"
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-accent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
              {"Description"}
            </label>
            <textarea
              rows={3}
              value={manualForm.description || ""}
              onChange={(e) => setManualForm({ ...manualForm, description: e.target.value })}
              placeholder="Provide a detailed explanation of what this project accomplished, techs used, and core structures."
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-accent resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                {"Category"}
              </label>
              <select
                value={manualForm.category || "web"}
                onChange={(e) => setManualForm({ ...manualForm, category: e.target.value as Project["category"] })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-accent"
              >
                <option value="web">{"Web Development"}</option>
                <option value="ai">{"AI & Machine Learning"}</option>
                <option value="blockchain">{"Blockchain & Web3"}</option>
                <option value="fullstack">{"Full Stack"}</option>
                <option value="java">{"Java Tutorials & OOP"}</option>
                <option value="other">{"Other/General"}</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                {"Main Programming Language"}
              </label>
              <input
                type="text"
                value={manualForm.language || ""}
                onChange={(e) => setManualForm({ ...manualForm, language: e.target.value })}
                placeholder="Solidity"
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                {"Release Date (YYYY-MM-DD)"}
              </label>
              <input
                type="date"
                value={manualForm.updatedAt || ""}
                onChange={(e) => setManualForm({ ...manualForm, updatedAt: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                {"GitHub Link URL"}
              </label>
              <input
                type="url"
                value={manualForm.githubUrl || ""}
                onChange={(e) => setManualForm({ ...manualForm, githubUrl: e.target.value })}
                placeholder="https://github.com/samadhannnn/..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                {"Live Deployment URL (or 'deploying')"}
              </label>
              <input
                type="text"
                value={manualForm.liveUrl || ""}
                onChange={(e) => setManualForm({ ...manualForm, liveUrl: e.target.value })}
                placeholder="https://my-live-dapp.vercel.app/ or 'deploying'"
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                {"Tags (comma-separated)"}
              </label>
              <input
                type="text"
                value={manualFormTagsStr}
                onChange={(e) => setManualFormTagsStr(e.target.value)}
                placeholder="Solidity, Web3, React, DApp"
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                {"Stars (Fallback)"}
              </label>
              <input
                type="number"
                value={manualForm.stars || 0}
                onChange={(e) => setManualForm({ ...manualForm, stars: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                {"Forks (Fallback)"}
              </label>
              <input
                type="number"
                value={manualForm.forks || 0}
                onChange={(e) => setManualForm({ ...manualForm, forks: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border/50">
            <button
              type="submit"
              disabled={addingManual}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-background font-bold text-xs rounded-lg hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
            >
              {addingManual ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {"Create Project"}
            </button>
          </div>
        </form>
      )}

      {/* --- TAB 3: GITHUB IMPORTER PANEL --- */}
      {activeTab === "github" && (
        <div className="space-y-6">
          {/* GitHub Config Header */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 bg-muted/30 p-4 rounded-xl border border-border/60">
            <div className="flex-grow">
              <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                {"GitHub Username"}
              </label>
              <div className="relative">
                <Github className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-accent"
                  placeholder="samadhannnn"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={fetchGitHubRepos}
              disabled={fetchingRepos}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-background font-bold text-xs rounded-lg hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer shrink-0"
            >
              {fetchingRepos ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {"Fetch Repositories"}
            </button>
          </div>

          {/* Repo lists */}
          {fetchedRepos.length > 0 && (
            <div className="space-y-4">
              {/* Search filter for repos */}
              <div className="relative max-w-sm">
                <Search className="w-3.5 h-3.5 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter public repos..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              {/* Repos grid */}
              <div className="border border-border/60 rounded-xl overflow-hidden divide-y divide-border/50 max-h-[400px] overflow-y-auto pr-1">
                {filteredRepos.map((repo) => {
                  const isImportConfigActive = repoToImport === repo.name;
                  
                  return (
                    <div
                      key={repo.name}
                      className="p-4 bg-muted/5 hover:bg-muted/10 transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            {repo.name}
                            <span className="px-1 py-0.5 text-[8px] font-semibold bg-card border border-border text-secondary rounded">
                              {repo.language || "Other"}
                            </span>
                          </h4>
                          <p className="text-[11px] text-secondary line-clamp-1">{repo.description}</p>
                          <div className="flex items-center gap-3 text-[10px] text-secondary">
                            <span>{`Stars: ${repo.stars}`}</span>
                            <span>&bull;</span>
                            <span>{`Updated: ${repo.updatedAt}`}</span>
                          </div>
                        </div>

                        {!isImportConfigActive && (
                          <button
                            type="button"
                            onClick={() => handleOpenImportConfig(repo)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-accent text-white text-[11px] font-bold hover:bg-indigo-700 transition-colors shrink-0 cursor-pointer"
                          >
                            <FolderPlus className="w-3.5 h-3.5" />
                            {"Import"}
                          </button>
                        )}
                      </div>

                      {/* Expandable configuration menu prior to saving */}
                      {isImportConfigActive && (
                        <div className="p-4 rounded-lg bg-card border border-accent/40 space-y-3 animate-in slide-in-from-top-2 duration-200">
                          <h5 className="text-[10px] font-black uppercase text-accent tracking-wider">
                            {"Configure Import Options"}
                          </h5>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[9px] font-bold text-secondary mb-1">
                                {"Category"}
                              </label>
                              <select
                                value={importConfig.category}
                                onChange={(e) => setImportConfig({ ...importConfig, category: e.target.value as Project["category"] })}
                                className="w-full px-2 py-1 text-xs rounded border border-border bg-muted text-foreground focus:outline-none"
                              >
                                <option value="web">{"Web Development"}</option>
                                <option value="ai">{"AI & Machine Learning"}</option>
                                <option value="blockchain">{"Blockchain & Web3"}</option>
                                <option value="fullstack">{"Full Stack"}</option>
                                <option value="java">{"Java Tutorials & OOP"}</option>
                                <option value="other">{"Other/General"}</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-secondary mb-1">
                                {"Tags (comma-separated)"}
                              </label>
                              <input
                                type="text"
                                value={importConfig.tags}
                                onChange={(e) => setImportConfig({ ...importConfig, tags: e.target.value })}
                                className="w-full px-2 py-1 text-xs rounded border border-border bg-muted text-foreground focus:outline-none"
                                placeholder="Solidity, Web3"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-secondary mb-1">
                                {"Live URL (or 'deploying')"}
                              </label>
                              <input
                                type="text"
                                value={importConfig.liveUrl}
                                onChange={(e) => setImportConfig({ ...importConfig, liveUrl: e.target.value })}
                                className="w-full px-2 py-1 text-xs rounded border border-border bg-muted text-foreground focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                            <button
                              type="button"
                              onClick={() => setRepoToImport(null)}
                              className="px-2.5 py-1 text-xs rounded border border-border bg-card text-secondary hover:text-foreground cursor-pointer"
                            >
                              {"Cancel"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleExecuteImport(repo)}
                              disabled={importingRepo}
                              className="flex items-center gap-1 px-3 py-1 bg-accent text-white font-bold text-xs rounded hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                            >
                              {importingRepo ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              {"Confirm & Add to Web"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredRepos.length === 0 && (
                  <div className="p-8 text-center text-secondary text-xs">
                    {"No repositories found matching current filter."}
                  </div>
                )}
              </div>
            </div>
          )}

          {fetchedRepos.length === 0 && !fetchingRepos && (
            <div className="py-12 text-center text-secondary border border-dashed border-border rounded-xl bg-muted/5">
              <Layers className="w-8 h-8 mx-auto mb-2 text-secondary opacity-60 animate-pulse" />
              <p className="text-xs font-semibold">{"No repositories loaded yet."}</p>
              <p className="text-[10px] text-secondary mt-1 max-w-xs mx-auto">
                {"Enter your GitHub username above and fetch to import your coding projects directly."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Persistent global notification popup */}
      {feedback && (
        <div className="flex items-center gap-2 p-3 rounded-lg border bg-card text-xs fixed bottom-6 right-6 shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          <span
            className={
              feedback.type === "success"
                ? "text-emerald-500 font-semibold"
                : "text-red-500 font-semibold"
            }
          >
            {feedback.text}
          </span>
        </div>
      )}
    </div>
  );
}
