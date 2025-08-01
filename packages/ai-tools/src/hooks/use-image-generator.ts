"use client";

import { useState, useCallback } from "react";
import {
  ImageGenerationParams,
  GeneratedImage,
  GenerationStatus,
} from "../types";

export interface UseImageGeneratorOptions {
  onGenerate?: (params: ImageGenerationParams) => Promise<GeneratedImage>;
  onError?: (error: string) => void;
  onSuccess?: (image: GeneratedImage) => void;
}

export interface UseImageGeneratorReturn {
  // State
  isGenerating: boolean;
  generationStatus: GenerationStatus;
  generatedImages: GeneratedImage[];
  currentGeneration: GeneratedImage | null;

  // Actions
  generateImage: (params: ImageGenerationParams) => Promise<void>;
  clearCurrentGeneration: () => void;
  deleteImage: (imageId: string) => void;
  clearAllImages: () => void;

  // Utils
  downloadImage: (image: GeneratedImage) => Promise<void>;
  copyImageUrl: (image: GeneratedImage) => Promise<void>;
}

export function useImageGenerator(
  options: UseImageGeneratorOptions = {}
): UseImageGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [currentGeneration, setCurrentGeneration] =
    useState<GeneratedImage | null>(null);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    status: "idle",
    message: "",
  });

  const generateImage = useCallback(
    async (params: ImageGenerationParams) => {
      if (!options.onGenerate) {
        console.warn("No onGenerate function provided to useImageGenerator");
        return;
      }

      try {
        setIsGenerating(true);
        setGenerationStatus({
          status: "generating",
          message: "Starting image generation...",
          progress: 0,
        });

        const image = await options.onGenerate(params);

        setCurrentGeneration(image);
        setGeneratedImages((prev) => [image, ...prev]);
        setGenerationStatus({
          status: "completed",
          message: "Image generation completed!",
          progress: 100,
        });

        options.onSuccess?.(image);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Image generation failed";
        setGenerationStatus({
          status: "error",
          message: errorMessage,
          error: errorMessage,
        });
        options.onError?.(errorMessage);
      } finally {
        setIsGenerating(false);
      }
    },
    [options]
  );

  const clearCurrentGeneration = useCallback(() => {
    setCurrentGeneration(null);
    setGenerationStatus({
      status: "idle",
      message: "",
    });
  }, []);

  const deleteImage = useCallback((imageId: string) => {
    setGeneratedImages((prev) => prev.filter((img) => img.id !== imageId));
  }, []);

  const clearAllImages = useCallback(() => {
    setGeneratedImages([]);
  }, []);

  const downloadImage = useCallback(async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `image-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  }, []);

  const copyImageUrl = useCallback(async (image: GeneratedImage) => {
    try {
      await navigator.clipboard.writeText(image.url);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  }, []);

  return {
    isGenerating,
    generationStatus,
    generatedImages,
    currentGeneration,
    generateImage,
    clearCurrentGeneration,
    deleteImage,
    clearAllImages,
    downloadImage,
    copyImageUrl,
  };
}
