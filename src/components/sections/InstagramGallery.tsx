"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ApiInstagramPost, fetchInstagramPosts } from "@/lib/apiClient";

export default function InstagramGallery() {
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [posts, setPosts] = useState<ApiInstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      try {
        const data = await fetchInstagramPosts({ limit: 12 });
        if (!isMounted) return;
        setPosts(data);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

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
          {isLoading && (
            <div className="text-sm text-gray-500 px-2">
              {language === 'th' ? 'กำลังโหลดโพสต์...' : 'Loading posts...'}
            </div>
          )}
          {!isLoading && posts.length === 0 && (
            <div className="text-sm text-gray-500 px-2">
              {language === 'th' ? 'ยังไม่มีโพสต์' : 'No posts available'}
            </div>
          )}
          {posts.map((post, index) => {
            const link = post.link || "https://instagram.com";
            return (
              <motion.a
                key={post.id}
                href={link}
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
                  <img
                    src={post.imageUrl}
                    alt={post.handle ? `Instagram post by ${post.handle}` : "Instagram post"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" aria-hidden="true" />
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  {post.handle || "@reach"}
                </p>
              </motion.a>
            );
          })}
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
