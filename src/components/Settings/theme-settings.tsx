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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {themes.map((t) => (
        <Card
          key={t.name}
          onClick={() => setTheme(t.name)}
          className={`cursor-pointer ${
            theme === t.name ? "border-2 border-primary" : ""
          }`}
        >
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Image className="border-4" src={t.imageSrc} alt={t.title} height={200} width={400} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ThemeSettings;
