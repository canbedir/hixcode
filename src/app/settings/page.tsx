"use client";
import ProfileSettings from "@/components/Settings/profile-settings";
import SettingsSidebar from "@/components/Settings/settings-sidebar";
import ThemeSettings from "@/components/Settings/theme-settings";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";

const SettingsPage = () => {
  const { data: session, status } = useSession();
  const [selectedTab, setSelectedTab] = useState("Profile");

  if (status === "loading" || !session) {
    return (
      <div className="relative h-screen">
        <div
          className="flex justify-center items-center"
          style={{ height: "calc(100% - 160px)" }}
        >
          <ClipLoader color="#b5b5b5" size={100} />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (selectedTab) {
      case "Profile":
        return <ProfileSettings />;
      case "Theme":
        return <ThemeSettings />;

      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="flex m-20 gap-10">
      <div className="w-1/4">
        <SettingsSidebar
          setSelectedTab={setSelectedTab}
          selectedTab={selectedTab}
        />
      </div>
      <div className="flex-1 p-5">{renderContent()}</div>
    </div>
  );
};

export default SettingsPage;
