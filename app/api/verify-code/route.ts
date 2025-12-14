import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const code = searchParams.get("code");

    if (!username || !code) {
      return Response.json(
        { success: false, message: "Missing username or verification code" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (!isCodeValid) {
      return Response.json(
        { success: false, message: "Wrong verification code" },
        { status: 400 }
      );
    }

    if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired, request a new one",
        },
        { status: 400 }
      );
    }

    user.isVerified = true;
    await user.save();

    return Response.json(
      { success: true, message: "Account successfully verified 🎉" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Verification Error Backend:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
