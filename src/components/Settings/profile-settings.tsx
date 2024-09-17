"use client";
import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners";
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

  if (status === "loading") {
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

  if (!session) {
    router.push('/');
    return null;
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
            <div className="cursor-pointer">
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

      <div className="w-2/3">
        <Label htmlFor="Bio">Bio</Label>
        <Textarea
          placeholder={bio || "Tell us about yourself"}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center w-2/3">
        <Button onClick={handleSave}>Save Profile</Button>
        <Button variant={"outline"} onClick={handleUpdateProfile}>
          Update Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
