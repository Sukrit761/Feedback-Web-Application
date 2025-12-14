"use client";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-xl z-[9999]">
      {/* Glowing Pulse Ring */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0.5 }}
        animate={{ scale: [0.8, 1.1, 0.8], opacity: 1 }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="w-24 h-24 rounded-full border-4 border-blue-400 shadow-[0_0_25px_#3b82f6] flex items-center justify-center"
      >
        {/* Inner Logo / Text */}
        <motion.span
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-white text-xl tracking-widest font-semibold"
        >
          EM
        </motion.span>
      </motion.div>
    </div>
  );
}
