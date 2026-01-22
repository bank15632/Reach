# 🚀 Quick Start - ใช้งาน Improvements ทันที

## ✅ สิ่งที่ทำเสร็จแล้ว

### 1. **Layout ได้รับการปรับปรุงแล้ว** ✅
[src/app/layout.tsx](src/app/layout.tsx) ได้เพิ่ม:
- ✅ SkipLink - สำหรับ accessibility
- ✅ ErrorBoundary - จับ errors ทั้งแอป

### 2. **Next.js Config ปรับปรุงแล้ว** ✅
[next.config.ts](next.config.ts) ได้เพิ่ม:
- ✅ Image optimization (AVIF, WebP)
- ✅ Package optimization
- ✅ Compression enabled

### 3. **Components ใหม่พร้อมใช้งาน** ✅
- ✅ OptimizedImage
- ✅ ErrorBoundary
- ✅ Loading components
- ✅ SkipLink

---

## 🎯 ทดสอบเลย!

```bash
# ลบ build เก่า
rm -rf .next

# Build ใหม่
npm run build

# รัน production mode
npm run start
```

หรือ dev mode:
```bash
npm run dev
```

---

## 🧪 ทดสอบ Improvements

### 1. **SkipLink** (Accessibility)
1. เปิด http://localhost:3000
2. กด `Tab` ครั้งแรก
3. จะเห็นปุ่ม "ข้ามไปยังเนื้อหาหลัก" ปรากฏ
4. กด `Enter` จะข้ามไปเนื้อหาทันที

### 2. **ErrorBoundary**
ทดสอบว่าถ้ามี error จะไม่ทำให้ทั้งแอปพัง

### 3. **Performance**
```bash
# Build production
npm run build && npm run start

# Run Lighthouse
npx lighthouse http://localhost:3000 --view
```

---

## 📈 ผลลัพธ์ที่คาดหวัง

| Metric | Before | After |
|--------|--------|-------|
| Performance | 60-70 | 80-90+ |
| Accessibility | 70-80 | 90-100 |
| Best Practices | 80-85 | 90-95 |
| Images | background-image | Optimized Next.js Image |
| Error Handling | ❌ | ✅ ErrorBoundary |
| Keyboard Nav | ⚠️ | ✅ Full Support |

---

## 🔄 ใช้ Improved Page (Optional)

ถ้าต้องการใช้หน้าที่ปรับปรุงแล้วทั้งหมด:

```bash
# Backup ไฟล์เดิม
cp src/app/page.tsx src/app/page.backup.tsx

# ใช้ไฟล์ใหม่
cp src/app/page.improved.tsx src/app/page.tsx

# ทดสอบ
npm run dev
```

**Improved page มีอะไรเพิ่ม:**
- ✅ Video optimization พร้อม fallback image
- ✅ Keyboard navigation ใน Hero (←→ Space)
- ✅ ARIA labels ครบถ้วน
- ✅ Lazy loading สำหรับ InstagramGallery & Footer
- ✅ Better accessibility

---

## 📚 เอกสารเพิ่มเติม

- [IMPROVEMENTS.md](IMPROVEMENTS.md) - อธิบายการปรับปรุงทั้งหมด
- [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) - ตัวอย่างการใช้งาน components

---

## 🎨 ใช้ OptimizedImage ในหน้าอื่นๆ

### ตัวอย่างการแก้ไข

**Before:**
```tsx
<div
  className="h-96 bg-cover"
  style={{ backgroundImage: `url('${image}')` }}
/>
```

**After:**
```tsx
import OptimizedImage from "@/components/ui/OptimizedImage";

<div className="relative h-96">
  <OptimizedImage
    src={image}
    alt="Description"
    fill
    className="object-cover"
  />
</div>
```

---

## ✅ Checklist

ตอนนี้:
- ✅ Layout มี SkipLink + ErrorBoundary
- ✅ Next.js config optimized
- ✅ Components พร้อมใช้งาน
- ✅ Build สำเร็จ

ขั้นตอนถัดไป (optional):
- [ ] ใช้ page.improved.tsx (ถ้าต้องการ improvements ทั้งหมด)
- [ ] เพิ่ม OptimizedImage ในหน้าอื่นๆ
- [ ] ทดสอบด้วย Lighthouse
- [ ] ทดสอบด้วย screen reader

---

## 🆘 ถ้ามีปัญหา

### Build Error
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Type Error
ตรวจสอบว่า import paths ถูกต้อง

### Image ไม่โหลด
ตรวจสอบ `remotePatterns` ใน next.config.ts

---

**พร้อมใช้งานเลย!** 🎉

ตอนนี้โปรเจกต์ของคุณมี:
- ⚡ Performance ที่ดีขึ้น
- 🛡️ Error handling ที่แข็งแกร่ง
- ♿ Accessibility ที่ดีเยี่ยม
