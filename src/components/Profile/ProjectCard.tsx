import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Pin, PinOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LanguageBadge from "@/components/LanguageBadge";

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
    <Card className="flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
      <CardContent className="flex flex-col min-h-[300px] md:min-h-[350px] max-h-[400px] justify-between h-full p-4 md:p-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl md:text-2xl font-semibold">{project.title}</h3>
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
          <LanguageBadge
            language={project.mostPopularLanguage}
            className="text-xs"
          />
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {project.technicalDetails}
          </span>
        </div>

        <div className="flex justify-between items-center mt-4">
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
