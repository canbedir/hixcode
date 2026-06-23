"use client";
import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

const ProfileSettings: React.FC = () => {
  const { data: session, status, update } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bio, setBio] = useState("");
  const [user, setUser] = useState(session?.user);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      setUser(session.user);
      axios
        .get("/api/profile")
        .then((response) => {
          setBio(response.data.bio || "");
        })
        .catch((error) => {
          console.error("Failed to fetch profile settings:", error);
        })
        .finally(() => {
          setIsLoadingProfile(false);
        });
    }
  }, [session]);

  const handleSave = async () => {
    try {
      await axios.post("/api/profile", { bio });
      toast({
        title: "Profile settings updated successfully",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to update bio:", error);
      toast({
        title: "Failed to update bio",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('/api/update-profile', { method: 'POST' });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        await update({ ...session, user: updatedUser });
        toast({
          title: "Profile updated successfully",
          variant: "success",
          duration: 3000,
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Failed to update profile",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  if (status === "loading" || isLoadingProfile) {
    return (
      <div className="flex flex-col gap-5 p-4 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="grid w-full max-w-sm items-center gap-5">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <Skeleton className="h-[170px] w-[170px] rounded-full" />
        </div>

        <div className="w-full md:w-2/3 flex flex-col gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-20 w-full" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between w-full md:w-2/3 gap-3">
          <Skeleton className="h-10 w-full sm:w-32" />
          <Skeleton className="h-10 w-full sm:w-32" />
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/');
    return null;
  }

  return (
    <div className="flex flex-col gap-5 p-4 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="grid w-full max-w-sm items-center gap-5">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              disabled
              placeholder={user?.name || "profile name"}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              disabled
              placeholder={user?.email || "profile email"}
            />
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="cursor-pointer mt-4 md:mt-0">
              <Image
                src={user?.image || "profile img"}
                alt={user?.name || "profile name"}
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

      <div className="w-full md:w-2/3">
        <Label htmlFor="Bio">Bio</Label>
        <Textarea
          placeholder={bio || "Tell us about yourself"}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center w-full md:w-2/3 gap-3">
        <Button onClick={handleSave} className="w-full sm:w-auto">Save Profile</Button>
        <Button variant={"outline"} onClick={handleUpdateProfile} className="w-full sm:w-auto">
          Update Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
