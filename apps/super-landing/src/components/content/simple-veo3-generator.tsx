"use client";

import {
  Veo3PromptGenerator,
  PromptDataType,
  MoodboardImageType,
} from "@turbo-super/features";

// Define types from exported values
type PromptData = typeof PromptDataType;
type MoodboardImage = typeof MoodboardImageType;
import { CreditBalance } from "@/components/ui/credit-balance";

export function SimpleVeo3Generator() {
  const enhancePromptFunction = async (params: {
    prompt: string;
    customLimit: number;
    model: string;
    focusType?: string;
    includeAudio: boolean;
    promptData: PromptData;
    moodboard?: {
      enabled: boolean;
      images: MoodboardImage[];
    };
  }) => {
    const response = await fetch("/api/enhance-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...params,
      }),
    });
    return response.json();
  };

  return (
    <div className="max-w-7xl veo3-fixes">
      {/* Credit Balance Section */}
      <div className="mb-6">
        <CreditBalance showPurchaseButton={true} />
      </div>

      <Veo3PromptGenerator
        enhancePromptFunction={enhancePromptFunction}
        MoodboardUploader={undefined}
        showInfoBanner={true}
      />
    </div>
  );
}
