import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Session verification
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session")?.value === "true";
    
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username") || "samadhannnn";

    // 2. Fetch from GitHub API
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers: {
        "User-Agent": "Portfolio-Admin-Dashboard",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub API returned ${res.status}: ${res.statusText}` },
        { status: res.status }
      );
    }

    const repos = await res.json();
    
    // 3. Map to clean structures for import config
    interface GitHubRepoJson {
      name: string;
      description: string | null;
      language: string | null;
      html_url: string;
      stargazers_count: number;
      forks_count: number;
      updated_at: string;
    }

    const formattedRepos = repos.map((repo: GitHubRepoJson) => ({
      name: repo.name,
      description: repo.description || "",
      language: repo.language || "JavaScript",
      githubUrl: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: repo.updated_at.split("T")[0],
    }));

    return NextResponse.json(formattedRepos);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Fetch GitHub repos error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch repositories" }, { status: 500 });
  }
}
