# การใช้งาน Components ที่ปรับปรุงแล้ว

## 1. OptimizedImage Component

### Basic Usage
```tsx
import OptimizedImage from "@/components/ui/OptimizedImage";

// แบบใช้ fill (เต็ม container)
<div className="relative w-full h-96">
  <OptimizedImage
    src="https://images.unsplash.com/photo-123456"
    alt="Product image"
    fill
    priority // ใช้สำหรับรูปสำคัญ (above the fold)
  />
</div>

// แบบระบุ width/height
<OptimizedImage
  src="/images/product.jpg"
  alt="Product"
  width={800}
  height={600}
  className="rounded-lg"
/>
```

### Advanced Usage
```tsx
<OptimizedImage
  src={product.image}
  alt={product.name}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={90}
  objectFit="cover"
  onLoad={() => console.log('Image loaded!')}
/>
```

### แทนที่ background-image
```tsx
// Before (background-image)
<div
  className="h-96 bg-cover bg-center"
  style={{ backgroundImage: `url('${image}')` }}
/>

// After (OptimizedImage)
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

## 2. Error Boundary

### Wrap ทั้งหน้า
```tsx
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Page() {
  return (
    <ErrorBoundary>
      <YourContent />
    </ErrorBoundary>
  );
}
```

### Wrap เฉพาะ Section
```tsx
import { SectionErrorBoundary } from "@/components/ErrorBoundary";

<SectionErrorBoundary>
  <FeaturedProducts />
</SectionErrorBoundary>

<SectionErrorBoundary>
  <TournamentShowcase />
</SectionErrorBoundary>
```

### Custom Fallback UI
```tsx
<ErrorBoundary
  fallback={
    <div className="p-8 text-center">
      <p>ขออภัย ไม่สามารถโหลดส่วนนี้ได้</p>
      <button onClick={() => window.location.reload()}>
        ลองใหม่
      </button>
    </div>
  }
  onError={(error, errorInfo) => {
    // Send to error logging service
    logErrorToService(error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

---

## 3. Loading Components

### Page Loading
```tsx
import { PageLoading } from "@/components/ui/Loading";

export default function Loading() {
  return <PageLoading />;
}
```

### Section Loading
```tsx
import { SectionLoading } from "@/components/ui/Loading";

<Suspense fallback={<SectionLoading />}>
  <LazyComponent />
</Suspense>
```

### Custom Spinner
```tsx
import { LoadingSpinner } from "@/components/ui/Loading";

<div className="flex justify-center p-8">
  <LoadingSpinner size="lg" />
</div>
```

### Product Card Skeleton
```tsx
import { ProductCardSkeleton } from "@/components/ui/Loading";

{isLoading ? (
  <div className="grid grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
) : (
  <ProductGrid products={products} />
)}
```

---

## 4. Lazy Loading Components

### Dynamic Import
```tsx
import { lazy, Suspense } from "react";
import { SectionLoading } from "@/components/ui/Loading";

// Lazy load heavy component
const HeavyComponent = lazy(() => import("@/components/HeavyComponent"));

export default function Page() {
  return (
    <Suspense fallback={<SectionLoading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Multiple Lazy Components
```tsx
const Footer = lazy(() => import("@/components/sections/Footer"));
const InstagramGallery = lazy(() => import("@/components/sections/InstagramGallery"));
const Comments = lazy(() => import("@/components/Comments"));

export default function Page() {
  return (
    <>
      <MainContent />

      <Suspense fallback={<SectionLoading />}>
        <InstagramGallery />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Comments />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Footer />
      </Suspense>
    </>
  );
}
```

---

## 5. Skip Link

### เพิ่มใน Layout
```tsx
import SkipLink from "@/components/ui/SkipLink";

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <SkipLink />
        <Navbar />
        <main id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

---

## 6. Accessibility Best Practices

### Buttons
```tsx
// ❌ Bad
<button onClick={handleClick}>
  <Icon />
</button>

// ✅ Good
<button
  onClick={handleClick}
  aria-label="เปิดเมนู"
  className="focus:outline-none focus:ring-2 focus:ring-brand-yellow"
>
  <Icon aria-hidden="true" />
</button>
```

### Images
```tsx
// ❌ Bad
<img src="/product.jpg" />

// ✅ Good
<OptimizedImage
  src="/product.jpg"
  alt="ไม้แบดมินตัน NANOFLARE 1000 TOUR สีแดง"
  width={800}
  height={600}
/>

// ❌ Bad (decorative image)
<img src="/decoration.jpg" alt="decoration" />

// ✅ Good (decorative image)
<OptimizedImage
  src="/decoration.jpg"
  alt="" // Empty alt for decorative images
  width={200}
  height={200}
  aria-hidden="true"
/>
```

### Navigation
```tsx
// ✅ Good
<nav aria-label="เมนูหลัก">
  <ul role="list">
    <li>
      <a
        href="/rackets"
        className="focus:ring-2 focus:ring-brand-yellow"
      >
        ไม้แบด
      </a>
    </li>
  </ul>
</nav>
```

### Forms
```tsx
// ✅ Good
<form onSubmit={handleSubmit}>
  <label htmlFor="email" className="block mb-2">
    อีเมล
  </label>
  <input
    id="email"
    type="email"
    required
    aria-required="true"
    aria-describedby="email-error"
    className="focus:ring-2 focus:ring-brand-yellow"
  />
  <span id="email-error" role="alert" className="text-red-500">
    {errors.email}
  </span>
</form>
```

### Modals/Dialogs
```tsx
import { useEffect, useRef } from "react";

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus trap
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
      tabIndex={-1}
    >
      <h2 id="modal-title">ชื่อ Modal</h2>
      {children}
      <button
        onClick={onClose}
        aria-label="ปิด"
        className="focus:ring-2 focus:ring-brand-yellow"
      >
        ✕
      </button>
    </div>
  );
}
```

---

## 7. Performance Tips

### Image Sizes
```tsx
// Hero image (ควรใช้ priority)
<OptimizedImage
  src="/hero.jpg"
  alt="Hero"
  fill
  priority
  sizes="100vw"
/>

// Product grid
<OptimizedImage
  src={product.image}
  alt={product.name}
  fill
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
/>

// Thumbnail
<OptimizedImage
  src={thumbnail}
  alt="Thumbnail"
  width={100}
  height={100}
  quality={75}
/>
```

### Lazy Load Images Below Fold
```tsx
// Above the fold (priority)
<OptimizedImage src="/hero.jpg" alt="Hero" fill priority />

// Below the fold (lazy)
<OptimizedImage src="/feature.jpg" alt="Feature" fill />
```

### Preload Critical Resources
```tsx
// In layout.tsx or page.tsx
export function generateMetadata() {
  return {
    other: {
      'preload': '/fonts/custom-font.woff2',
    }
  }
}
```

---

## 8. Testing Accessibility

### Keyboard Navigation Test
1. กด Tab ผ่านทุก interactive element
2. ตรวจสอบว่า focus ring มองเห็นชัดเจน
3. กด Enter/Space ที่ buttons ควรทำงาน
4. ลูกศร (←→↑↓) ควรทำงานในที่ที่เหมาะสม

### Screen Reader Test
```bash
# macOS
# เปิด VoiceOver: Cmd + F5

# Windows
# ใช้ NVDA (free): https://www.nvaccess.org/
```

### Lighthouse Audit
```bash
# Build production
npm run build

# Run Lighthouse
npx lighthouse http://localhost:3000 --view
```

### axe DevTools
1. ติดตั้ง [axe DevTools Extension](https://www.deque.com/axe/devtools/)
2. เปิด DevTools → axe DevTools tab
3. กด "Scan ALL of my page"

---

## 🎯 Checklist

- [ ] ใช้ OptimizedImage แทน `<img>` และ background-image
- [ ] เพิ่ม alt text ให้ทุกรูป
- [ ] ใส่ Error Boundaries รอบ sections
- [ ] เพิ่ม loading states
- [ ] Lazy load components ที่หนัก
- [ ] เพิ่ม ARIA labels ให้ interactive elements
- [ ] ทดสอบ keyboard navigation
- [ ] ทดสอบด้วย screen reader
- [ ] Run Lighthouse audit (target: 90+)
- [ ] ทดสอบบน mobile devices

