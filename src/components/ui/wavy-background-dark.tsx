"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { useTheme } from "next-themes";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const noise = createNoise3D();
  let w: number,
    h: number,
    nt: number,
    i: number,
    x: number,
    ctx: any,
    canvas: any;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [backgroundFill, setBackgroundFill] = useState("#09090B");

  useEffect(() => {
    const newBackgroundFill = theme === "dark" ? "#09090B" : "#ffffff";
    setBackgroundFill(newBackgroundFill);
    if (canvasRef.current) {
      ctx = canvasRef.current.getContext("2d");
      render(); // When the theme changes, re-render
    }
  }, [theme]);

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const init = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    w = ctx.canvas.width = window.innerWidth;
    h = ctx.canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
    nt = 0;
    window.onresize = function () {
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };
    render();
  };

  const waveColors =
    colors ??
    (theme === "dark"
      ? [
          "rgba(76, 29, 149, 0.1)",
          "rgba(124, 58, 237, 0.2)",
          "rgba(167, 139, 250, 0.3)",
          "rgba(196, 181, 253, 0.4)",
          "rgba(233, 213, 255, 0.5)",
        ]
      : [
          "rgba(219, 234, 254, 0.1)",
          "rgba(191, 219, 254, 0.2)",
          "rgba(147, 197, 253, 0.3)",
          "rgba(96, 165, 250, 0.4)",
          "rgba(59, 130, 246, 0.5)",
        ]);
  const drawWave = (n: number) => {
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      for (x = 0; x < w; x += 5) {
        var y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5); // adjust for height, currently at 50% of the container
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  let animationId: number;
  const render = () => {
    ctx.clearRect(0, 0, w, h);

    ctx.globalAlpha = waveOpacity;
    drawWave(5);

    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = backgroundFill;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "source-over";

    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    // I'm sorry but i have got to support it on safari.
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn("relative w-full overflow-hidden", containerClassName)}
      style={{
        backgroundColor: backgroundFill,
      }}
      {...props}
    >
      <canvas
        className="absolute inset-0 z-0 w-full h-full"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative z-10 w-full h-full", className)}>
        {children}
      </div>
    </div>
  );
};
