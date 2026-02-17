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

  const teams = await db
    .collection("teams")
    .find({})
    .toArray();

  const usersCollection = db.collection("users");

  const teamsWithDetails = await Promise.all(
    teams.map(async (team) => {
      // Fetch member usernames from user IDs
      const memberIds = team.memberIds || [];
      const memberUsers = await usersCollection
        .find({ _id: { $in: memberIds } })
        .project({ _id: 1, username: 1 })
        .toArray();

      const members = memberUsers.map((u) => ({
        userId: u._id.toString(),
        username: u.username,
      }));

      // Get leader name
      const leader = await usersCollection.findOne(
        { _id: new ObjectId(team.leaderId) },
        { projection: { username: 1 } }
      );

      return {
        _id: team._id.toString(),
        name: team.name,
        leaderId: team.leaderId.toString(),
        leaderName: leader?.username || "Unknown",
        members,
        createdAt: team.createdAt || new Date(),
        inviteCode: team.inviteCode,
      };
    })
  );

  return NextResponse.json(teamsWithDetails);
}
