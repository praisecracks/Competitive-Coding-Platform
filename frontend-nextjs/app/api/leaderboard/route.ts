import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/leaderboard";

export async function GET(request: NextRequest) {
  try {
    const leaderboard = await getLeaderboard();
    return NextResponse.json({ entries: leaderboard, total: leaderboard.length });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json(
      { error: "Unable to load leaderboard" },
      { status: 500 }
    );
  }
}
