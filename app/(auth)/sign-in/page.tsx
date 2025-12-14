'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from "framer-motion"; 
import { useState, useEffect } from "react";

import {
  Form, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';


export default function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true); // 👈 LOADER

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);


  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      identifier: data.identifier,
      password: data.password,
      callbackUrl: "/message",
      redirect: true
    });

    if (result?.error) {
      toast({
        title: "Login Failed",
        description: result.error === "CredentialsSignin"
          ? "Incorrect username or password"
          : result.error,
        variant: "destructive"
      });
    }
  };


  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* 🔥 BACKGROUND VIDEO */}
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/videos/bg-3129576.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/75 backdrop-blur-[3px]" />

      {/* ⏳ LOADER BEFORE PAGE REVEALS */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-black flex items-center justify-center z-50"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }}
                className="w-14 h-14 border-4 border-t-transparent rounded-full border-orange-600"
              ></motion.div>
              <p className="text-gray-300 text-sm tracking-wide">Loading Experience...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* FORM CONTENT — appears AFTER loader */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 flex items-center justify-center min-h-screen px-4"
        >
          <div className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-2xl shadow-2xl text-white">

            <div className="text-center space-y-3 mb-6">
              <motion.h1 
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold"
              >
                Welcome Back 👋
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-gray-300 text-sm"
              >
                Continue your anonymous feedback journey
              </motion.p>
            </div>


            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                <FormField name="identifier" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <Input {...field} placeholder="john_doe"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"/>
                    <FormMessage />
                  </FormItem>
                )}/>

                <FormField name="password" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" {...field} placeholder="••••••••"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400" />
                    <FormMessage />
                  </FormItem>
                )}/>

                <Button
                  type="submit"
                  className="w-full h-11 text-lg font-medium
                  bg-gradient-to-r from-red-700 to-orange-500 
                  hover:scale-[1.04] hover:shadow-[0_0_25px_#c61515]
                  transition-all duration-300">
                  Sign In
                </Button>
              </form>
            </Form>

            <p className="text-gray-300 text-center mt-6 text-sm">
              New here?{" "}
              <Link href="/sign-up" className="text-purple-400 font-semibold underline hover:text-purple-200">
                Create an account →
              </Link>
            </p>
          </div>
        </motion.div>
      )}
    </main>
  );
}
