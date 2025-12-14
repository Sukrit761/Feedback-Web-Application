import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        await dbConnect();
        console.log("📩 Login Attempt →", credentials);

        const { identifier, password } = credentials ?? {};
        if (!identifier || !password) throw new Error("Missing fields");

        const user = await UserModel.findOne({
          $or: [{ email: identifier }, { username: identifier }]
        });

        if (!user) throw new Error("User does not exist");
        if (!user.isVerified) throw new Error("Verify your email first");

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error("Invalid password");

        console.log("✅ Login Successful:", user.username);

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          isVerified: user.isVerified,
          isAcceptingMessages: user.isAcceptingMessages
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) Object.assign(token, user);
      return token;
    },

    async session({ session, token }) {
      session.user = token as any; // <- now safe
      return session;
    },

    async redirect() {
      return "/";  // <-- 🔥 redirect after login
    }
  },

  pages: {
    signIn: "/sign-in"
  },

  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
