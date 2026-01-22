"use client";

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-brand-yellow focus:text-black focus:font-semibold focus:rounded focus:shadow-lg"
    >
      ข้ามไปยังเนื้อหาหลัก
    </a>
  );
}
