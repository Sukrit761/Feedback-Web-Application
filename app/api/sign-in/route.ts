import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { identifier, password } = await req.json();

    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 400 });
    }

    if (!user.isVerified) {
      return Response.json({ message: "Verify email first" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({ message: "Invalid password" }, { status: 400 });
    }

    // ✅ FIXED COOKIE
    const cookieStore = await cookies();

    cookieStore.set(
      "user",
      JSON.stringify({
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      }),
      {
        httpOnly: true,
        path: "/",
      }
    );

    return Response.json({ message: "Login successful" });

  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ message: "Login failed" }, { status: 500 });
  }
}
