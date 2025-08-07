import { ImageGenerationStrategyFactory } from "./strategy.factory";
// Main generation function using strategy pattern
export async function generateImageWithStrategy(generationType, params, config) {
    console.log("🔧 configureImageGeneration called with:", params);
    const factory = new ImageGenerationStrategyFactory();
    const strategy = factory.getStrategy(generationType);
    if (!strategy) {
        throw new Error(`Unsupported generation type: ${generationType}`);
    }
    let response;
    let result;
    try {
        const payload = await strategy.generatePayload(params);
        // Use correct SuperDuperAI endpoint for image generation
        const endpoint = "/api/v1/file/generate-image";
        const url = `${config.url}${endpoint}`;
        // All requests use JSON payload
        response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${config.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorText = await response.text();
            return {
                success: false,
                error: `API Error: ${response.status} ${response.statusText} - ${errorText}`,
            };
        }
        result = await response.json();
        console.log("result", result);
        const fileId = result[0].id || result[0].file_id;
        if (!fileId) {
            return {
                success: false,
                error: "No file ID returned from API",
            };
        }
        return {
            success: true,
            projectId: fileId,
            requestId: fileId,
            fileId,
            message: `${strategy.type} generation started! FileId: ${fileId}`,
            tasks: result.tasks || [],
        };
    }
    catch (error) {
        let errorMessage = error.message || `Unknown ${strategy.type} generation error`;
        return {
            success: false,
            error: errorMessage,
        };
    }
}
//# sourceMappingURL=generate.js.map