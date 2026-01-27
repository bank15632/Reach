export const ADMIN_PERMISSION_KEYS = [
    'VIEW_DASHBOARD',
    'MANAGE_PRODUCTS',
    'MANAGE_ORDERS',
    'MANAGE_USERS',
    'MANAGE_PARTNERS',
    'MANAGE_ARTICLES',
    'MANAGE_AUCTIONS',
] as const;

export type AdminPermissionKey = typeof ADMIN_PERMISSION_KEYS[number];

export const ADMIN_PERMISSIONS = [
    { key: 'VIEW_DASHBOARD', label: 'Dashboard', labelTh: 'แดชบอร์ด' },
    { key: 'MANAGE_PRODUCTS', label: 'Products', labelTh: 'สินค้า' },
    { key: 'MANAGE_ORDERS', label: 'Orders', labelTh: 'คำสั่งซื้อ' },
    { key: 'MANAGE_USERS', label: 'Users', labelTh: 'ผู้ใช้' },
    { key: 'MANAGE_PARTNERS', label: 'Partners', labelTh: 'พาร์ทเนอร์' },
    { key: 'MANAGE_ARTICLES', label: 'Articles', labelTh: 'บทความ' },
    { key: 'MANAGE_AUCTIONS', label: 'Auctions', labelTh: 'ประมูล' },
];

export type AdminRole = 'USER' | 'PARTNER' | 'ADMIN' | 'SUPER_ADMIN';

export function isAdminRole(role?: string | null): boolean {
    return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export function isSuperAdmin(role?: string | null): boolean {
    return role === 'SUPER_ADMIN';
}

export function hasAdminPermission(
    role: string | null | undefined,
    permissions: readonly string[] | null | undefined,
    permission: AdminPermissionKey
): boolean {
    if (isSuperAdmin(role)) {
        return true;
    }
    if (role !== 'ADMIN') {
        return false;
    }
    return permissions?.includes(permission) ?? false;
}
