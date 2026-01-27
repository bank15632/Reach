"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import AdminGuard from "@/components/admin/AdminGuard";

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const t = (en: string, th: string) => (language === "th" ? th : en);
  const articleId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    titleTh: "",
    excerpt: "",
    excerptTh: "",
    category: "",
    categoryTh: "",
    heroImage: "",
    image: "",
    tags: "",
    sections: "[]",
    published: false,
  });

  useEffect(() => {
    async function fetchArticle() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/admin/articles/${articleId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || t("Article not found", "ไม่พบบทความ"));
          return;
        }

        setFormData({
          slug: data.article.slug || "",
          title: data.article.title || "",
          titleTh: data.article.titleTh || "",
          excerpt: data.article.excerpt || "",
          excerptTh: data.article.excerptTh || "",
          category: data.article.category || "",
          categoryTh: data.article.categoryTh || "",
          heroImage: data.article.heroImage || "",
          image: data.article.image || "",
          tags: (data.article.tags || []).join(", "),
          sections: JSON.stringify(data.article.sections || [], null, 2),
          published: Boolean(data.article.published),
        });
      } catch (err) {
        console.error("Fetch article error:", err);
        setError(t("Connection error.", "เกิดข้อผิดพลาดในการเชื่อมต่อ"));
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticle();
  }, [articleId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || t("Failed to update article", "อัปเดตบทความไม่สำเร็จ"));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        sections: JSON.stringify(data.article.sections || [], null, 2),
      }));
    } catch (err) {
      console.error("Update article error:", err);
      setError(t("Connection error.", "เกิดข้อผิดพลาดในการเชื่อมต่อ"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("Confirm delete this article?", "ยืนยันการลบบทความนี้?"))) return;

    try {
      const res = await fetch(`/api/admin/articles/${articleId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t("Failed to delete article", "ลบบทความไม่สำเร็จ"));
        return;
      }
      router.push("/admin/articles");
    } catch (err) {
      console.error("Delete article error:", err);
      setError(t("Connection error.", "เกิดข้อผิดพลาดในการเชื่อมต่อ"));
    }
  };

  if (isLoading) {
    return <div className="text-gray-500">{t("Loading...", "กำลังโหลด...")}</div>;
  }

  return (
    <AdminGuard permission="MANAGE_ARTICLES">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("Edit Article", "แก้ไขบทความ")}</h1>
          <p className="text-gray-500">{t("Manage article details.", "จัดการรายละเอียดบทความ")}</p>
        </div>
        <Link href="/admin/articles" className="text-sm text-gray-500 hover:text-gray-900">
          {t("Back", "ย้อนกลับ")}
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">{t("Published", "เผยแพร่")}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("Title (EN)", "Title (EN)")}</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("Title (TH)", "Title (TH)")}</label>
              <input
                type="text"
                required
                value={formData.titleTh}
                onChange={(e) => setFormData({ ...formData, titleTh: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("Excerpt (EN)", "Excerpt (EN)")}</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("Excerpt (TH)", "Excerpt (TH)")}</label>
              <textarea
                value={formData.excerptTh}
                onChange={(e) => setFormData({ ...formData, excerptTh: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={3}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("Category (EN)", "Category (EN)")}</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("Category (TH)", "Category (TH)")}</label>
              <input
                type="text"
                value={formData.categoryTh}
                onChange={(e) => setFormData({ ...formData, categoryTh: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("Hero Image", "รูปภาพหลัก")}</label>
              <input
                type="text"
                value={formData.heroImage}
                onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("Card Image", "รูปภาพการ์ด")}</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Tags", "แท็ก")}</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Sections (JSON)", "ส่วนเนื้อหา (JSON)")}</label>
            <textarea
              value={formData.sections}
              onChange={(e) => setFormData({ ...formData, sections: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono text-xs"
              rows={10}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-brand-yellow text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {isSaving ? t("Saving...", "กำลังบันทึก...") : t("Save changes", "บันทึกการเปลี่ยนแปลง")}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            {t("Delete Article", "ลบบทความ")}
          </button>
        </div>
      </form>
    </div>
    </AdminGuard>
  );
}
