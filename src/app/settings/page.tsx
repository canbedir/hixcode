"use client";
import SettingsSidebar from "@/components/Settings/settings-sidebar";
import TestSettings from "@/components/Settings/test-settings";
import ThemeSettings from "@/components/Settings/theme-settings";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";

const SettingsPage = () => {
  const { data: session, status } = useSession();
  const [selectedTab, setSelectedTab] = useState("Apperance");

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
      case "Appearance":
        return <ThemeSettings />;
        case "Test":
        return <TestSettings />;
      default:
        return <ThemeSettings />;
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
