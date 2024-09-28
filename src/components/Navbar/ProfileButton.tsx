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
import UploadProjectsModal from "../UploadProjectsModal";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface SignOutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SignOutConfirmationModal: React.FC<SignOutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => (
  <AlertDialog open={isOpen} onOpenChange={onClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
        <AlertDialogDescription>
          You will be logged out of your account.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
        <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm}>Sign out</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const ProfileButton = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

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
      label: "Profile",
      icon: <RiUser3Line size={20} />,
      onClick: async () => {
        try {
          const response = await fetch("/api/user");
          const userData = await response.json();
          if (userData.username) {
            router.push(`/${userData.username}`);
          } else {
            console.error("Username not found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      },
    },
    {
      label: "Settings",
      icon: <Settings size={20} />,
      onClick: () => router.push("/settings"),
    },
    {
      label: "Sign out",
      icon: <MdExitToApp size={20} />,
      onClick: () => setIsSignOutModalOpen(true),
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
      <UploadProjectsModal
        isOpen={isUploadModalOpen}
        setIsOpen={setIsUploadModalOpen}
      />
      <SignOutConfirmationModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={handleSignOut}
      />
    </>
  );
};

export default ProfileButton;
