import React, { useState, useEffect } from "react";
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

interface ProjectDetailsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (
    title: string,
    description: string,
    technicalDetails: string,
    liveUrl: string
  ) => void;
  onCancel: () => void;
  initialTitle: string;
  initialDescription: string;
  initialTechnicalDetails: string;
  initialLiveUrl: string;
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
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [technicalDetails, setTechnicalDetails] = useState(
    initialTechnicalDetails
  );
  const [liveUrl, setLiveUrl] = useState(initialLiveUrl);

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setTechnicalDetails(initialTechnicalDetails);
    setLiveUrl(initialLiveUrl);
  }, [
    initialTitle,
    initialDescription,
    initialTechnicalDetails,
    initialLiveUrl,
  ]);

  const handleSave = () => {
    if (title.trim() && description.trim() && technicalDetails.trim()) {
      onSave(title, description, technicalDetails, liveUrl);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
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
            <Label>Technical Details</Label>
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
        </div>
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="w-2/3"
            onClick={handleSave}
            disabled={
              !title.trim() || !description.trim() || !technicalDetails.trim()
            }
          >
            Save Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
