import { getServerSession} from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {User} from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
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
     const userID=new mongoose.Types.ObjectId(user._id);
        try{
            const user=await UserModel.aggregate([
                { $match:{_id:userID}},
                { $unwind: "$messages" },
                { $sort: { "messages.createdAt": -1}},
                { $group:{_id:"$_id",messages:{$push:"$messages"}}},

            ])
            if(!user || user.length===0){
                 return Response.json(
            {
               success:false, 
               message:"Failed to fetch messages"
            },
            {status:401}
        )   
            }

              return Response.json(
                {
                   success:true, 
                   message:"Messages fetched successfully",
                   messages:user[0].messages
                },
                {status:200}
            )
        } catch(error){
              console.log("Failed to send message:",error)
           return Response.json(
            {
               success:false, 
               message:"Failed to send message"
            },
            {status:401}
        )
        }   
}