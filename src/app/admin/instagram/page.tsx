"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Save } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import AdminGuard from "@/components/admin/AdminGuard";

interface InstagramPost {
    id: string;
    imageUrl: string;
    handle?: string | null;
    link?: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
}

const defaultForm = {
    imageUrl: "",
    handle: "",
    link: "",
    isActive: true,
    sortOrder: 0,
};

export default function AdminInstagramPage() {
    const { language } = useLanguage();
    const t = (en: string, th: string) => (language === "th" ? th : en);
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [form, setForm] = useState(defaultForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/instagram");
            const data = await res.json();
            if (res.ok) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error("Fetch instagram posts error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleEdit = (post: InstagramPost) => {
        setEditingId(post.id);
        setForm({
            imageUrl: post.imageUrl,
            handle: post.handle ?? "",
            link: post.link ?? "",
            isActive: post.isActive,
            sortOrder: post.sortOrder ?? 0,
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setForm(defaultForm);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSaving(true);
        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `/api/admin/instagram/${editingId}` : "/api/admin/instagram";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageUrl: form.imageUrl,
                    handle: form.handle || null,
                    link: form.link || null,
                    isActive: form.isActive,
                    sortOrder: Number(form.sortOrder) || 0,
                }),
            });

            if (res.ok) {
                await fetchPosts();
                resetForm();
            }
        } catch (error) {
            console.error("Save instagram post error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t("Delete this post?", "ลบโพสต์นี้หรือไม่?"))) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/instagram/${id}`, { method: "DELETE" });
            if (res.ok) {
                setPosts((prev) => prev.filter((post) => post.id !== id));
            }
        } catch (error) {
            console.error("Delete instagram post error:", error);
        }
    };

    return (
        <AdminGuard permission="MANAGE_ARTICLES">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t("Instagram Gallery", "แกลเลอรี่ Instagram")}</h1>
                    <p className="text-gray-500">
                        {t("Manage Instagram images shown on the homepage.", "จัดการรูป Instagram ที่แสดงบนหน้าแรก")}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Image URL", "ลิงก์รูป")}</label>
                            <input
                                type="url"
                                value={form.imageUrl}
                                onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                                placeholder="https://..."
                                required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Handle", "แฮนเดิล")}</label>
                            <input
                                type="text"
                                value={form.handle}
                                onChange={(event) => setForm((prev) => ({ ...prev, handle: event.target.value }))}
                                placeholder="@reachbadminton"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Link", "ลิงก์ปลายทาง")}</label>
                            <input
                                type="url"
                                value={form.link}
                                onChange={(event) => setForm((prev) => ({ ...prev, link: event.target.value }))}
                                placeholder="https://instagram.com/..."
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Sort Order", "ลำดับ")}</label>
                            <input
                                type="number"
                                value={form.sortOrder}
                                onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: Number(event.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                            />
                        </div>
                    </div>
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                            className="rounded border-gray-300 text-brand-yellow focus:ring-brand-yellow"
                        />
                        {t("Active", "แสดงผล")}
                    </label>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-60"
                        >
                            {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {editingId ? t("Update Post", "อัปเดตโพสต์") : t("Add Post", "เพิ่มโพสต์")}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-sm text-gray-500 hover:text-gray-900"
                            >
                                {t("Cancel edit", "ยกเลิกการแก้ไข")}
                            </button>
                        )}
                    </div>
                </form>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    {isLoading ? (
                        <p className="text-gray-500">{t("Loading posts...", "กำลังโหลดโพสต์...")}</p>
                    ) : posts.length === 0 ? (
                        <p className="text-gray-500">{t("No posts yet.", "ยังไม่มีโพสต์")}</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {posts.map((post) => (
                                <div key={post.id} className="flex gap-4 border border-gray-100 rounded-lg p-4">
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={post.imageUrl} alt={post.handle || "Instagram post"} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{post.handle || t("No handle", "ไม่มีแฮนเดิล")}</p>
                                        <p className="text-xs text-gray-500 truncate">{post.link || "-"}</p>
                                        <p className="text-xs text-gray-500 mt-1">{t("Sort:", "ลำดับ:")} {post.sortOrder}</p>
                                        <p className="text-xs text-gray-500">{post.isActive ? t("Active", "แสดงผล") : t("Hidden", "ซ่อน")}</p>
                                        <div className="flex items-center gap-3 mt-3">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(post)}
                                                className="text-sm text-gray-700 hover:text-gray-900"
                                            >
                                                {t("Edit", "แก้ไข")}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(post.id)}
                                                className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                {t("Delete", "ลบ")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminGuard>
    );
}
