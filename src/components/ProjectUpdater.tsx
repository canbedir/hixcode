"use client";
import { useEffect } from "react";

const ProjectUpdater = () => {
  useEffect(() => {
    const updateProjects = async () => {
      try {
        const response = await fetch('/api/update-projects', { method: 'POST' });
        if (!response.ok) {
          throw new Error('Projeler güncellenirken bir hata oluştu');
        }
      } catch (error) {
        console.error('Proje güncelleme hatası:', error);
      }
    };

    updateProjects();
    const interval = setInterval(updateProjects, 300000);
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default ProjectUpdater;
