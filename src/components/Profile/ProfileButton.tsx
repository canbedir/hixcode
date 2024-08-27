import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { RiUser3Line } from "react-icons/ri";
import { MdExitToApp } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { ModeToggle } from "../mode-toggle";

const ProfileButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = () => {
    signOut({ redirect: false, callbackUrl: "/" }).then(() => {
      router.refresh();
    });
  };

  const { setTheme } = useTheme();

  return (
    <Sheet>
      <SheetTrigger className="flex items-center" asChild>
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
        <div className="grid grid-cols-1 gap-1">
          <Button
            variant={"sheet"}
            size={"sheet"}
            className="w-full flex items-center justify-start px-2 gap-2"
          >
            <RiUser3Line size={18} /> Profile
          </Button>
          <Button
            variant={"sheet"}
            size={"sheet"}
            className="w-full flex items-center justify-start px-2 gap-2"
            onClick={handleSignOut}
          >
            <MdExitToApp size={18} /> Sign out
          </Button>
        </div>
        <SheetFooter className="absolute bottom-1.5 right-2">
          <ModeToggle/>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileButton;
