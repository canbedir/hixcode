"use client"
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function SelectProjectsPage() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!session?.accessToken) return;

    async function fetchRepos() {
      const response = await fetch(`/api/github-repos?accessToken=${session?.accessToken}`);
      const data = await response.json();
      setRepos(data);
    }

    fetchRepos();
  }, [session?.accessToken]);

  const handleSelectRepo = (repo: any) => {
    if (selectedRepos.includes(repo)) {
      setSelectedRepos(selectedRepos.filter(r => r.id !== repo.id));
    } else {
      setSelectedRepos([...selectedRepos, repo]);
    }
  };

  const handleSubmit = async () => {
    if (selectedRepos.length === 0) {
      alert("Please select at least one repository.");
      return;
    }

    const response = await fetch('/api/save-projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ repos: selectedRepos }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Projects successfully saved!");
      router.push('/profile');
    } else {
      alert(`Error: ${data.message}\nDetails: ${data.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Select Your GitHub Repositories</h1>
      <ul className="space-y-2">
        {repos.map((repo) => (
          <li key={repo.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={repo.id}
              checked={selectedRepos.some(r => r.id === repo.id)}
              onChange={() => handleSelectRepo(repo)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <label htmlFor={repo.id} className="text-lg">{repo.name}</label>
          </li>
        ))}
      </ul>
      <Button onClick={handleSubmit} className="mt-4">Save Selected Projects</Button>
    </div>
  );
}