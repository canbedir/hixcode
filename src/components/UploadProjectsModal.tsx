import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "./ui/input";

interface UploadProjectsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const UploadProjectsModal: React.FC<UploadProjectsModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<any[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const [existingProjects, setExistingProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!session?.accessToken) return;

    async function fetchRepos() {
      const response = await fetch(
        `/api/github-repos?accessToken=${session?.accessToken}`
      );
      const data = await response.json();
      const filteredRepos = data.filter((repo: any) => 
        !existingProjects.some(project => project.githubUrl === repo.html_url)
      );
      setRepos(filteredRepos);
    }

    fetchRepos();
  }, [session?.accessToken, existingProjects]);

  useEffect(() => {
    if (!session?.user?.email) return;
    async function fetchExistingProjects() {
      if (session?.user?.email) {
        const response = await fetch(`/api/user-projects?email=${session.user.email}`);
        const data = await response.json();
        setExistingProjects(data);
      }
    }

    fetchExistingProjects();
  }, [session?.user?.email]);

  const handleSelectRepo = (repo: any) => {
    if (selectedRepos.some((r) => r.id === repo.id)) {
      setSelectedRepos(selectedRepos.filter((r) => r.id !== repo.id));
    } else {
      setSelectedRepos([...selectedRepos, repo]);
    }
  };

  const handleSubmit = async () => {
    if (selectedRepos.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one repository.",
        variant: "destructive",
      });
      return;
    }

    const response = await fetch("/api/save-projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repos: selectedRepos }),
    });

    const data = await response.json();

    if (data.success) {
      toast({
        title: "Success",
        description: "Projects have been successfully saved!",
        variant: "default",
      });
      setIsOpen(false);
      router.push("/profile");
    } else {
      toast({
        title: "Error",
        description: `Failed to save projects: ${
          data.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Your Repositories</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {repos.map((repo) => (
              <li key={repo.id} className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id={repo.id}
                  checked={selectedRepos.some((r) => r.id === repo.id)}
                  onChange={() => handleSelectRepo(repo)}
                  className="form-checkbox h-5 w-5"
                />
                <label htmlFor={repo.id} className="text-lg">
                  {repo.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <Button className="w-full" onClick={handleSubmit}>
            Save Selected Projects
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadProjectsModal;
