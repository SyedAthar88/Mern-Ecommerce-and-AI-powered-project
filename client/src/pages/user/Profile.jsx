import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { Tabs } from "../../components/ui/Tabs.jsx";
import { ProfileHeader } from "../../components/user/ProfileHeader.jsx";
import { ProfileInfoForm } from "../../components/user/ProfileInfoForm.jsx";
import { ChangePasswordForm } from "../../components/user/ChangePasswordForm.jsx";

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
      {/* Page header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-neutral-900">Profile</h1>
        <p className="mt-1 text-neutral-600">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      <div className="mt-8 space-y-6">
        {activeTab === "info" && (
          <>
            <ProfileHeader user={user} />
            <ProfileInfoForm />
          </>
        )}

        {activeTab === "password" && <ChangePasswordForm />}
      </div>
    </div>
  );
}