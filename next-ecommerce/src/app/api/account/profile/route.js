/**
 * Account Profile - PUT update avatar
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateUserAvatar } from "@/lib/services/userService";

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { avatar } = body;

    const user = await updateUserAvatar(session.user.id, avatar ?? null);
    if (!user) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({
      avatar: user.avatar,
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
