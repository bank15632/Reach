"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import AdminGuard from "@/components/admin/AdminGuard";

interface Partner {
  id: string;
  affiliateCode: string;
  status: string;
  totalSales: number;
  partnerPoints: number;
  totalCommission: number;
  availableCommission: number;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  createdAt: string;
  partner: {
    user: {
      email: string;
      firstName: string;
      lastName: string;
    };
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const STATUS_OPTIONS = [
  { value: "", labelEn: "All", labelTh: "ทั้งหมด" },
  { value: "PENDING", labelEn: "Pending", labelTh: "รออนุมัติ" },
  { value: "APPROVED", labelEn: "Approved", labelTh: "อนุมัติแล้ว" },
  { value: "REJECTED", labelEn: "Rejected", labelTh: "ปฏิเสธ" },
  { value: "SUSPENDED", labelEn: "Suspended", labelTh: "ระงับ" },
];

const STATUS_LABELS: Record<string, { en: string; th: string }> = {
  PENDING: { en: "Pending", th: "รออนุมัติ" },
  APPROVED: { en: "Approved", th: "อนุมัติแล้ว" },
  REJECTED: { en: "Rejected", th: "ปฏิเสธ" },
  SUSPENDED: { en: "Suspended", th: "ระงับ" },
};

export default function AdminPartnersPage() {
  const { language } = useLanguage();
  const t = (en: string, th: string) => (language === "th" ? th : en);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (search) params.set("search", search);
      if (status) params.set("status", status);

      const res = await fetch(`/api/admin/partners?${params}`);
      const data = await res.json();

      if (res.ok) {
        setPartners(data.partners);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch("/api/admin/partners/withdrawals?status=PENDING");
      const data = await res.json();
      if (res.ok) {
        setWithdrawals(data.withdrawals);
      }
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [pagination.page, status]);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchPartners();
  };

  const updatePartnerStatus = async (id: string, nextStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        fetchPartners();
      }
    } catch (error) {
      console.error("Update partner status error:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateWithdrawal = async (id: string, nextStatus: string) => {
    try {
      await fetch("/api/admin/partners/withdrawals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      fetchWithdrawals();
    } catch (error) {
      console.error("Update withdrawal error:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === "th" ? "th-TH" : "en-US").format(amount);
  };

  return (
    <AdminGuard permission="MANAGE_PARTNERS">
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("Partners", "พาร์ทเนอร์")}</h1>
        <p className="text-gray-500">{t("Manage partners and withdrawal requests.", "จัดการพาร์ทเนอร์และคำขอถอนเงิน")}</p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t("Search by name or email...", "ค้นหาด้วยชื่อหรืออีเมล...")}
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
          <div className="p-8 text-center">{t("Loading...", "กำลังโหลด...")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t("Partner", "พาร์ทเนอร์")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t("Code", "โค้ด")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t("Sales", "ยอดขาย")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t("Available commission", "คอมมิชชั่นคงเหลือ")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t("Status", "สถานะ")}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{t("Actions", "จัดการ")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {partners.map((partner, index) => (
                  <motion.tr
                    key={partner.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {partner.user.firstName} {partner.user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{partner.user.email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{partner.affiliateCode}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      ฿{formatCurrency(partner.totalSales)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      ฿{formatCurrency(partner.availableCommission)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {STATUS_LABELS[partner.status]
                        ? t(STATUS_LABELS[partner.status].en, STATUS_LABELS[partner.status].th)
                        : partner.status}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {partner.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => updatePartnerStatus(partner.id, "APPROVED")}
                            disabled={updatingId === partner.id}
                            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded"
                          >
                            {t("Approve", "อนุมัติ")}
                          </button>
                          <button
                            onClick={() => updatePartnerStatus(partner.id, "REJECTED")}
                            disabled={updatingId === partner.id}
                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded"
                          >
                            {t("Reject", "ปฏิเสธ")}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t("Withdrawal Requests (Pending)", "คำขอถอนเงิน (Pending)")}
        </h2>
        {withdrawals.length === 0 ? (
          <p className="text-sm text-gray-500">{t("No withdrawal requests.", "ไม่มีคำขอถอนเงิน")}</p>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((w) => (
              <div
                key={w.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-100 rounded-lg p-4"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {w.partner.user.firstName} {w.partner.user.lastName} ({w.partner.user.email})
                  </div>
                  <div className="text-sm text-gray-500">
                    ฿{formatCurrency(w.amount)} • {w.bankName} {w.bankAccount} ({w.bankHolder})
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 md:mt-0">
                  <button
                    onClick={() => updateWithdrawal(w.id, "COMPLETED")}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded"
                  >
                    {t("Paid", "จ่ายแล้ว")}
                  </button>
                  <button
                    onClick={() => updateWithdrawal(w.id, "REJECTED")}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded"
                  >
                    {t("Reject", "ปฏิเสธ")}
                  </button>
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
