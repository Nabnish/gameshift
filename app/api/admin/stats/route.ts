import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("gs_session")?.value;
  const session = verifySession(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const user = await db.collection("users").findOne({
    _id: new ObjectId(session.sub),
  });

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const usersCount = await db.collection("users").countDocuments();
  const teamsCount = await db.collection("teams").countDocuments();
  const gamesCount = 2; // Battleship and Wordle

  return NextResponse.json({
    users: usersCount,
    teams: teamsCount,
    games: gamesCount,
  });
}
