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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

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
      const filteredRepos = data.filter(
        (repo: any) =>
          !existingProjects.some(
            (project) => project.githubUrl === repo.html_url
          )
      );
      setRepos(filteredRepos);
    }

    fetchRepos();
  }, [session?.accessToken, existingProjects]);

  useEffect(() => {
    if (!session?.user?.email) return;
    async function fetchExistingProjects() {
      if (session?.user?.email) {
        const response = await fetch(
          `/api/user-projects?email=${session.user.email}`
        );
        const data = await response.json();
        setExistingProjects(data);
      }
    }

    fetchExistingProjects();
  }, [session?.user?.email]);

  const handleSelectRepo = async (repo: any) => {
    const response = await fetch("/api/save-projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repos: [repo] }),
    });

    const data = await response.json();

    if (data.success) {
      toast({
        title: "Success",
        description: "Project has been successfully uploaded!",
        variant: "default",
      });
      setExistingProjects([
        ...existingProjects,
        { id: repo.id, title: repo.name, githubUrl: repo.html_url },
      ]);
      setRepos(repos.filter((r) => r.id !== repo.id));
    } else {
      toast({
        title: "Error",
        description: `Failed to upload project: ${
          data.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
    router.refresh();
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
      router.refresh();
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

  const handleRemoveProject = async (project: any) => {
    const response = await fetch("/api/remove-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ githubUrl: project.githubUrl }),
    });

    const data = await response.json();

    if (data.success) {
      toast({
        title: "Success",
        description: "Project has been successfully removed!",
        variant: "default",
      });
      setExistingProjects(existingProjects.filter((p) => p.id !== project.id));
      setRepos([
        ...repos,
        { id: project.id, name: project.title, html_url: project.githubUrl },
      ]);
    } else {
      toast({
        title: "Error",
        description: `Failed to remove project: ${
          data.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] h-[500px] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Your Repositories</DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue="available"
          className="w-full flex-grow flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="uploaded">Uploaded</TabsTrigger>
          </TabsList>
          <div className="flex-grow overflow-hidden">
            <TabsContent value="available" className="h-full">
              <div className="mt-4 h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-2">
                  Available Repositories
                </h3>
                <ul className="space-y-2 flex-grow overflow-y-auto p-3">
                  {repos.map((repo) => (
                    <li
                      key={repo.id}
                      className="flex items-center justify-between space-x-2"
                    >
                      <span className="text-sm">{repo.name}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-600 hover:bg-green-70 text-white"
                        onClick={() => handleSelectRepo(repo)}
                      >
                        Upload
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="uploaded" className="h-full">
              <div className="mt-4 h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-2">
                  Uploaded Repositories
                </h3>
                <ul className="space-y-2 flex-grow overflow-y-auto p-3">
                  {existingProjects.map((project) => (
                    <li
                      key={project.id}
                      className="flex items-center justify-between space-x-2"
                    >
                      <span className="text-sm">{project.title}</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveProject(project)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UploadProjectsModal;
