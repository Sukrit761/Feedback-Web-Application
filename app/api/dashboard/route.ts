import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getToken } from "next-auth/jwt";

export async function GET(req: Request) {
  try {
    // 1️⃣ Connect DB
    await dbConnect();

    // 2️⃣ Auth
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3️⃣ Fetch user
    const user = await UserModel.findOne({ email: token.email }).lean();

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const messages = user.messages || [];

    // 4️⃣ Stats (RELIABLE)
  
const stats = {
  total: messages.length,

  essay: messages.filter(
    (m: any) => m.type === "essay"
  ).length,

  resume: messages.filter(
    (m: any) => m.type === "resume"
  ).length,

  code: messages.filter(
    (m: any) => m.type === "code"
  ).length,

  general: messages.filter(
    (m: any) => m.type === "general"
  ).length,
};
    // 5️⃣ Response
    return Response.json({
      profile: {
        username: user.username,
        email: user.email,
        memberSince: user.createdAt,
      },
      stats,
      history: [...messages].reverse(), // newest first
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return Response.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
