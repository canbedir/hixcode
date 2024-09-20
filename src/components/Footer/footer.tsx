"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.offsetHeight;
      const buffer = 50; // Sayfanın sonuna yaklaşıldığında footer'ı göstermek için tampon değer

      setShowFooter(scrollPosition > pageHeight - buffer);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // İlk yükleme için kontrol et

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showFooter) return null;

  return (
    <footer className="w-full py-12 text-muted-foreground text-sm bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} hixCode
          </p>
          <div className="flex items-center gap-3">
            <h1>Developed by can</h1>
            <div className="flex gap-2">
              <Link
                href="https://github.com/canbedir"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/canbedir"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
