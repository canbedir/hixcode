import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { IoColorPaletteOutline } from "react-icons/io5";
import AnimatedBackground from "../animated-background";
import { IoMdPerson } from "react-icons/io";

const SettingsSidebar = ({
  setSelectedTab,
  selectedTab,
  isMobile,
}: {
  setSelectedTab: (tab: string) => void;
  selectedTab: string;
  isMobile: boolean;
}) => {
  const { data: session } = useSession();

  const TABS = [
    {
      label: "Profile",
      icon: <IoMdPerson size={20} />,
    },
    {
      label: "Theme",
      icon: <IoColorPaletteOutline size={20} />,
    },
  ];

  return (
    <div className={`bg-background p-4 rounded-lg shadow-md ${isMobile ? 'w-full' : 'w-full lg:w-64'}`}>
      <div className="flex flex-col">
        {!isMobile && (
          <div className="flex items-center gap-2 mb-6">
            <Image
              src={session?.user?.image as string}
              alt={session?.user?.name as string}
              width={45}
              height={45}
              className="rounded-full cursor-pointer"
            />
            <span className="font-semibold">{session?.user?.name as string}</span>
          </div>
        )}
        <div className="grid grid-cols-1 gap-2">
          <AnimatedBackground
            defaultValue={TABS[0].label}
            className="rounded-md bg-zinc-100 dark:bg-primary-foreground"
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.3,
            }}
            enableHover
          >
            {TABS.map((tab, index) => (
              <button
                key={index}
                data-id={tab.label}
                type="button"
                onClick={() => setSelectedTab(tab.label)}
                className={`p-2 text-zinc-600 transition-colors duration-300 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 flex items-center justify-start rounded-md ${
                  selectedTab === tab.label ? "bg-primary-foreground" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </div>
              </button>
            ))}
          </AnimatedBackground>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
