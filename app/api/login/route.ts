import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }

    // ✅ Set simple cookie
    cookies().set("user", user._id.toString(), {
      httpOnly: true,
      path: "/",
    });

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
