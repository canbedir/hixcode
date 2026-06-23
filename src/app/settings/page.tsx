"use client";
import ProfileSettings from "@/components/Settings/profile-settings";
import SettingsSidebar from "@/components/Settings/settings-sidebar";
import ThemeSettings from "@/components/Settings/theme-settings";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const SettingsPage = () => {
  const { data: session, status } = useSession();
  const [selectedTab, setSelectedTab] = useState("Profile");

  if (status === "loading" || !session) {
    return (
      <div className="flex flex-col lg:flex-row m-4 lg:m-20 gap-10">
        <div className="hidden lg:flex lg:w-1/4 flex-col gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1 p-5 flex flex-col gap-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-10 w-32" />
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
    <div className="flex flex-col lg:flex-row m-4 lg:m-20 gap-10 relative">
      <Sheet>
        <SheetTrigger asChild>
          <button className="lg:hidden absolute -top-10 -left-5 m-4 text-2xl">
            <Menu />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] sm:w-[300px]">
          <SettingsSidebar
            setSelectedTab={setSelectedTab}
            selectedTab={selectedTab}
            isMobile={true}
          />
        </SheetContent>
      </Sheet>
      <div className="hidden lg:block lg:w-1/4">
        <SettingsSidebar
          setSelectedTab={setSelectedTab}
          selectedTab={selectedTab}
          isMobile={false}
        />
      </div>
      <div className="flex-1 p-5">{renderContent()}</div>
    </div>
  );
};

export default SettingsPage;
