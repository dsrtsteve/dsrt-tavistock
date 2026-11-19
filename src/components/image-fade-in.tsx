"use client";

import { useEffect } from "react";

/**
 * Adds a loaded-state class to every image after its resource has loaded.
 * A single capture-phase listener covers native img elements and Next.js
 * Image components without requiring per-image event handlers.
 */
export function ImageFadeIn() {
  useEffect(() => {
    const markLoaded = (image: HTMLImageElement) => {
      image.classList.add("image-loaded");
    };

    const handleLoad = (event: Event) => {
      if (event.target instanceof HTMLImageElement) {
        markLoaded(event.target);
      }
    };

    document.addEventListener("load", handleLoad, true);

    // Account for cached images that finished before this listener mounted.
    document.querySelectorAll("img").forEach((image) => {
      if (image.complete) markLoaded(image);
    });

    return () => {
      document.removeEventListener("load", handleLoad, true);
    };
  }, []);

  return null;
}
