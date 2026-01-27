'use client';

import { ReactNode } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { AdminPermissionKey, hasAdminPermission } from '@/lib/adminAccess';

interface AdminGuardProps {
    permission: AdminPermissionKey;
    children: ReactNode;
}

export default function AdminGuard({ permission, children }: AdminGuardProps) {
    const { language } = useLanguage();
    const { userProfile, isLoading } = useUser();
    const t = (en: string, th: string) => (language === 'th' ? th : en);

    if (isLoading) {
        return (
            <div className="py-16 text-center text-gray-500">
                {t('Loading...', 'กำลังโหลด...')}
            </div>
        );
    }

    const canAccess = hasAdminPermission(
        userProfile?.role,
        userProfile?.adminPermissions,
        permission
    );

    if (!canAccess) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-600">
                <p className="font-semibold text-gray-900">
                    {t('Access denied', 'ไม่มีสิทธิ์เข้าถึง')}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    {t('Ask a super admin to grant access.', 'กรุณาติดต่อแอดมินสูงสุดเพื่อขอสิทธิ์')}
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
