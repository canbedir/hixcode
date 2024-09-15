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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectDetailsModal from "./ProjectDetailsModal";

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
  const router = useRouter();
  const { toast } = useToast();
  const [existingProjects, setExistingProjects] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<any | null>(null);
  const [isProjectDetailsModalOpen, setIsProjectDetailsModalOpen] =
    useState(false);

  useEffect(() => {
    if (!session?.accessToken) return;

    async function fetchRepos() {
      try {
        const response = await fetch(
          `/api/github-repos?accessToken=${session?.accessToken}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch GitHub repository data.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected data format: an array was expected.");
        }

        const filteredRepos = data.filter(
          (repo: any) =>
            !existingProjects.some(
              (project) => project.githubUrl === repo.html_url
            )
        );
        setRepos(filteredRepos);
      } catch (error: any) {
        console.error("Failed to fetch GitHub repositories:", error);
        toast({
          title: "Error",
          description: `Failed to fetch GitHub repositories: ${error.message}`,
          variant: "destructive",
        });
      }
    }

    fetchRepos();
  }, [session?.accessToken, existingProjects, toast]);

  useEffect(() => {
    async function fetchExistingProjects() {
      try {
        const response = await fetch("/api/user-projects?limit=all");

        if (!response.ok) {
          throw new Error("Mevcut projeler alınamadı.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Beklenmedik veri formatı: bir dizi bekleniyordu.");
        }

        setExistingProjects(data);
      } catch (error: any) {
        console.error("An error occurred while fetching existing projects:", error);
        toast({
          title: "Error",
          description: `Failed to fetch existing projects: ${error.message}`,
          variant: "destructive",
        });
      }
    }

    fetchExistingProjects();
  }, [toast]);

  const handleSelectRepo = async (repo: any) => {
    setSelectedRepo(repo);

    // Fetch contributors
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repo.full_name}/contributors`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch contributors");
      }
      const contributors = await response.json();
      setSelectedRepo({ ...repo, contributors });
    } catch (error) {
      console.error("Error fetching contributors:", error);
      toast({
        title: "Error",
        description: "Failed to fetch contributors",
        variant: "destructive",
      });
    }

    setIsOpen(false);
    setTimeout(() => {
      setIsProjectDetailsModalOpen(true);
    }, 100);
  };

  const handleProjectDetailsSave = async (
    title: string,
    description: string,
    technicalDetails: string,
    liveUrl: string,
    technologies: string[],
    contributors: { name: string; githubUrl: string; image: string }[]
  ) => {
    if (!selectedRepo) return;

    try {
      const response = await fetch("/api/save-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repos: [
            {
              ...selectedRepo,
              name: title,
              description: description,
              technicalDetails: technicalDetails,
              liveUrl: liveUrl,
              technologies: technologies,
              contributors: contributors,
            },
          ],
        }),
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
          {
            id: selectedRepo.id,
            title: title,
            githubUrl: selectedRepo.html_url,
          },
        ]);
        setRepos(repos.filter((r) => r.id !== selectedRepo.id));
        setSelectedRepo(null);
        setIsProjectDetailsModalOpen(false);
        setIsOpen(false);
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to upload project: ${error.message}`,
        variant: "destructive",
      });
    }
    router.refresh();
  };

  const handleRemoveProject = async (project: any) => {
    try {
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
        setExistingProjects(
          existingProjects.filter((p) => p.id !== project.id)
        );
        setRepos([
          ...repos,
          { id: project.id, name: project.title, html_url: project.githubUrl },
        ]);
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to remove project: ${error.message}`,
        variant: "destructive",
      });
    }
    router.refresh();
  };

  const handleProjectDetailsCancel = () => {
    setIsProjectDetailsModalOpen(false);
    setTimeout(() => {
      setIsOpen(true);
      setSelectedRepo(null);
    }, 100);
  };

  return (
    <>
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
            <div className="flex-grow overflow-hidden mt-5">
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
                          className="bg-green-600 hover:bg-green-700 text-white hover:text-white"
                          onClick={() => handleSelectRepo(repo)}
                        >
                          Select
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
      <ProjectDetailsModal
        isOpen={isProjectDetailsModalOpen}
        setIsOpen={setIsProjectDetailsModalOpen}
        onSave={(
          title,
          description,
          technicalDetails,
          liveUrl,
          technologies,
          contributors
        ) =>
          handleProjectDetailsSave(
            title,
            description,
            technicalDetails,
            liveUrl,
            technologies,
            contributors
          )
        }
        onCancel={handleProjectDetailsCancel}
        initialLiveUrl={selectedRepo?.liveUrl || ""}
        initialTitle={selectedRepo?.name || ""}
        initialDescription={selectedRepo?.description || ""}
        initialTechnicalDetails={selectedRepo?.technicalDetails || ""}
        initialTechnologies={selectedRepo?.technologies || []}
        initialMostPopularLanguage={selectedRepo?.language || "Unknown"}
        initialContributors={selectedRepo?.contributors || []}
      />
    </>
  );
};

export default UploadProjectsModal;
