import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth.js";
import { adminApi } from "../../api/admin.api.js";
import { Section } from "../../components/ui/Section.jsx";
import { Pagination } from "../../components/ui/Pagination.jsx";
import { UsersTable } from "../../components/admin/UsersTable.jsx";

const PAGE_SIZE = 10;

export default function AdminUsers() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // Fetch users when page changes
  // ==========================================
  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getUsers({ page, limit: PAGE_SIZE });
        if (cancelled) return;
        setUsers(res.data.data.users);
        setPagination(res.data.data.pagination);
      } catch (err) {
        if (cancelled) return;
        const message =
          err.response?.data?.message || "Failed to load users";
        toast.error(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [page]);

  // ==========================================
  // Row action handlers (functional in 15.5/15.6)
  // ==========================================
  const handleEdit = (targetUser) => {
    console.log("Edit:", targetUser);
    toast("Edit user — coming in Sub-step 15.5", { icon: "🚧" });
  };

  const handleDelete = (targetUser) => {
    console.log("Delete:", targetUser);
    toast("Delete user — coming in Sub-step 15.6", { icon: "🚧" });
  };

  // ==========================================
  // Render
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-neutral-900">
          User Management
        </h1>
        <p className="mt-1 text-neutral-600">
          {pagination
            ? `${pagination.total} user${pagination.total === 1 ? "" : "s"} in total`
            : "Loading users..."}
        </p>
      </div>

      {/* ==========================================
          TABLE
      ========================================== */}
      <Section noBorder className="!p-0 overflow-hidden">
        <UsersTable
          users={users}
          loading={loading}
          currentUserId={user?._id}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* ==========================================
            PAGINATION
        ========================================== */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <div className="border-t border-neutral-100 px-4 py-4">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              hasNext={pagination.hasNext}S
              hasPrev={pagination.hasPrev}
              onPageChange={setPage}
            />
          </div>
        )}
      </Section>
    </div>
  );
}