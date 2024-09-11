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

interface ProjectDetailsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (title: string, description: string, technicalDetails: string) => void;
  onCancel: () => void;
  initialTitle: string;
  initialDescription: string;
  initialTechnicalDetails: string;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  isOpen,
  setIsOpen,
  onSave,
  onCancel,
  initialTitle,
  initialDescription,
  initialTechnicalDetails,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [technicalDetails, setTechnicalDetails] = useState(initialTechnicalDetails);

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setTechnicalDetails(initialTechnicalDetails);
  }, [initialTitle, initialDescription, initialTechnicalDetails]);

  const handleSave = () => {
    if (title.trim() && description.trim() && technicalDetails.trim()) {
      onSave(title, description, technicalDetails);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Project Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-4"
              placeholder="Project Title"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-4 max-h-[200px]"
              placeholder="Project Description"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Textarea
              id="technicalDetails"
              value={technicalDetails}
              onChange={(e) => setTechnicalDetails(e.target.value)}
              className="col-span-4 max-h-[200px]"
              placeholder="Technical Details"
              required
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
            disabled={!title.trim() || !description.trim() || !technicalDetails.trim()}
          >
            Save Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
