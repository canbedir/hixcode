import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { useTheme } from "next-themes";

const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      name: "light",
      title: "Light Mode",
      imageSrc:
        "https://github.githubassets.com/assets/light_preview-0fd4f11e117f.svg",
    },
    {
      name: "dark",
      title: "Dark Mode",
      imageSrc:
        "https://github.githubassets.com/assets/dark_preview-988b89718a06.svg",
    },
  ];

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName);
  };

  return (
    <div className="flex flex-col space-y-6">
      <h2 className="text-2xl font-bold mb-4">Theme Settings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {themes.map((t) => (
          <Card
            key={t.name}
            onClick={() => handleThemeChange(t.name)}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              theme === t.name ? "border-2 border-primary" : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="text-lg">{t.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-video">
                <Image
                  className="object-cover rounded-md transition-opacity duration-300"
                  src={t.imageSrc}
                  alt={t.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ThemeSettings;
