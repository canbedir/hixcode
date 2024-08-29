"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

const ProfileSettings = () => {
  const { data: session, status } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = () => {
    // Implement save logic here
    setIsDialogOpen(false);
  };

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

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="grid w-full max-w-sm items-center gap-5">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              disabled
              placeholder={session?.user?.name || "profile name"}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              disabled
              placeholder={session?.user?.email || "profile email"}
            />
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="cursor-pointer">
              <Image
                src={session?.user?.image || "profile img"}
                alt={session?.user?.name || "profile name"}
                width={170}
                height={150}
                className="rounded-full"
              />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Coming soon!</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-2/3">
        <Label htmlFor="Bio">Bio</Label>
        <Textarea placeholder="Tell us a bit about yourself" />
      </div>

      <div>
        <Button>Save Profile</Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
