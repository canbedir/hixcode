import React from "react";
import AnimatedBackground from "../animated-background";
import { PiMailboxBold } from "react-icons/pi";
import { TbUpload } from "react-icons/tb";
import SignInButton from "../Navbar/SignInButton";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

const NavbarMenu = () => {
  const TABS = [
    {
      icon: <TbUpload />,
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
              className="p-2 text-zinc-600 transition-colors duration-300 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {tab.icon}
            </button>
          ))}
        </AnimatedBackground>
      </div>
      <SignInButton />
    </div>
  );
};

export default NavbarMenu;
