"use client";

import { motion } from "framer-motion";

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex items-center justify-center" role="status" aria-label="กำลังโหลด">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-gray-700 border-t-brand-yellow rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <span className="sr-only">กำลังโหลด...</span>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-400">กำลังโหลด...</p>
      </div>
    </div>
  );
}

export function SectionLoading() {
  return (
    <div className="py-20 flex items-center justify-center">
      <LoadingSpinner size="md" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="aspect-square bg-gray-800 rounded mb-3" />
      <div className="flex gap-1.5 mb-3">
        <div className="w-7 h-7 rounded-full bg-gray-800" />
        <div className="w-7 h-7 rounded-full bg-gray-800" />
        <div className="w-7 h-7 rounded-full bg-gray-800" />
      </div>
      <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-800 rounded w-1/2 mb-3" />
      <div className="h-4 bg-gray-800 rounded w-1/3" />
    </div>
  );
}
