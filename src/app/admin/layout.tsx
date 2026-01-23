import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
    title: 'Admin - Reach',
    description: 'Reach Admin Dashboard',
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    // Check if user is logged in and is admin
    if (!user) {
        redirect('/login?redirect=/admin');
    }

    if (user.role !== 'ADMIN') {
        redirect('/?error=unauthorized');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar />

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen">
                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
