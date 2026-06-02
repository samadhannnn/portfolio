import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { PROJECTS_DATA, type Project } from "@/data/projects";

// Check for Supabase environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const isSupabaseConfigured = supabaseUrl !== "" && supabaseAnonKey !== "";

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local JSON DB file configuration
const DB_DIR = path.join(process.cwd(), "src", "data");
const DB_FILE = path.join(DB_DIR, "db.json");

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

interface ChatQueryLog {
  id: string;
  query: string;
  answer: string;
  timestamp: string;
}

interface DbSchema {
  visitors: { sessionId: string; timestamp: string; isNew: boolean }[];
  resume_downloads: number;
  chatbot_queries: ChatQueryLog[];
  project_clicks: { [projectName: string]: number };
  messages: ContactMessage[];
  project_overrides?: { [projectName: string]: string };
  projects?: Project[];
}

const defaultDb: DbSchema = {
  visitors: [],
  resume_downloads: 0,
  chatbot_queries: [],
  project_clicks: {},
  messages: [],
  project_overrides: {},
  projects: [],
};

// Helper to initialize local DB if not exists
function initLocalDb(): DbSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const seedDb = { ...defaultDb, projects: PROJECTS_DATA };
    fs.writeFileSync(DB_FILE, JSON.stringify(seedDb, null, 2), "utf8");
    return seedDb;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(data) as DbSchema;
    
    // Seed projects array if missing or empty
    if (!parsed.projects || parsed.projects.length === 0) {
      parsed.projects = PROJECTS_DATA;
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf8");
    }
    
    return parsed;
  } catch (err) {
    console.error("Error reading db.json, resetting:", err);
    const resetDb = { ...defaultDb, projects: PROJECTS_DATA };
    fs.writeFileSync(DB_FILE, JSON.stringify(resetDb, null, 2), "utf8");
    return resetDb;
  }
}

// Helper to write to local DB
function writeLocalDb(data: DbSchema) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing to db.json:", err);
  }
}

// Database Actions Wrapper
export const db = {
  async addMessage(name: string, email: string, message: string): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    };

    if (supabase) {
      const { data, error } = await supabase
        .from("messages")
        .insert([newMessage])
        .select()
        .single();
      if (!error && data) return data as ContactMessage;
      console.warn("Supabase insert error, falling back to local DB:", error);
    }

    const localDb = initLocalDb();
    localDb.messages.push(newMessage);
    writeLocalDb(localDb);
    return newMessage;
  },

  async getMessages(): Promise<ContactMessage[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("timestamp", { ascending: false });
      if (!error && data) return data as ContactMessage[];
      console.warn("Supabase query error, falling back to local DB:", error);
    }

    const localDb = initLocalDb();
    return [...localDb.messages].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  async recordVisit(sessionId: string, isNew: boolean): Promise<void> {
    const timestamp = new Date().toISOString();

    if (supabase) {
      const { error } = await supabase
        .from("visitors")
        .insert([{ session_id: sessionId, is_new: isNew, timestamp }]);
      if (!error) return;
      console.warn("Supabase insert error, falling back to local DB:", error);
    }

    const localDb = initLocalDb();
    localDb.visitors.push({ sessionId, timestamp, isNew });
    writeLocalDb(localDb);
  },

  async recordResumeDownload(): Promise<number> {
    if (supabase) {
      // Assuming a single row increments or key-value table
      const { data, error } = await supabase.rpc("increment_resume_downloads");
      if (!error && data !== null) return data as number;
      console.warn("Supabase RPC error, falling back to local DB:", error);
    }

    const localDb = initLocalDb();
    localDb.resume_downloads = (localDb.resume_downloads || 0) + 1;
    writeLocalDb(localDb);
    return localDb.resume_downloads;
  },

  async recordChatQuery(query: string, answer: string): Promise<void> {
    const log: ChatQueryLog = {
      id: Math.random().toString(36).substr(2, 9),
      query,
      answer,
      timestamp: new Date().toISOString(),
    };

    if (supabase) {
      const { error } = await supabase.from("chat_queries").insert([log]);
      if (!error) return;
      console.warn("Supabase insert error, falling back to local DB:", error);
    }

    const localDb = initLocalDb();
    localDb.chatbot_queries.push(log);
    writeLocalDb(localDb);
  },

  async recordProjectClick(projectName: string): Promise<number> {
    if (supabase) {
      const { data, error } = await supabase.rpc("increment_project_clicks", {
        proj_name: projectName,
      });
      if (!error && data !== null) return data as number;
      console.warn("Supabase RPC error, falling back to local DB:", error);
    }

    const localDb = initLocalDb();
    localDb.project_clicks[projectName] = (localDb.project_clicks[projectName] || 0) + 1;
    writeLocalDb(localDb);
    return localDb.project_clicks[projectName];
  },

  async getProjectOverrides(): Promise<{ [projectName: string]: string }> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("project_overrides")
          .select("*");
        if (!error && data) {
          const overrides: { [key: string]: string } = {};
          (data as { name: string; live_url: string }[]).forEach((item) => {
            overrides[item.name] = item.live_url;
          });
          return overrides;
        }
        console.warn("Supabase query error, falling back to local DB:", error);
      } catch (err) {
        console.warn("Supabase error for project overrides:", err);
      }
    }

    const localDb = initLocalDb();
    return localDb.project_overrides || {};
  },

  async updateProjectLiveUrl(projectName: string, liveUrl: string): Promise<void> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("project_overrides")
          .upsert({ name: projectName, live_url: liveUrl }, { onConflict: "name" });
        if (!error) return;
        console.warn("Supabase upsert error, falling back to local DB:", error);
      } catch (err) {
        console.warn("Supabase error updating project live url:", err);
      }
    }

    const localDb = initLocalDb();
    if (!localDb.project_overrides) {
      localDb.project_overrides = {};
    }
    localDb.project_overrides[projectName] = liveUrl;
    writeLocalDb(localDb);

    // Also update in standard projects list if it exists
    await this.updateProject(projectName, { liveUrl });
  },

  async getProjects(): Promise<Project[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*");
        if (!error && data) {
          return data as Project[];
        }
        console.warn("Supabase query error, falling back to local DB:", error);
      } catch (err) {
        console.warn("Supabase error fetching projects:", err);
      }
    }

    const localDb = initLocalDb();
    return localDb.projects || PROJECTS_DATA;
  },

  async saveProjects(projects: Project[]): Promise<void> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("projects")
          .upsert(projects);
        if (!error) return;
        console.warn("Supabase upsert projects error, falling back to local DB:", error);
      } catch (err) {
        console.warn("Supabase error saving projects:", err);
      }
    }

    const localDb = initLocalDb();
    localDb.projects = projects;
    writeLocalDb(localDb);
  },

  async addProject(project: Project): Promise<void> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("projects")
          .insert([project]);
        if (!error) return;
        console.warn("Supabase insert project error, falling back to local DB:", error);
      } catch (err) {
        console.warn("Supabase error adding project:", err);
      }
    }

    const localDb = initLocalDb();
    if (!localDb.projects) localDb.projects = [];
    localDb.projects = localDb.projects.filter((p) => p.name !== project.name);
    localDb.projects.push(project);
    writeLocalDb(localDb);
  },

  async deleteProject(projectName: string): Promise<void> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("projects")
          .delete()
          .eq("name", projectName);
        if (!error) return;
        console.warn("Supabase delete project error, falling back to local DB:", error);
      } catch (err) {
        console.warn("Supabase error deleting project:", err);
      }
    }

    const localDb = initLocalDb();
    if (!localDb.projects) localDb.projects = [];
    localDb.projects = localDb.projects.filter((p) => p.name !== projectName);
    writeLocalDb(localDb);
  },

  async updateProject(projectName: string, updated: Partial<Project>): Promise<void> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("projects")
          .update(updated)
          .eq("name", projectName);
        if (!error) return;
        console.warn("Supabase update project error, falling back to local DB:", error);
      } catch (err) {
        console.warn("Supabase error updating project:", err);
      }
    }

    const localDb = initLocalDb();
    if (!localDb.projects) localDb.projects = [];
    localDb.projects = localDb.projects.map((p) => {
      if (p.name === projectName) {
        return { ...p, ...updated };
      }
      return p;
    });
    writeLocalDb(localDb);
  },

  async getAnalytics() {
    if (supabase) {
      // In production, we'd fetch counts from Supabase tables
      try {
        const { count: totalVisits } = await supabase
          .from("visitors")
          .select("*", { count: "exact", head: true });
        const { count: uniqueVisits } = await supabase
          .from("visitors")
          .select("*", { count: "exact", head: true })
          .eq("is_new", true);
        const { data: resumeData } = await supabase
          .from("analytics")
          .select("resume_downloads")
          .single();
        const { count: chatQueries } = await supabase
          .from("chat_queries")
          .select("*", { count: "exact", head: true });
        const { data: projectClicks } = await supabase
          .from("project_clicks")
          .select("*");

        const clicksMap: { [key: string]: number } = {};
        interface ProjectClickRow {
          name: string;
          count: number;
        }
        (projectClicks as unknown as ProjectClickRow[])?.forEach((item) => {
          clicksMap[item.name] = item.count;
        });

        return {
          totalVisitors: totalVisits || 0,
          uniqueVisitors: uniqueVisits || 0,
          resumeDownloads: resumeData?.resume_downloads || 0,
          chatbotUsage: chatQueries || 0,
          projectClicks: clicksMap,
        };
      } catch (err) {
        console.warn("Error getting Supabase analytics, fallback to local DB:", err);
      }
    }

    const localDb = initLocalDb();
    const unique = localDb.visitors.filter((v) => v.isNew).length;
    const total = localDb.visitors.length;
    return {
      totalVisitors: total,
      uniqueVisitors: unique,
      resumeDownloads: localDb.resume_downloads,
      chatbotUsage: localDb.chatbot_queries.length,
      projectClicks: localDb.project_clicks,
    };
  },
};
