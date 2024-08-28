import React from "react";
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
import { ModeToggle } from "../mode-toggle";
import AnimatedBackground from "@/components/animated-background";
import { RiUser3Line } from "react-icons/ri";
import { MdExitToApp } from "react-icons/md";

const ProfileButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = () => {
    signOut({ redirect: false, callbackUrl: "/" }).then(() => {
      router.refresh();
    });
  };

  const TABS = [
    {
      label: "Profile",
      icon: <RiUser3Line size={20} />,
      onClick: () => router.push("/profile"),
    },
    {
      label: "Sign out",
      icon: <MdExitToApp size={20} />,
      onClick: handleSignOut,
    },
  ];

  return (
    <Sheet>
      <SheetTrigger className="flex items-center">
        <Image
          src={session?.user?.image || "profile img"}
          alt={session?.user?.name || "profile name"}
          width={45}
          height={45}
          className="rounded-full cursor-pointer"
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
                onClick={tab.onClick}
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
        <SheetFooter className="absolute bottom-1.5 right-2">
          <ModeToggle />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileButton;
