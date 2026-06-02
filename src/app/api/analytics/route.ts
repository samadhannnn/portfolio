import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { event, metadata } = await req.json();

    if (!event) {
      return NextResponse.json({ error: "Event name is required" }, { status: 400 });
    }

    if (event === "visit") {
      const sessionId = metadata?.sessionId || "unknown";
      const isNew = !!metadata?.isNew;
      await db.recordVisit(sessionId, isNew);
      return NextResponse.json({ success: true, tracked: "visit" });
    }

    if (event === "resume_download") {
      const totalDownloads = await db.recordResumeDownload();
      return NextResponse.json({ success: true, tracked: "resume_download", totalDownloads });
    }

    if (event === "project_click") {
      const projectName = metadata?.project || "unknown";
      const totalClicks = await db.recordProjectClick(projectName);
      return NextResponse.json({ success: true, tracked: "project_click", project: projectName, totalClicks });
    }

    return NextResponse.json({ error: "Unsupported event type" }, { status: 400 });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("API Analytics error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
