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
    async handleImageUpload(params, config) {
        console.log("🔍 handleImageUpload called with:", {
            hasFile: !!params.file,
            fileType: params.file?.type,
            fileSize: params.file?.size,
            uploadUrl: `${config.url}/api/v1/file/upload`,
        });
        if (!params.file) {
            console.log("❌ No file provided for upload");
            return {
                error: "No file provided for upload",
                method: "upload",
            };
        }
        try {
            const formData = new FormData();
            formData.append("payload", params.file);
            formData.append("type", "image");
            console.log("📤 Sending upload request to:", `${config.url}/api/v1/file/upload`);
            const uploadResponse = await fetch(`${config.url}/api/v1/file/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${config.token}`,
                    "User-Agent": "SuperDuperAI-Landing/1.0",
                },
                body: formData,
            });
            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                throw new Error(`File upload failed: ${uploadResponse.status} - ${errorText}`);
            }
            const uploadResult = await uploadResponse.json();
            console.log("uploadResult", uploadResult);
            return {
                imageId: uploadResult?.id,
                imageUrl: uploadResult?.url || undefined,
                method: "upload",
            };
        }
        catch (error) {
            console.error("Error uploading file", error);
            return {
                error: "Image upload failed",
                method: "upload",
            };
        }
    }
    async generatePayload(params, config) {
        const modelName = params.model?.name || "fal-ai/flux-dev";
        const isGPTImage = String(modelName).includes("gpt-image-1");
        const imageId = params.sourceImageId;
        // Если передан файл, сначала загружаем его и используем reference_id
        // Примечание: загрузку выполним в generate() уровне выше, где доступен config.
        if (isGPTImage) {
            return {
                config: {
                    prompt: params.prompt,
                    negative_prompt: params.negativePrompt || "",
                    width: params.resolution?.width || 1024,
                    height: params.resolution?.height || 1024,
                    seed: params.seed || Math.floor(Math.random() * 1000000000000),
                    generation_config_name: modelName,
                    references: imageId
                        ? [
                            {
                                type: "source",
                                reference_id: imageId,
                            },
                        ]
                        : [],
                    entity_ids: [],
                },
            };
        }
        return {
            config: {
                prompt: params.prompt,
                negative_prompt: params.negativePrompt || "",
                width: params.resolution?.width || 512,
                height: params.resolution?.height || 512,
                steps: 30,
                shot_size: params.shotSize?.id || null,
                seed: params.seed || Math.floor(Math.random() * 1000000000000),
                generation_config_name: modelName,
                style_name: params.style?.id || null,
                references: imageId
                    ? [
                        {
                            type: "source",
                            reference_id: imageId,
                        },
                    ]
                    : [],
                entity_ids: [],
            },
        };
    }
}
//# sourceMappingURL=image-to-image.js.map