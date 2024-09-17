"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D, NoiseFunction3D } from "simplex-noise";
import { useTheme } from "next-themes";

interface WavyBackgroundProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}

// WavyBackground for Dark mode
const DarkWavyBackground: React.FC<WavyBackgroundProps> = ({ children, className, containerClassName, colors, waveWidth, blur = 10, speed = "fast", waveOpacity = 0.5, ...props }) => {
  const noise: NoiseFunction3D = createNoise3D();
  let w: number, h: number, nt: number, i: number, x: number, ctx: CanvasRenderingContext2D | null;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const canvas = canvasRef.current;
    const scale = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * scale;
    canvas.height = canvas.offsetHeight * scale;
    ctx.scale(scale, scale);

    w = canvas.width;
    h = canvas.height;

    nt = 0;

    const waveColors = colors ?? [
      "rgba(76, 29, 149, 0.1)",
      "rgba(124, 58, 237, 0.2)",
      "rgba(167, 139, 250, 0.3)",
      "rgba(196, 181, 253, 0.4)",
      "rgba(233, 213, 255, 0.5)",
    ];

    const drawWave = (n: number) => {
      nt += speed === "fast" ? 0.002 : 0.001;
      for (i = 0; i < n; i++) {
        ctx!.beginPath();
        ctx!.lineWidth = waveWidth || 50;
        ctx!.strokeStyle = waveColors[i % waveColors.length];
        for (x = 0; x < w; x += 5) {
          const y = noise(x / 800, 0.3 * i, nt) * 100;
          ctx!.lineTo(x, y + h * 0.5);
        }
        ctx!.stroke();
        ctx!.closePath();
      }
    };

    let animationId: number;
    const render = () => {
      ctx!.clearRect(0, 0, w, h);
      ctx!.globalAlpha = waveOpacity;
      drawWave(5);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [colors, waveWidth, blur, speed, waveOpacity, noise]);

  return (
    <div
      className={cn("relative w-full overflow-hidden", containerClassName)}
      style={{ backgroundColor: "#09090B" }}
      {...props}
    >
      <canvas
        className="absolute inset-0 z-0 w-full h-full"
        ref={canvasRef}
        style={{
          filter: `blur(${blur}px)`,
        }}
      />
      <div className={cn("relative z-10 w-full h-full", className)}>
        {children}
      </div>
    </div>
  );
};

// WavyBackground for Light mode
const LightWavyBackground: React.FC<WavyBackgroundProps> = ({ children, className, containerClassName, colors, waveWidth, blur = 10, speed = "fast", waveOpacity = 0.5, ...props }) => {
  const noise: NoiseFunction3D = createNoise3D();
  let w: number, h: number, nt: number, i: number, x: number, ctx: CanvasRenderingContext2D | null;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const canvas = canvasRef.current;
    const scale = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * scale;
    canvas.height = canvas.offsetHeight * scale;
    ctx.scale(scale, scale);

    w = canvas.width;
    h = canvas.height;

    nt = 0;

    const waveColors = colors ?? [
      "rgba(219, 234, 254, 0.1)",
      "rgba(191, 219, 254, 0.2)",
      "rgba(147, 197, 253, 0.3)",
      "rgba(96, 165, 250, 0.4)",
      "rgba(59, 130, 246, 0.5)",
    ];

    const drawWave = (n: number) => {
      nt += speed === "fast" ? 0.002 : 0.001;
      for (i = 0; i < n; i++) {
        ctx!.beginPath();
        ctx!.lineWidth = waveWidth || 50;
        ctx!.strokeStyle = waveColors[i % waveColors.length];
        for (x = 0; x < w; x += 5) {
          const y = noise(x / 800, 0.3 * i, nt) * 100;
          ctx!.lineTo(x, y + h * 0.5);
        }
        ctx!.stroke();
        ctx!.closePath();
      }
    };

    let animationId: number;
    const render = () => {
      ctx!.clearRect(0, 0, w, h);
      ctx!.globalAlpha = waveOpacity;
      drawWave(5);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [colors, waveWidth, blur, speed, waveOpacity, noise]);

  return (
    <div
      className={cn("relative w-full overflow-hidden", containerClassName)}
      style={{ backgroundColor: "#ffffff" }}
      {...props}
    >
      <canvas
        className="absolute inset-0 z-0 w-full h-full"
        ref={canvasRef}
        style={{
          filter: `blur(${blur}px)`,
        }}
      />
      <div className={cn("relative z-10 w-full h-full", className)}>
        {children}
      </div>
    </div>
  );
};
// Component that selects the appropriate WavyBackground based on the theme
export const ThemeAwareWavyBackground: React.FC<WavyBackgroundProps> = (props) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ height: '100vh' }} />; // Show an empty div during loading
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  if (currentTheme === "dark") {
    return <DarkWavyBackground {...props} />;
  } else {
    return <LightWavyBackground {...props} />;
  }
};
