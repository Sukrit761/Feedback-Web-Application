import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request: Request) {
    await dbConnect();

    const {Username,content}=await request.json()

    try{

        const user=await UserModel.findOne({username:Username})
        if(!user){
            return Response.json(
                {
                   success:false, 
                   message:"User not found"
                },
                {status:401}
            )
        }
        if(!user.isAcceptingMessages){
            return Response.json(
                {
                   success:false, 
                   message:"User is not accepting messages"
                },
                {status:401}
            )
        }
        const newMessage={content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json(
            {
               success:true, 
               message:"Message sent successfully",
               messages:user.messages
            },
            {status:200}
        )
    }catch(error){
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
