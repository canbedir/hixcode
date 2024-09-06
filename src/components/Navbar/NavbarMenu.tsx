"use client";
import React from "react";
import AnimatedBackground from "../animated-background";
import { PiMailboxBold } from "react-icons/pi";
import { TbUpload } from "react-icons/tb";
import SignInButton from "../Navbar/SignInButton";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import UploadProjectsModal from "../UploadProjectsModal";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IoCodeSlash } from "react-icons/io5";
import { useRouter } from "next/navigation";

const NavbarMenu = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const TABS = [
    {
      icon: <IoCodeSlash />,
      onClick: () => router.push("/projects?sort=stars"),
    },
    {
      icon: <TbUpload />,
      onClick: () => setIsUploadModalOpen(true),
    },
    {
      icon: <PiMailboxBold />,
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <div>
        <Input className="hidden sm:flex" placeholder="Search..." />
        <Search className="flex sm:hidden" />
      </div>
      <div>
        <AnimatedBackground
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
              data-id={tab}
              type="button"
              onClick={tab.onClick}
              className={`p-2 text-zinc-600 transition-colors duration-300 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 ${
                !session ? "hidden" : ""
              }`}
            >
              {tab.icon}
            </button>
          ))}
        </AnimatedBackground>
      </div>
      <SignInButton />
      <UploadProjectsModal
        isOpen={isUploadModalOpen}
        setIsOpen={setIsUploadModalOpen}
      />
    </div>
  );
};

export default NavbarMenu;
