import { Avatar } from "../ui/Avatar.jsx";
import { formatMonthYear, capitalize } from "../../utils/format.js";

// ==========================================
// ProfileHeader — avatar + name + email + metadata
// ==========================================
export const ProfileHeader = ({ user }) => {
  if (!user) return null;

  const isAdmin = user.role === "admin";

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        {/* Avatar */}
        <Avatar user={user} size="lg" className="shrink-0" />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
            <h2 className="text-2xl font-bold text-neutral-900 truncate">
              {user.name}
            </h2>
            <span
              className={`
                text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide
                ${
                  isAdmin
                    ? "bg-primary-100 text-primary-700"
                    : "bg-neutral-100 text-neutral-600"
                }
              `}
            >
              {capitalize(user.role)}
            </span>
          </div>

          <p className="text-neutral-500 mt-1 truncate">{user.email}</p>

          <p className="text-sm text-neutral-400 mt-3">
            Member since {formatMonthYear(user.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};