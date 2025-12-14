"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
// Loader Component
const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900"
    >
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 mx-auto mb-4 border-4 border-t-orange-500 border-r-red-600 border-b-orange-400 border-l-red-700 rounded-full"
        />
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold bg-gradient-to-r from-red-700 to-orange-600 bg-clip-text text-transparent"
        >
          EchoMind
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 text-sm mt-2"
        >
          Loading your experience...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const user = session?.user
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  const href = status === "authenticated" ? "/dashboard" : "/sign-in";

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Loader */}
      <AnimatePresence>
        {loading && <Loader />}
      </AnimatePresence>

      {/* Background Video */}
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: loading ? 0 : 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      >
        <source src="/videos/bg-3129576.mp4" type="video/mp4" />
      </motion.video>

      {/* Dark Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* 1️⃣ Title Animation */}
        <motion.h1
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: loading ? 0 : 1, y: 0, scale: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.5,
            ease: [0.16, 1, 0.3, 1],
            type: "spring",
            stiffness: 100,
          }}
          className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent"
        >
          EchoMind
        </motion.h1>

        {/* 2️⃣ Paragraph 1 */}
        <motion.p
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: loading ? 0 : 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: 0.8,
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="text-gray-300 mt-4 max-w-2xl text-lg leading-relaxed"
        >
          Speak freely. Learn honestly. Grow fearlessly. EchoMind allows you to{" "}
          <span className="text-orange-400 font-semibold">
            send & receive anonymous feedback
          </span>{" "}
          enhanced by AI — helping you improve with truth, not filters.
        </motion.p>

        {/* 3️⃣ Paragraph 2 */}
        <motion.p
          initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
          animate={{ opacity: loading ? 0 : 1, x: 0, filter: "blur(0px)" }}
          transition={{
            delay: 1.1,
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="text-gray-400 mt-2 max-w-xl text-base"
        >
          Your voice matters. Your identity stays hidden. AI analyzes tone,
          generates insights & helps you understand people better.
        </motion.p>

        {/* 4️⃣ CTA Button */}
        <motion.a
          href={href}
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{
            opacity: status === "loading" ? 0 : 1,
            scale: 1,
            rotate: 0,
          }}
          whileHover={{
            scale: 1.1,
            rotate: 2,
            boxShadow: "0 20px 60px rgba(234, 88, 12, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{
            delay: 1.4,
            duration: 0.8,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="mt-8 px-8 py-3 text-lg font-semibold rounded-xl
  bg-gradient-to-r from-red-700 to-orange-600
  transition-transform shadow-lg cursor-pointer"
        >
          Get Started →
        </motion.a>


        {/* 5️⃣ Feature Cards Animated as Group */}
        <motion.div
          initial="hidden"
          animate={loading ? "hidden" : "visible"}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                delay: 1.7,
                staggerChildren: 0.15,
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            },
          }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl"
        >
          {[
            {
              title: "🔒 Fully Anonymous",
              text: "No identity shared. Speak without fear.",
            },
            {
              title: "🧠 AI-Powered Insights",
              text: "Receive clear sentiment & feedback analysis.",
            },
            {
              title: "⚡ Instant & Secure",
              text: "No time delay — feedback delivered instantly.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.9 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  },
                },
              }}
              whileHover={{
                scale: 1.05,
                y: -8,
                boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)",
              }}
              className="p-5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md hover:bg-white/20 transition cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-300">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 📜 Terms & Policies Section */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={{ opacity: loading ? 0 : 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: 2.2,
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="mt-20 mb-12 max-w-3xl text-center text-gray-300 px-4"
        >
          <h2 className="text-2xl font-semibold text-white mb-3">
            ⚖️ Terms • Privacy • Policy
          </h2>

          <p className="text-sm leading-6 text-gray-300 opacity-90">
            By continuing, you agree to our platform's{" "}
            <span className="text-blue-300">Terms of Service</span>,
            <span className="text-blue-300"> Privacy Policy</span> and usage
            rules. Your identity remains protected — feedback stays ethical,
            helpful and human.
          </p>

          <motion.a
            href="/terms"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block mt-5 px-6 py-2 text-sm rounded-lg
            bg-white/15 backdrop-blur-xl border border-white/20 
            hover:bg-white/25 transition-all duration-200
            text-gray-200 font-medium shadow-md cursor-pointer"
          >
            View Full Terms →
          </motion.a>
        </motion.div>
      </motion.div>
    </main>
  );
}