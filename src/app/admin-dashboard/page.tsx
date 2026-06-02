import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { logoutAdmin } from "./actions";
import { Eye, Download, MessageSquare, ArrowLeft, LogOut, ShieldAlert, MousePointerClick, Calendar } from "lucide-react";
import Link from "next/link";
import ProjectManager from "@/components/ProjectManager";

// Force dynamic rendering to bypass build-time caching of database records
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // 1. Session verification on server
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "true";
  
  if (!isAdmin) {
    redirect("/admin-dashboard/login");
  }

  // 2. Fetch statistics, messages, and projects list
  const analytics = await db.getAnalytics();
  const messages = await db.getMessages();
  const projects = await db.getProjects();

  // Handle logout server action invocation
  async function handleLogout() {
    "use server";
    await logoutAdmin();
    redirect("/admin-dashboard/login");
  }

  const statCards = [
    { label: "Total Views", value: analytics.totalVisitors, icon: Eye, color: "text-blue-500 bg-blue-500/10" },
    { label: "Unique Visitors", value: analytics.uniqueVisitors, icon: Eye, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Resume Downloads", value: analytics.resumeDownloads, icon: Download, color: "text-amber-500 bg-amber-500/10" },
    { label: "Chatbot Queries", value: analytics.chatbotUsage, icon: MessageSquare, color: "text-indigo-500 bg-indigo-500/10" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Dashboard Top Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10 py-4 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 border border-border bg-card hover:bg-muted text-foreground rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold font-heading flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-accent" /> Administration Node
              </h1>
              <p className="text-[10px] text-secondary font-medium uppercase tracking-wider">Metrics & Inbox</p>
            </div>
          </div>

          <form action={handleLogout}>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 border border-border bg-card text-secondary hover:text-red-500 hover:border-red-500/30 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Logout <LogOut className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </header>

      {/* Main content grid */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex-grow w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Stats Grid & Clicks Table */}
        <div className="lg:col-span-7 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">{card.label}</span>
                    <span className="text-3xl font-black text-foreground">{card.value}</span>
                  </div>
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Project Clicks Tracking */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <h2 className="text-md font-bold font-heading text-foreground mb-4 flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-accent" /> Project Clicks Tracking
            </h2>
            
            {Object.keys(analytics.projectClicks).length === 0 ? (
              <p className="text-sm text-secondary py-4 text-center">No clicks recorded yet.</p>
            ) : (
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted text-secondary uppercase text-[10px] font-bold tracking-wider border-b border-border">
                    <tr>
                      <th className="px-4 py-3">Project Identifier</th>
                      <th className="px-4 py-3 text-right">Click Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {Object.entries(analytics.projectClicks)
                      .sort((a, b) => b[1] - a[1])
                      .map(([proj, count]) => (
                        <tr key={proj} className="hover:bg-muted/30">
                          <td className="px-4 py-3.5 font-semibold text-foreground">{proj}</td>
                          <td className="px-4 py-3.5 text-right font-bold text-accent">{count}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Project Deployment & Link Manager */}
          <ProjectManager projects={projects} />
        </div>

        {/* Right Side: Contact Form Submissions Inbox */}
        <div className="lg:col-span-5 p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col h-[calc(100vh-140px)] overflow-hidden">
          <h2 className="text-md font-bold font-heading text-foreground mb-4 flex items-center gap-2 border-b border-border pb-3 shrink-0">
            <MessageSquare className="w-4 h-4 text-accent" /> Messages Inbox ({messages.length})
          </h2>

          <div className="flex-grow overflow-y-auto space-y-4 pr-1">
            {messages.length === 0 ? (
              <div className="text-center py-16 text-secondary text-sm">
                No contact submissions received yet.
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="p-4 rounded-lg bg-muted/40 border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm">{msg.name}</span>
                    <span className="text-[10px] text-secondary font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(msg.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="text-xs">
                    <a href={`mailto:${msg.email}`} className="text-accent hover:underline font-medium">
                      {msg.email}
                    </a>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed bg-card p-3 rounded-lg border border-border/40 whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
