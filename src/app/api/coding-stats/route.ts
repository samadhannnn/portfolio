import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

const DEFAULT_STATS = {
  leetcode: {
    solved: 58,
    easy: 29,
    medium: 17,
    hard: 12,
  },
  hackerrank: [
    { name: "Java", stars: 5, solved: 24 },
    { name: "Python", stars: 5, solved: 7 },
    { name: "C", stars: 4, solved: 14 },
  ],
};

export async function GET() {
  try {
    let leetcode: LeetcodeStats = { ...DEFAULT_STATS.leetcode };
    let hackerrank: HackerRankBadge[] = [ ...DEFAULT_STATS.hackerrank ];

    // 1. Fetch LeetCode stats from Render API
    try {
      const lcRes = await fetch("https://alfa-leetcode-api.onrender.com/Samadhannnnn/solved", {
        next: { revalidate: 3600 }, // cache for 1 hour
      });
      if (lcRes.ok) {
        const lcData = await lcRes.json();
        leetcode = {
          solved: lcData.solvedProblem || DEFAULT_STATS.leetcode.solved,
          easy: lcData.easySolved || DEFAULT_STATS.leetcode.easy,
          medium: lcData.mediumSolved || DEFAULT_STATS.leetcode.medium,
          hard: lcData.hardSolved || DEFAULT_STATS.leetcode.hard,
        };
      }
    } catch (e) {
      console.warn("Could not fetch LeetCode stats, using fallback:", e);
    }

    // 2. Fetch HackerRank stats by scraping page unquoted viewProfiles
    try {
      const hrRes = await fetch("https://www.hackerrank.com/profile/samadhan_bodkhe", {
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
        next: { revalidate: 3600 },
      });
      if (hrRes.ok) {
        const html = await hrRes.text();
        const unquoted = decodeURIComponent(html.replace(/%(?![0-9a-fA-F]{2})/g, "%25"));
        const startIdx = unquoted.indexOf('"viewProfiles"');
        if (startIdx !== -1) {
          const context = unquoted.substring(startIdx, startIdx + 5000);
          const match = context.match(/"badges":\s*\[(.*?)\]/);
          if (match) {
            const badgesRaw = JSON.parse("[" + match[1] + "]");
            interface HackerRankRawBadge {
              badge_name?: string;
              stars?: number;
              solved?: number;
            }
            const parsedBadges = (badgesRaw as HackerRankRawBadge[]).map((b) => ({
              name: b.badge_name || "",
              stars: b.stars || 0,
              solved: b.solved || 0,
            })).filter((b) => b.name !== "");
            
            if (parsedBadges.length > 0) {
              hackerrank = parsedBadges;
            }
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch HackerRank stats, using fallback:", e);
    }

    return NextResponse.json({ leetcode, hackerrank });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("API Coding stats error:", error);
    return NextResponse.json(DEFAULT_STATS);
  }
}
