import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await dbConnect();

    // ✅ Read your custom cookie
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if (!userCookie) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsedUser = JSON.parse(userCookie.value);

    const user = await UserModel.findOne({ email: parsedUser.email }).lean();

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const messages = user.messages || [];

    const stats = {
      total: messages.length,
      essay: messages.filter((m: any) => m.type === "essay").length,
      resume: messages.filter((m: any) => m.type === "resume").length,
      code: messages.filter((m: any) => m.type === "code").length,
      general: messages.filter((m: any) => m.type === "general").length,
    };

    return Response.json({
      profile: {
        username: user.username,
        email: user.email,
        memberSince: user.createdAt,
      },
      stats,
      history: [...messages].reverse(),
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return Response.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
