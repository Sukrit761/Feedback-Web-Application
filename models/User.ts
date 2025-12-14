import mongoose, { Schema, Document } from "mongoose";

/* ================= MESSAGE ================= */
export interface Message extends Document {
  content: string;
  type: "resume" | "essay" | "code" | "general";
  aiResponse?: any;
  createdAt: Date;
}

const MessageSchema = new Schema<Message>({
  content: {
    type: String,
    required: true,
  },

  type: {
  type: String,
  enum: ["resume", "essay", "code", "general"], // ✅ add essay
  default: "general",
  required: true,
},

  aiResponse: {
    type: Object,
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/* ================= USER ================= */

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  messages: Message[];
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
}

const UserSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    messages: {
      type: [MessageSchema],
      default: [],
    },

    password: {
      type: String,
      required: true,
    },

    verifyCode: {
      type: String,
      required: true,
    },

    verifyCodeExpiry: {
      type: Date,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
