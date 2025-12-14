import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { z } from "zod";
import { usernameValidation } from '@/schemas/signUpSchema';

const UsernameSchema = z.object({
  username: usernameValidation
});

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  const result = UsernameSchema.safeParse({ username });

  if (!result.success) {
    return Response.json(
      { success: false, message: "Invalid username format" },
      { status: 400 }
    );
  }

  const existingUser = await UserModel.findOne({ username });

  if (existingUser) {
    return Response.json(
      { success: false, message: "Username is already taken" },
      { status: 400 }
    );
  }

  return Response.json({ success: true, message: "Username is available" });
}
