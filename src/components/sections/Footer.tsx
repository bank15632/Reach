"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="py-12 bg-black border-t border-white/10" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">REACH</h3>
            <p className="text-gray-400 text-sm">
              {language === 'th'
                ? 'อุปกรณ์แบดมินตันระดับมืออาชีพ'
                : 'Professional badminton equipment'}
            </p>
          </div>

          {/* Shop */}
          <nav aria-labelledby="shop-heading">
            <h4 id="shop-heading" className="text-white font-semibold mb-4">
              {language === 'th' ? 'ช้อป' : 'SHOP'}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/rackets"
                  className="text-gray-400 hover:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded"
                >
                  {language === 'th' ? 'ไม้แบด' : 'Rackets'}
                </a>
              </li>
              <li>
                <a
                  href="/shoes"
                  className="text-gray-400 hover:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded"
                >
                  {language === 'th' ? 'รองเท้า' : 'Shoes'}
                </a>
              </li>
              <li>
                <a
                  href="/sportswear"
                  className="text-gray-400 hover:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded"
                >
                  {language === 'th' ? 'ชุดกีฬา' : 'Sportswear'}
                </a>
              </li>
              <li>
                <a
                  href="/supplements"
                  className="text-gray-400 hover:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded"
                >
                  {language === 'th' ? 'อาหารเสริม' : 'Supplements'}
                </a>
              </li>
              <li>
                <a
                  href="/bundles"
                  className="text-gray-400 hover:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded"
                >
                  {language === 'th' ? 'เซ็ตสุดคุ้ม' : 'Bundles'}
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  className="text-gray-400 hover:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded"
                >
                  {language === 'th' ? 'ดูสินค้าทั้งหมด' : 'All Products'}
                </a>
              </li>
            </ul>
          </nav>

          {/* Help */}
          <nav aria-labelledby="help-heading">
            <h4 id="help-heading" className="text-white font-semibold mb-4">
              {language === 'th' ? 'ช่วยเหลือ' : 'HELP'}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/track-order"
                  className="text-gray-200 hover:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded"
                >
                  {language === 'th' ? 'ติดตามคำสั่งซื้อ' : 'Track Order'}
                </a>
                <p className="text-gray-500 text-xs">
                  {language === 'th'
                    ? 'กรอกเลขพัสดุและติดต่อทีมงานผ่านโซเชียลได้ทันที'
                    : 'Enter your tracking ID and chat with support instantly.'}
                </p>
              </li>
              <li>
                <a
                  href="/returns"
                  className="text-gray-200 hover:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded"
                >
                  {language === 'th' ? 'คืน / เปลี่ยนสินค้า' : 'Returns & Exchanges'}
                </a>
                <p className="text-gray-500 text-xs">
                  {language === 'th'
                    ? 'อ่านขั้นตอนการคืนสินค้าและติดต่อทีมงานผ่าน Social ช่องทางต่างๆ'
                    : 'Review the return steps and reach us via social channels.'}
                </p>
              </li>
              <li>
                <a
                  href="/welcome"
                  className="text-gray-200 hover:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded"
                >
                  {language === 'th' ? 'คู่มือเลือกสินค้า' : 'Product Guides'}
                </a>
                <p className="text-gray-500 text-xs">
                  {language === 'th'
                    ? 'คำแนะนำการเลือกอุปกรณ์ให้เหมาะกับระดับการเล่น'
                    : 'Find the right gear for your play style.'}
                </p>
              </li>
              <li>
                <a
                  href="/affiliate"
                  className="text-gray-200 hover:text-brand-yellow text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded"
                >
                  {language === 'th' ? 'ร่วมงานกับเรา' : 'Partner With Us'}
                </a>
                <p className="text-gray-500 text-xs">
                  {language === 'th'
                    ? 'สำหรับโค้ช สโมสร และผู้จัดงานที่ต้องการความร่วมมือ'
                    : 'For coaches, clubs, and event partners.'}
                </p>
              </li>
            </ul>
          </nav>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {language === 'th' ? 'ติดตามเรา' : 'FOLLOW US'}
            </h4>
            <div className="flex gap-4" role="list" aria-label={language === 'th' ? 'โซเชียลมีเดีย' : 'Social media'}>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded p-1"
                aria-label="Facebook"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded p-1"
                aria-label="Instagram"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded p-1"
                aria-label="YouTube"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded p-1"
                aria-label="X"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded p-1"
                aria-label="TikTok"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded p-1"
                aria-label="LINE"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Reach Pro Store.{' '}
            {language === 'th' ? 'สงวนลิขสิทธิ์' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
