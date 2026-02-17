import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("gs_session")?.value;
  const session = verifySession(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = await getDb();
  const adminUser = await db.collection("users").findOne({
    _id: new ObjectId(session.sub),
  });

  if (!adminUser?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { isAdmin } = body;

  if (typeof isAdmin !== "boolean") {
    return NextResponse.json(
      { error: "isAdmin must be a boolean" },
      { status: 400 }
    );
  }

  const result = await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { isAdmin } }
    );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
