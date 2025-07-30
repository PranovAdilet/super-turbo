import type { IGenerationConfigRead } from "@/lib/api/models/IGenerationConfigRead";

// Extended model type with UI-friendly fields
export interface AdaptedModel extends IGenerationConfigRead {
  id: string;
  label: string;
  description: string;
  value: string;
  workflowPath: string;
  price: number;
}

export interface MediaOption {
  id: string;
  label: string;
  description?: string;
  thumbnail?: string | null;
}

export interface MediaResolution {
  width: number;
  height: number;
  label: string;
  aspectRatio?: string;
  qualityType?: "hd" | "full_hd";
}

// Image-specific types
export interface ImageSettings {
  resolution: MediaResolution;
  style: MediaOption;
  shotSize: MediaOption;
  model: AdaptedModel;
  seed?: number;
  batchSize?: number;
}

export interface ImageGenerationConfig {
  type: "image-generation-settings";
  availableResolutions: MediaResolution[];
  availableStyles: MediaOption[];
  availableShotSizes: MediaOption[];
  availableModels: AdaptedModel[];
  defaultSettings: ImageSettings;
}

// Video-specific types
export interface VideoSettings {
  resolution: MediaResolution;
  style: MediaOption;
  shotSize: MediaOption;
  model: AdaptedModel;
  frameRate: number;
  duration: number;
  negativePrompt?: string;
  seed?: number;
}

export interface VideoGenerationConfig {
  type: "video-generation-settings";
  availableResolutions: MediaResolution[];
  availableStyles: MediaOption[];
  availableShotSizes: MediaOption[];
  availableModels: AdaptedModel[];
  availableFrameRates: { value: number; label: string }[];
  defaultSettings: VideoSettings;
}

// Audio-specific types (for future use)
export interface AudioSettings {
  format: MediaOption;
  quality: MediaOption;
  duration: number;
  style: MediaOption;
}

export interface AudioGenerationConfig {
  type: "audio-generation-settings";
  availableFormats: MediaOption[];
  availableQualities: MediaOption[];
  availableStyles: MediaOption[];
  defaultSettings: AudioSettings;
}

// Union type for all media configurations
export type MediaGenerationConfig =
  | ImageGenerationConfig
  | VideoGenerationConfig
  | AudioGenerationConfig;

// Helper type for extracting settings from config
export type ExtractSettings<T extends MediaGenerationConfig> =
  T extends ImageGenerationConfig
    ? ImageSettings
    : T extends VideoGenerationConfig
      ? VideoSettings
      : T extends AudioGenerationConfig
        ? AudioSettings
        : never;
