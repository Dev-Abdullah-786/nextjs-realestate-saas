"use client";

import { Card, cn } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useCallback } from "react";

export const ImagesSlider = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  direction = "up",
}: {
  images: string[];
  children?: React.ReactNode;
  overlay?: React.ReactNode;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
  direction?: "up" | "down";
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev + 1 === images.length ? 0 : prev + 1
    );
  }, [images.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) =>
      prev - 1 < 0 ? images.length - 1 : prev - 1
    );
  }, [images.length]);

  useEffect(() => {
    let isMounted = true;

    Promise.all(
      images.map(
        (src) =>
          new Promise<string>((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(src);
            img.onerror = reject;
          })
      )
    )
      .then((imgs) => {
        if (isMounted) setLoadedImages(imgs);
      })
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, [images]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrevious();
    };

    window.addEventListener("keydown", handleKeyDown);

    let interval: ReturnType<typeof setInterval> | undefined;
    if (autoplay) {
      interval = setInterval(handleNext, 5000);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (interval) clearInterval(interval);
    };
  }, [autoplay, handleNext, handlePrevious]);

  const slideVariants = {
    initial: {
      scale: 0,
      opacity: 0,
      rotateX: 45,
    },
    visible: {
      scale: 1,
      rotateX: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.645, 0.045, 0.355, 1] as [
          number,
          number,
          number,
          number
        ],
      },
    },
    upExit: {
      y: "-150%",
      transition: { duration: 1 },
    },
    downExit: {
      y: "150%",
      transition: { duration: 1 },
    },
  };

  const areImagesLoaded = loadedImages.length > 0;

  return (
    <Card
      className={cn(
        "overflow-hidden h-full w-full relative flex items-center justify-center",
        className
      )}
      style={{ perspective: "1000px" }}
    >
      {areImagesLoaded && children}

      {areImagesLoaded && overlay && (
        <div
          className={cn(
            "absolute inset-0 bg-black/60 z-40",
            overlayClassName
          )}
        />
      )}

      {areImagesLoaded && (
        <AnimatePresence>
          <motion.img
            key={currentIndex}
            src={loadedImages[currentIndex]}
            initial="initial"
            animate="visible"
            exit={direction === "up" ? "upExit" : "downExit"}
            variants={slideVariants}
            className="h-full w-full absolute inset-0 object-cover"
          />
        </AnimatePresence>
      )}
    </Card>
  );
};
