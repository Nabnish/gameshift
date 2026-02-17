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

  // Return available games
  const games = [
    {
      id: "battleship",
      name: "Battleship",
      description: "Classic naval combat strategy game",
      isActive: true,
      path: "/battleship",
      usersPlaying: 0,
    },
    {
      id: "wordle",
      name: "Wordle",
      description: "Guess the word in 6 attempts",
      isActive: true,
      path: "/wordle",
      usersPlaying: 0,
    },
  ];

  return NextResponse.json(games);
}
