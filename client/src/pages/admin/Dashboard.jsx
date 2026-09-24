import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth.js";
import { adminApi } from "../../api/admin.api.js";
import { Section } from "../../components/ui/Section.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { StatCard } from "../../components/user/StatCard.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Skeleton } from "../../components/ui/Skeleton.jsx";
import { formatDate } from "../../utils/format.js";

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);


    // ==========================================
    // Fetch dashboard data on mount
    // ==========================================
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [statsRes, usersRes] = await Promise.all([
                    adminApi.getStats(),
                    adminApi.getUsers(),
                ]);

                setStats(statsRes.data.data.stats);

                const allUsers = usersRes.data.data.users || [];
                setRecentUsers(allUsers.slice(0, 5));
            } catch (err) {
                const message =
                    err.response?.data?.message || "Failed to load dashboard data";
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* ==========================================
          HEADER
      ========================================== */}
            <div className="mb-10 animate-fade-in">
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
                    Admin Dashboard
                </h1>
                <p className="mt-2 text-neutral-600">
                    Welcome, {user?.name}. Here&apos;s an overview of your platform.
                </p>
            </div>

            {/* ==========================================
          STAT CARDS
      ========================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                {loading ? (
                    <>
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                    </>
                ) : (
                    <>
                        <StatCard
                            icon={<UsersIcon />}
                            title="Total Users"
                            value={stats?.totalUsers ?? 0}
                            subtitle="Regular accounts"
                            actionLabel="View"
                            actionTo="/admin/users"
                            accent="primary"
                        />
                        <StatCard
                            icon={<ShieldIcon />}
                            title="Admins"
                            value={stats?.totalAdmins ?? 0}
                            subtitle="Elevated access"
                            actionLabel="Manage"
                            actionTo="/admin/users"
                            accent="success"
                        />
                        <StatCard
                            icon={<ChartIcon />}
                            title="Total Accounts"
                            value={stats?.totalAccounts ?? 0}
                            subtitle="Users + Admins"
                            accent="neutral"
                        />
                    </>
                )}
            </div>

            {/* ==========================================
          QUICK ACTIONS
      ========================================== */}
            <Section
                title="Quick Actions"
                subtitle="Common admin tasks"
                className="mb-10"
            >
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="primary"
                        onClick={() => navigate("/admin/users")}
                        leftIcon={<UsersIcon />}
                    >
                        Manage Users
                    </Button>
                    <Button variant="secondary" disabled leftIcon={<PackageIcon />}>
                        Manage Products (soon)
                    </Button>
                    <Button variant="secondary" disabled leftIcon={<ShoppingBagIcon />}>
                        Manage Orders (soon)
                    </Button>
                </div>
            </Section>

            {/* ==========================================
          RECENT SIGNUPS
      ========================================== */}
            <Section
                title="Recent Signups"
                subtitle="The 5 most recently registered users"
                actions={
                    <Link to="/admin/users">
                        <Button variant="ghost" size="sm">
                            View all →
                        </Button>
                    </Link>
                }
            >
                {loading ? (
                    <ListSkeleton />
                ) : recentUsers.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500 text-sm">
                        No users yet.
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-100">
                        {recentUsers.map((u) => (
                            <div key={u._id} className="flex items-center gap-4 py-3">
                                <Avatar user={u} size="md" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-neutral-900 truncate">
                                            {u.name}
                                        </p>
                                        <Badge
                                            variant={u.role === "admin" ? "primary" : "neutral"}
                                        >
                                            {u.role}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-neutral-500 truncate">
                                        {u.email}
                                    </p>
                                </div>
                                <div className="text-xs text-neutral-400 whitespace-nowrap hidden sm:block">
                                    {formatDate(u.createdAt)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Section>

          
            
        </div>
    );
}

// ==========================================
// Skeleton placeholders
// ==========================================
const CardSkeleton = () => (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-6">
        <Skeleton variant="circular" className="w-10 h-10 mb-4" />
        <Skeleton variant="text" className="w-24 mb-2" />
        <Skeleton className="h-8 w-16 mb-3" />
        <Skeleton variant="text" className="w-32" />
    </div>
);

const ListSkeleton = () => (
    <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
                <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="w-32" />
                    <Skeleton variant="text" className="w-48" />
                </div>
            </div>
        ))}
    </div>
);

// ==========================================
// Inline icons
// ==========================================
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
    </svg>
);

const PackageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
);

const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);