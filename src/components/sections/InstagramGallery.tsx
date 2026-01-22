"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

export default function InstagramGallery() {
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const posts = [
    {
      id: 'post1',
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600',
      handle: '@reachbadminton',
      link: 'https://instagram.com/reachbadminton',
    },
    {
      id: 'post2',
      image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=600',
      handle: '@reachtraining',
      link: 'https://instagram.com/reachtraining',
    },
    {
      id: 'post3',
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=600',
      handle: '@reachcommunity',
      link: 'https://instagram.com/reachcommunity',
    },
    {
      id: 'post4',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600',
      handle: '@reachstyle',
      link: 'https://instagram.com/reachstyle',
    },
    {
      id: 'post5',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600',
      handle: '@reachfootwork',
      link: 'https://instagram.com/reachfootwork',
    },
    {
      id: 'post6',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600',
      handle: '@reachgear',
      link: 'https://instagram.com/reachgear',
    },
    {
      id: 'post7',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600',
      handle: '@reachmoves',
      link: 'https://instagram.com/reachmoves',
    },
    {
      id: 'post8',
      image: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?q=80&w=600',
      handle: '@reachofficial',
      link: 'https://instagram.com/reachofficial',
    },
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = scrollLeft / (scrollWidth - clientWidth);
      setScrollProgress(progress);
    }
  };

  const scrollLeftFn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRightFn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section
      className="py-16 bg-gray-50"
      aria-labelledby="instagram-heading"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.h2
          id="instagram-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-medium text-black text-center mb-10 italic"
        >
          {language === 'th' ? 'ก้าวหน้าไปด้วยกัน' : 'Get Stronger With Us'}
        </motion.h2>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          role="list"
          aria-label={language === 'th' ? 'แกลเลอรี่ Instagram' : 'Instagram gallery'}
        >
          {posts.map((post, index) => (
            <motion.a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-[70%] md:w-[23%] max-w-[320px] snap-start group"
              role="listitem"
            >
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-black">
                <Image
                  src={post.image}
                  alt={`Instagram post by ${post.handle}`}
                  fill
                  sizes="(max-width: 768px) 70vw, 23vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" aria-hidden="true" />
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                {post.handle}
              </p>
            </motion.a>
          ))}
        </div>

        <div className="mt-8 overflow-hidden" aria-hidden="true">
          <h3 className="text-[80px] md:text-[150px] font-bold text-gray-200 leading-none tracking-tighter select-none">
            REACH
          </h3>
        </div>

        <div className="flex items-center justify-end mt-4 gap-4">
          <div className="flex-1 h-px bg-gray-300 relative" aria-hidden="true">
            <div
              className="absolute left-0 top-0 h-px bg-black transition-all duration-300"
              style={{ width: `${Math.max(25, scrollProgress * 75 + 25)}%` }}
            />
          </div>

          <div className="flex items-center" role="group" aria-label={language === 'th' ? 'ปุ่มเลื่อนดู' : 'Scroll controls'}>
            <button
              onClick={scrollLeftFn}
              className="px-3 py-2 text-gray-400 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black rounded"
              aria-label={language === 'th' ? 'เลื่อนซ้าย' : 'Scroll left'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="w-px h-4 bg-gray-300" aria-hidden="true" />
            <button
              onClick={scrollRightFn}
              className="px-3 py-2 text-gray-400 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black rounded"
              aria-label={language === 'th' ? 'เลื่อนขวา' : 'Scroll right'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
