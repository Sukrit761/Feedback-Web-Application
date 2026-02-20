"use client";

import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { signUpSchema } from "@/schemas/signUpSchema";
import { motion } from "framer-motion";

export default function SignUpForm() {
  // ------------------ STATE ------------------
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // debounced username state (hook manages value itself)
  const [debouncedUsername, setDebouncedUsername] = useDebounceValue("", 400);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  // ------------------ CHECK USERNAME LIVE ------------------
  useEffect(() => {
    console.log("Validation Errors:", form.formState.errors);
  }, [form.formState.errors]);

  useEffect(() => {
    const checkUsername = async () => {
      if (!debouncedUsername) return;

      setIsCheckingUsername(true);

      try {
        await axios.get<ApiResponse<null>>(
          `/api/checkUserName?username=${debouncedUsername}`
        );
        setUsernameMessage("Username is available ✔");
        toast.success("Username is available");
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const msg =
          axiosError.response?.data.message ?? "Error checking username";
        setUsernameMessage(msg);
        toast.error(msg);
      }

      setIsCheckingUsername(false);
    };

    checkUsername();
  }, [debouncedUsername]);

  // ------------------ SUBMIT FORM ------------------
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse<null>>(
        `/api/sign-up`,
        data
      );
       console.log("API Success:", response.data);
      toast.success(response.data.message);
      router.replace(`/verify/${data.username}`);

    } catch (error) {
      console.error("Signup error:", error)
      const axiosError = error as AxiosError<ApiResponse<null>>;
      toast.error(axiosError.response?.data.message ?? "Sign-up failed");
    }
    
    setIsSubmitting(false);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* 🔥 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/bg-3129576.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* -------- FORM CONTAINER -------- */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 flex items-center justify-center min-h-screen px-4"
      >
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/30 p-8 rounded-3xl shadow-2xl">
          {/* HEADER */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white">Create Account ✨</h1>
            <p className="text-gray-300 text-sm">
              Join True Feedback — Real Voices. Fully Anonymous.
            </p>
          </div>

          {/* FORM */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
              {/* USERNAME */}
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Username</FormLabel>
                    <Input
                      {...field}
                      placeholder="john_doe"
                      className="bg-white/10 text-white border-white/40 placeholder-gray-300"
                      onChange={(e) => {
                        field.onChange(e);
                        setDebouncedUsername(e.target.value); // update debounced value
                      }}
                    />

                    {isCheckingUsername && (
                      <Loader2 className="size-4 animate-spin text-gray-200" />
                    )}
                    {usernameMessage && (
                      <p
                        className={`text-sm mt-1 ${
                          usernameMessage.includes("available")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Email</FormLabel>
                    <Input
                      {...field}
                      placeholder="you@email.com"
                      className="bg-white/10 text-white border-white/40 placeholder-gray-300"
                    />
                    <p className="text-xs text-gray-300">
                      We will send a verification code.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Password</FormLabel>
                    <Input
                      type="password"
                      {...field}
                      placeholder="••••••••"
                      className="bg-white/10 text-white border-white/40 placeholder-gray-300"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SUBMIT */}
              <Button
                disabled={isSubmitting}
                className="w-full h-11 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-gray-300 text-center mt-5">
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
