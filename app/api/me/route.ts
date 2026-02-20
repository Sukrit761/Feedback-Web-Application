import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if (!userCookie) {
      return Response.json({ user: null });
    }

    const parsed = JSON.parse(userCookie.value);

    await dbConnect();
    const user = await UserModel.findById(parsed.id).select("-password");

    if (!user) {
      return Response.json({ user: null });
    }

    return Response.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    return Response.json({ user: null });
  }
}
