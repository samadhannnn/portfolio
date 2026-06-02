import { NextRequest, NextResponse } from "next/server";
import { getRAGResponse } from "@/services/rag";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query string is required" }, { status: 400 });
    }

    // Call RAG pipeline to fetch OpenAI/local answer
    const answer = await getRAGResponse(query);

    // Async record chat query inside database
    try {
      await db.recordChatQuery(query, answer);
    } catch (dbErr) {
      console.error("Database log chat error:", dbErr);
    }

    return NextResponse.json({ answer });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("API Chat route error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
