import { create } from 'domain';
import mongoose,{Schema,Document} from 'mongoose';

export interface Message extends Document{
    content:string;
    createdAt:Date
}

const MessageSchema:Schema<Message> = new Schema({
    content:{type:String,required:true},
    createdAt:{type:Date,required:true,default:Date.now}
});

export interface User extends Document{
    username:string;
    email:string;
    messages:Message[];
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
}
const UserSchema:Schema<User> = new Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,match: [/^\S+@\S+\.\S+$/, 'please use a valid email address'],
},
    messages:[MessageSchema],
    password:{type:String,required:true},
    verifyCode:{type:String,required:true},
    verifyCodeExpiry:{type:Date,required:true},
    isAcceptingMessage:{type:Boolean,required:true,default:true},
    isVerified:{type:Boolean,required:true,default:false}
});

const UserModel=(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User',UserSchema);

export default UserModel;