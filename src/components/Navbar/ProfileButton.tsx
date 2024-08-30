import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import AnimatedBackground from "@/components/animated-background";
import { RiUser3Line } from "react-icons/ri";
import { MdExitToApp } from "react-icons/md";
import { Settings } from "lucide-react";
import { Upload } from "lucide-react";
import UploadProjectsModal from "../UploadProjectsModal";

const ProfileButton = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ redirect: false, callbackUrl: "/" }).then(() => {
      router.refresh();
    });
  };

  const handleTabClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  const TABS = [
    {
      label: "Upload Projects",
      icon: <Upload size={20} />,
      onClick: () => setIsUploadModalOpen(true),
    },
    {
      label: "Profile",
      icon: <RiUser3Line size={20} />,
      onClick: () => router.push("/profile"),
    },
    {
      label: "Settings",
      icon: <Settings size={20} />,
      onClick: () => router.push("/settings"),
    },
    {
      label: "Sign out",
      icon: <MdExitToApp size={20} />,
      onClick: handleSignOut,
    },
  ];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="flex items-center">
          <Image
            src={session?.user?.image || "profile img"}
            alt={session?.user?.name || "profile name"}
            width={35}
            height={35}
            className="rounded-full cursor-pointer hover:scale-110 duration-300"
          />
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Image
                src={session?.user?.image || "profile img"}
                alt={session?.user?.name || "profile name"}
                width={35}
                height={35}
                className="rounded-full"
              />
              <h1 className="text-sm">{session?.user?.name}</h1>
            </SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-1">
            <AnimatedBackground
              defaultValue={TABS[0].label}
              className="rounded-lg bg-zinc-100 dark:bg-zinc-800"
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
                  onClick={() => handleTabClick(tab.onClick)}
                  className="p-2 text-zinc-600 transition-colors duration-300 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 flex items-center"
                >
                  <div className="flex items-center gap-2">
                    {tab.icon}
                    {tab.label}
                  </div>
                </button>
              ))}
            </AnimatedBackground>
          </div>
        </SheetContent>
      </Sheet>
      <UploadProjectsModal isOpen={isUploadModalOpen} setIsOpen={setIsUploadModalOpen} />
    </>
  );
};

export default ProfileButton;
