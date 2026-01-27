export interface ApiProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number | null;
  stock: number;
}

export interface ApiProduct {
  id: string;
  sku: string;
  name: string;
  nameTh: string;
  description?: string | null;
  descriptionTh?: string | null;
  price: number;
  salePrice?: number | null;
  category: string;
  brand?: string | null;
  images: string[];
  inStock: boolean;
  stockCount: number;
  featured: boolean;
  weight?: number | null;
  variants?: ApiProductVariant[];
}

export interface ApiBundleItem {
  id: string;
  productId: string;
  quantity: number;
  product?: ApiProduct;
}

export interface ApiBundle {
  id: string;
  name: string;
  nameTh: string;
  description?: string | null;
  price: number;
  originalPrice: number;
  images: string[];
  isActive: boolean;
  items?: ApiBundleItem[];
}

export interface ApiArticle {
  id: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  heroImage: string;
  image?: string;
  category: string;
  categoryTh: string;
  date: string;
  sections?: Array<{
    title: string;
    titleEn: string;
    content: string;
    contentEn: string;
    image: string;
  }>;
}

export interface ApiInstagramPost {
  id: string;
  imageUrl: string;
  handle?: string | null;
  link?: string | null;
}

export type ProductDisplayPrice = {
  current: number;
  original?: number;
};

export function getDisplayPrice(product: ApiProduct): ProductDisplayPrice {
  if (product.salePrice && product.salePrice < product.price) {
    return { current: product.salePrice, original: product.price };
  }
  return { current: product.price };
}

function buildQuery(params?: Record<string, string | number | boolean | null | undefined>) {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

async function safeFetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("API fetch failed:", error);
    return null;
  }
}

export async function fetchProducts(params?: Record<string, string | number | boolean | null | undefined>) {
  const query = buildQuery(params);
  const data = await safeFetchJson<{ products: ApiProduct[] }>(`/api/products${query}`);
  return data?.products ?? [];
}

export async function fetchProduct(id: string) {
  const data = await safeFetchJson<{ product: ApiProduct }>(`/api/products/${id}`);
  return data?.product ?? null;
}

export async function fetchBundles(params?: Record<string, string | number | boolean | null | undefined>) {
  const query = buildQuery(params);
  const data = await safeFetchJson<{ bundles: ApiBundle[] }>(`/api/bundles${query}`);
  return data?.bundles ?? [];
}

export async function fetchBundle(id: string) {
  const data = await safeFetchJson<{ bundle: ApiBundle }>(`/api/bundles/${id}`);
  return data?.bundle ?? null;
}

export async function fetchArticles(params?: Record<string, string | number | boolean | null | undefined>) {
  const query = buildQuery(params);
  const data = await safeFetchJson<{ articles: ApiArticle[] }>(`/api/articles${query}`);
  return data?.articles ?? [];
}

export async function fetchInstagramPosts(params?: Record<string, string | number | boolean | null | undefined>) {
  const query = buildQuery(params);
  const data = await safeFetchJson<{ posts: ApiInstagramPost[] }>(`/api/instagram${query}`);
  return data?.posts ?? [];
}
