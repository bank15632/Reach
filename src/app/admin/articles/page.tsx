"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Plus, Eye, Filter } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import AdminGuard from "@/components/admin/AdminGuard";

interface Article {
  id: string;
  slug: string;
  title: string;
  titleTh: string;
  category: string;
  categoryTh: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const STATUS_OPTIONS = [
  { value: "", labelEn: "All", labelTh: "ทั้งหมด" },
  { value: "published", labelEn: "Published", labelTh: "เผยแพร่แล้ว" },
  { value: "draft", labelEn: "Draft", labelTh: "แบบร่าง" },
];

export default function AdminArticlesPage() {
  const { language } = useLanguage();
  const t = (en: string, th: string) => (language === "th" ? th : en);
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (search) params.set("search", search);
      if (status) params.set("status", status);

      const res = await fetch(`/api/admin/articles?${params}`);
      const data = await res.json();

      if (res.ok) {
        setArticles(data.articles);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [pagination.page, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchArticles();
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat(language === "th" ? "th-TH" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <AdminGuard permission="MANAGE_ARTICLES">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("Articles", "บทความ")}</h1>
          <p className="text-gray-500">{t("Manage all articles.", "จัดการบทความทั้งหมด")}</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t("Add Article", "เพิ่มบทความ")}
        </Link>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t("Search by title or slug...", "ค้นหาด้วยชื่อหรือ slug...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {language === "th" ? opt.labelTh : opt.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full mx-auto" />
            <p className="mt-2 text-gray-500">{t("Loading...", "กำลังโหลด...")}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{t("No articles found.", "ไม่พบบทความ")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t("Title", "ชื่อ")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t("Category", "หมวดหมู่")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t("Status", "สถานะ")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t("Published", "เผยแพร่")}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{t("Actions", "จัดการ")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {articles.map((article, index) => (
                  <motion.tr
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {language === "th" ? article.titleTh || article.title : article.title || article.titleTh}
                      </div>
                      <div className="text-sm text-gray-500">{article.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">
                        {language === "th" ? article.categoryTh || article.category : article.category || article.categoryTh}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          article.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {article.published ? t("Published", "เผยแพร่") : t("Draft", "แบบร่าง")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(article.publishedAt || article.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="p-2 text-gray-500 hover:text-brand-yellow hover:bg-yellow-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              {t("Showing", "แสดง")} {(pagination.page - 1) * pagination.limit + 1} -{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} {t("of", "จาก")} {pagination.total} {t("items", "รายการ")}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                  }))
                }
                disabled={pagination.page === 1}
                className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                {t("Previous", "ก่อนหน้า")}
              </button>
              <span className="text-sm">
                {t("Page", "หน้า")} {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                  }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                {t("Next", "ถัดไป")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </AdminGuard>
  );
}
