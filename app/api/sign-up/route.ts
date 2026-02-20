import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmails';
import mongoose from "mongoose";

console.log("Connected to DB:", mongoose.connection.name);

export async function POST(request: Request) {
  await dbConnect();

  try {
   const { username, email, password } = await request.json();

const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

const existingUserByUsername = await UserModel.findOne({ username });

if (existingUserByUsername) {
  if (existingUserByUsername.isVerified) {
    return Response.json(
      { success: false, message: "Username is already taken" },
      { status: 400 }
    );
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    existingUserByUsername.password = hashedPassword;
    existingUserByUsername.verifyCode = verifyCode;
    existingUserByUsername.verifyCodeExpiry = new Date(Date.now() + 3600000);
    await existingUserByUsername.save();
  }
} else {
  const hashedPassword = await bcrypt.hash(password, 10);
  const expiryDate = new Date(Date.now() + 3600000);

  const newUser = new UserModel({
    username,
    email,
    password: hashedPassword,
    verifyCode,
    verifyCodeExpiry: expiryDate,
    isVerified: false,
    isAcceptingMessages: true,
    messages: [],
  });

  await newUser.save();
}


    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("🔥 FULL ERROR OBJECT:", error);
  console.error("🔥 ERROR MESSAGE:", error.message);
  console.error("🔥 ERROR STACK:", error.stack);

    return Response.json(
      {
        success: false,
        message: 'Error registering user',
      },
      { status: 500 }
    );
  }
}