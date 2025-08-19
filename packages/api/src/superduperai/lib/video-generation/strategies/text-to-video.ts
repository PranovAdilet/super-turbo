// @ts-nocheck
import type {
  VideoGenerationParams,
  VideoGenerationStrategy,
} from "../strategy.interface";

// Simple snake_case converter
function snakeCase(str: string | undefined | null): string | undefined {
  if (!str) return undefined;
  // Handles "Long Shot" -> "long_shot"
  return str.trim().replace(/\s+/g, "_").toLowerCase();
}

// Helper function to extract string value from object or string
function getStringValue(value: any): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value.id) return value.id;
  if (typeof value === "object" && value.label) return value.label;
  return undefined;
}

// Simple resolution parser
function parseResolution(resolution: any): {
  width: number;
  height: number;
  aspectRatio: string;
} {
  if (typeof resolution === "string") {
    // Handle string format like "1920x1080" or "16:9"
    if (resolution.includes("x")) {
      const [width, height] = resolution.split("x").map(Number);
      return { width, height, aspectRatio: `${width}:${height}` };
    } else if (resolution.includes(":")) {
      const [width, height] = resolution.split(":").map(Number);
      return { width, height, aspectRatio: resolution };
    }
  }

  // Handle object format
  if (resolution && typeof resolution === "object") {
    const width = resolution.width || 1280;
    const height = resolution.height || 720;
    const aspectRatio = resolution.aspectRatio || "16:9";
    return { width, height, aspectRatio };
  }

  // Default values
  return { width: 1280, height: 720, aspectRatio: "16:9" };
}

// Text-to-Video Strategy
export class TextToVideoStrategy implements VideoGenerationStrategy {
  readonly type = "text-to-video";
  readonly requiresSourceImage = false;
  readonly requiresPrompt = true;

  validate(params: VideoGenerationParams): { valid: boolean; error?: string } {
    if (!params.prompt?.trim()) {
      return {
        valid: false,
        error: "Prompt is required for text-to-video generation",
      };
    }
    return { valid: true };
  }

  generatePayload(
    params: VideoGenerationParams,
    config?: { url: string; token: string }
  ): any {
    const { width, height, aspectRatio } = parseResolution(params.resolution);

    const modelName =
      typeof params.model === "string"
        ? params.model
        : params.model?.name || "azure-openai/sora";

    const payload = {
      config: {
        prompt: params.prompt,
        generation_config_name: modelName,
        duration: params.duration,
        aspect_ratio: aspectRatio || "16:9",
        seed: params.seed || Math.floor(Math.random() * 1000000000000),
        negative_prompt: params.negativePrompt || "",
        width: width,
        height: height,
        frame_rate: params.frameRate,
        shot_size: snakeCase(getStringValue(params.shotSize)), // Extract string from object/string
        style_name: snakeCase(getStringValue(params.style)), // Extract string from object/string
      },
    };

    return payload;
  }
}
