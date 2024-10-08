import React, { useState, useEffect, KeyboardEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "./ui/label";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Loader2 } from "lucide-react";

interface ProjectDetailsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (
    title: string,
    description: string,
    technicalDetails: string,
    liveUrl: string,
    technologies: string[],
    contributors: { name: string; githubUrl: string; image: string }[]
  ) => void;
  onCancel: () => void;
  initialTitle: string;
  initialDescription: string;
  initialTechnicalDetails: string;
  initialLiveUrl: string;
  initialTechnologies: string[];
  initialMostPopularLanguage: string;
  initialContributors: { name: string; githubUrl: string; image: string }[];
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  isOpen,
  setIsOpen,
  onSave,
  onCancel,
  initialTitle,
  initialDescription,
  initialTechnicalDetails,
  initialLiveUrl,
  initialTechnologies,
  initialMostPopularLanguage,
  initialContributors,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [technicalDetails, setTechnicalDetails] = useState(
    initialTechnicalDetails
  );
  const [liveUrl, setLiveUrl] = useState(initialLiveUrl);
  const { data: session } = useSession();
  const { toast } = useToast();
  const [technologies, setTechnologies] = useState<string[]>(
    [initialMostPopularLanguage, ...(initialTechnologies || [])].slice(0, 6)
  );
  const [currentTech, setCurrentTech] = useState("");
  const [contributors, setContributors] =
    useState<{ name: string; githubUrl: string; image: string }[]>(
      initialContributors
    );
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setTechnicalDetails(initialTechnicalDetails);
      setLiveUrl(initialLiveUrl);
      setTechnologies(
        [initialMostPopularLanguage, ...(initialTechnologies || [])].slice(0, 6)
      );
      setCurrentTech("");
      setContributors(initialContributors);
    }
  }, [isOpen, initialContributors]);

  useEffect(() => {
    if (!isOpen) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setTechnicalDetails(initialTechnicalDetails);
      setLiveUrl(initialLiveUrl);
      setTechnologies(
        [initialMostPopularLanguage, ...(initialTechnologies || [])].slice(0, 6)
      );
    }
  }, [
    initialTitle,
    initialDescription,
    initialTechnicalDetails,
    initialLiveUrl,
    initialTechnologies,
    initialMostPopularLanguage,
  ]);

  const handleTechKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " && currentTech.trim() && technologies.length < 6) {
      e.preventDefault();
      const trimmedTech = currentTech.trim();
      if (!technologies.includes(trimmedTech)) {
        setTechnologies([...technologies, trimmedTech]);
        setCurrentTech("");
      }
    } else if (e.key === " " && technologies.length >= 6) {
      e.preventDefault();
    } else if (
      e.key === "Backspace" &&
      currentTech === "" &&
      technologies.length > 1
    ) {
      e.preventDefault();
      const newTechnologies = [...technologies];
      newTechnologies.pop();
      setTechnologies(newTechnologies);
    }
  };

  const handleTechChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTech(e.target.value.trimStart());
  };

  const handleSave = async () => {
    if (title.trim() && description.trim() && technicalDetails.trim()) {
      setIsUploading(true);
      try {
        await onSave(
          title,
          description,
          technicalDetails,
          liveUrl,
          technologies,
          contributors
        );

        const badgeResponse = await fetch("/api/check-badges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: session?.user?.email }),
        });

        const badgeData = await badgeResponse.json();

        if (badgeData.newBadges && badgeData.newBadges.length > 0) {
          toast({
            title: "Yeni Rozet Kazanıldı!",
            description: `${badgeData.newBadges[0].name} rozetini kazandınız!`,
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Rozetleri kontrol ederken hata:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[425px] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Project Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-1">
            <Label>Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-4"
              placeholder="hixCode  "
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-4 max-h-[200px]"
              placeholder="A tool where you can showcase your GitHub projects!"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Technical Details Description</Label>
            <Textarea
              id="technicalDetails"
              value={technicalDetails}
              onChange={(e) => setTechnicalDetails(e.target.value)}
              className="col-span-4 max-h-[200px]"
              placeholder="Hixcode was made using Next.js, TailwindCSS and ShadcnUI."
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Live URL</Label>
            <Input
              id="liveUrl"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="col-span-4"
              placeholder="https://hixcode.vercel.app"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Technologies Used (Max 6)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {technologies.map((tech, index) => (
                <span
                  key={index}
                  className={`bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-sm ${
                    index === 0 ? "opacity-60" : ""
                  }`}
                >
                  {tech}
                  {index !== 0 && (
                    <button
                      onClick={() => {
                        const newTechnologies = technologies.filter(
                          (_, i) => i !== index
                        );
                        setTechnologies(newTechnologies);
                      }}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            <Input
              id="technologies"
              value={currentTech}
              onChange={(e) => setCurrentTech(e.target.value.toLowerCase())}
              onKeyDown={handleTechKeyDown}
              className="col-span-4"
              placeholder="Add technologies (press space to add)"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Contributors</Label>
            <div className="flex flex-wrap gap-1">
              {contributors.slice(0, 6).map((contributor, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger>
                    <div className="flex items-center p-1 rounded-full cursor-pointer">
                      <Image
                        src={contributor.image || "/default-avatar.png"}
                        alt={contributor.name || "Unknown"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent
                    className="w-auto"
                    side="top"
                    align="center"
                  >
                    <div className="flex flex-col items-center">
                      <Image
                        src={contributor.image || "/default-avatar.png"}
                        alt={contributor.name || "Unknown"}
                        width={48}
                        height={48}
                        className="rounded-full mb-2"
                      />
                      <span className="font-medium">
                        {contributor.name || "Unknown"}
                      </span>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
              {contributors.length > 6 && (
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <span className="text-sm font-medium">
                    +{contributors.length - 6}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="w-2/5"
            onClick={handleSave}
            disabled={
              !title.trim() ||
              !description.trim() ||
              !technicalDetails.trim() ||
              isUploading
            }
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Upload Project"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
