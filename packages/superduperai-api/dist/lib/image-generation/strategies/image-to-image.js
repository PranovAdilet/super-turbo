export class ImageToImageStrategy {
    constructor() {
        this.type = "image-to-image";
        this.requiresSourceImage = true;
        this.requiresPrompt = true;
    }
    validate(params) {
        if (!params.file && !params.sourceImageId && !params.sourceImageUrl) {
            return {
                valid: false,
                error: "Source image is required for image-to-image generation",
            };
        }
        if (!params.prompt?.trim()) {
            return {
                valid: false,
                error: "Prompt is required for image-to-image generation",
            };
        }
        return { valid: true };
    }
    async generatePayload(params) {
        // Здесь предполагается, что sourceImageId или sourceImageUrl уже получены (например, после загрузки файла)
        return {
            config: {
                prompt: params.prompt,
                negative_prompt: params.negativePrompt || "",
                width: params.resolution?.width || 512,
                height: params.resolution?.height || 512,
                steps: 30,
                shot_size: params.shotSize?.id || null,
                seed: params.seed || Math.floor(Math.random() * 1000000000000),
                generation_config_name: params.model?.name || "fal-ai/flux-dev",
                batch_size: Math.min(Math.max(params.batchSize || 1, 1), 3),
                style_name: params.style?.id || null,
                references: [
                    {
                        type: "source",
                        reference_id: params.sourceImageId || "",
                    },
                ],
                entity_ids: [],
            },
        };
    }
}
//# sourceMappingURL=image-to-image.js.map