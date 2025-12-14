import { getServerSession, getServiceSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {User} from "next-auth";

export async function POST(request: Request) {
     await dbConnect();   

     const session = await getServerSession(authOptions)

     const user=session?.user

     if(!session  || !session.user){
        return Response.json(
            {
               success:false, 
               message:"Not Authenticated User"
            },
            {status:401}
        )
     }
     const userID=user._id 
     const {acceptMessages}=await request.json()
     try{
        const updatedUser=await UserModel.findByIdAndUpdate(
            userID,
            {
                isAcceptingMessages:acceptMessages
            },
            {new:true}
        )
        if(!updatedUser){
             return Response.json(
            {
               success:false, 
               message:"Failed to update message preference"
            },
            {status:401}
        )   
        }
           return Response.json(
            {
               success:true, 
               message:"Message preference updated successfully",
               updatedUser
            },
            {status:401}
        )   

     }catch(error){
        console.log("Failed to update message preference:",error)
        return Response.json(
            {
               success:false, 
               message:"Failed to update message preference"
            },
            {status:500}
        )   
     }
}
export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    const user = session?.user;

    // 🔐 Check authentication
    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Not Authenticated User" },
        { status: 401 }
      );
    }

    const userID = user._id;

    // 🔍 Find user in database
    const foundUser = await UserModel.findById(userID);
    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✔ Success Response
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
        user: foundUser,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET user preference error:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
