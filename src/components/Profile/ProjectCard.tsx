import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Pin, PinOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    stars: number;
    mostPopularLanguage: string;
    technicalDetails: string | null;
    isPinned: boolean;
  };
  onPin: (projectId: string) => void;
  isPinDisabled: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPin, isPinDisabled }) => {
  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex flex-col min-h-[350px] max-h-[400px] justify-between h-full p-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-2xl font-semibold">{project.title}</h3>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => onPin(project.id)} 
              disabled={isPinDisabled && !project.isPinned}
            >
              {project.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow text-sm">
            {project.description}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="bg-black dark:bg-white dark:text-black text-white px-2 py-1 rounded-full text-xs w-fit">
            {project.mostPopularLanguage}
          </span>
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {project.technicalDetails}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Star className="h-4 w-4" />
            {project.stars}
          </span>
          <Link href={`/projects/${project.id}`}>
            <Button size="sm">View Project</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
