import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { RiUser3Line } from "react-icons/ri";
import { MdExitToApp } from "react-icons/md";

const ProfileButton = () => {
  const { data: session } = useSession();

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
        <DropdownMenuSeparator />
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
          >
            <MdExitToApp size={18} /> Sign out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileButton;
