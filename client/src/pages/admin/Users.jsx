import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { adminApi } from "../../api/admin.api.js";
import { Section } from "../../components/ui/Section.jsx";
import { Pagination } from "../../components/ui/Pagination.jsx";
import { UsersTable } from "../../components/admin/UsersTable.jsx";
import { UsersFilters } from "../../components/admin/UsersFilters.jsx";
import { EditUserModal } from "../../components/admin/EditUserModal.jsx";

const PAGE_SIZE = 10;

export default function AdminUsers() {
  const { user } = useAuth();

  // ---- Data state ----
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---- Filters ----
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);

  // ---- Modal state ----
  const [editingUser, setEditingUser] = useState(null);

  // ---- Debounced search ----
  const debouncedSearch = useDebounce(search, 400);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter]);

  // Fetch users
  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      try {
        setLoading(true);

        const params = { page, limit: PAGE_SIZE };
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (roleFilter !== "all") params.role = roleFilter;

        const res = await adminApi.getUsers(params);
        if (cancelled) return;

        setUsers(res.data.data.users);
        setPagination(res.data.data.pagination);
      } catch (err) {
        if (cancelled) return;
        toast.error(err.response?.data?.message || "Failed to load users");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUsers();
    return () => { cancelled = true; };
  }, [page, debouncedSearch, roleFilter]);

  // ---- Row actions ----
  const handleEdit = (targetUser) => {
    setEditingUser(targetUser);
  };

  const handleDelete = (targetUser) => {
    toast(`Delete ${targetUser.name} — coming in Sub-step 15.6`, {
      icon: "🚧",
    });
  };

  // Called after successful edit
  const handleEditSuccess = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
    );
  };

  const getCountText = () => {
    if (!pagination) return "Loading users...";
    const { total } = pagination;
    if (total === 0) return "No users found";
    return `${total} user${total === 1 ? "" : "s"} found`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-neutral-900">User Management</h1>
        <p className="mt-1 text-neutral-600">{getCountText()}</p>
      </div>

      {/* Filters */}
      <div className="mb-5">
        <UsersFilters
          search={search}
          onSearchChange={setSearch}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
        />
      </div>

      {/* Table + Pagination */}
      <Section noBorder className="!p-0 overflow-hidden">
        <UsersTable
          users={users}
          loading={loading}
          currentUserId={user?._id}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {!loading && pagination && pagination.totalPages > 1 && (
          <div className="border-t border-neutral-100 px-4 py-4">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
              onPageChange={setPage}
            />
          </div>
        )}
      </Section>

      {/* Edit User Modal */}
      <EditUserModal
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        currentUserId={user?._id}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}