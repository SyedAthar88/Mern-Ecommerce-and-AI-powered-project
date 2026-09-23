import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { Tabs } from "../../components/ui/Tabs.jsx";
import { ProfileHeader } from "../../components/user/ProfileHeader.jsx";
import { ProfileInfoForm } from "../../components/user/ProfileInfoForm.jsx";

// ==========================================
// Profile page — tabs for info + password
// ==========================================
export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: "Profile Info" },
    { id: "password", label: "Change Password" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-neutral-900">Profile</h1>
        <p className="mt-1 text-neutral-600">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* ==========================================
          TABS
      ========================================== */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* ==========================================
          TAB CONTENT
      ========================================== */}
      <div className="mt-8 space-y-6">
        {activeTab === "info" && (
          <>
            <ProfileHeader user={user} />
            <ProfileInfoForm />
          </>
        )}

        {activeTab === "password" && (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-8 text-center text-neutral-500">
            <p className="text-sm">Change password form coming in Phase 14.5</p>
          </div>
        )}
      </div>
    </div>
  );
}