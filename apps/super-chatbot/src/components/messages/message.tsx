"use client";

import type { UIMessage } from "ai";
import cx from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useState } from "react";
import type { Vote } from "@/lib/db/schema";
import { PencilEditIcon, SparklesIcon } from "../common/icons";
import { MessageActions } from "./message-actions";

import equal from "fast-deep-equal";
import { sanitizeText } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { MessageEditor } from "./message-editor";
import { MessageReasoning } from "./message-reasoning";
import type { UseChatHelpers } from "@ai-sdk/react";
import { MediaSettings, PreviewAttachment, Markdown } from "../";
import type {
  ImageGenerationConfig,
  ImageSettings,
  VideoGenerationConfig,
  VideoSettings as VideoSettingsType,
} from "@/lib/types/media-settings";
import { useArtifactLegacy } from "@/hooks/use-artifact";
import { ScriptArtifactViewer } from "@/artifacts/text/client";
import { Button, cn } from "@turbo-super/ui";
import { saveScriptToChat } from "@/lib/ai/chat/media";

const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  reload,
  isReadonly,
  requiresScrollPadding,
  selectedChatModel,
  selectedVisibilityType,
  append,
}: {
  chatId: string;
  message: UIMessage;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: UseChatHelpers<any>["setMessages"];
  reload?: () => void; // AI SDK v5: reload type
  isReadonly: boolean;
  requiresScrollPadding: boolean;
  selectedChatModel: string;
  selectedVisibilityType: "public" | "private";
  append?: (message: any, options?: any) => Promise<string | null | undefined>; // AI SDK v5: append type
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const { setArtifact } = useArtifactLegacy(chatId);

  // Debug: log message structure
  if (message.role === "assistant" && message.parts) {
    console.log("📨 Assistant message in message.tsx:", {
      id: message.id,
      role: message.role,
      partsCount: message.parts.length,
      parts: message.parts.map((p: any) => ({
        type: p.type,
        state: p.state,
        toolName: p.toolName || p.toolCallId,
      })),
    });
  }

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            {
              "w-full": mode === "edit",
              "group-data-[role=user]/message:w-fit": mode !== "edit",
            }
          )}
        >
          {message.role === "assistant" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div
            className={cn("flex flex-col gap-4 w-full", {
              "min-h-96": message.role === "assistant" && requiresScrollPadding,
            })}
          >
            {(message as any).experimental_attachments &&
              (message as any).experimental_attachments.length > 0 && (
                <div
                  data-testid={`message-attachments`}
                  className="flex flex-row justify-end gap-2"
                >
                  {(message as any).experimental_attachments.map((attachment: any) => (
                    <PreviewAttachment
                      key={attachment.url}
                      attachment={attachment}
                      chatId={chatId}
                    />
                  ))}
                </div>
              )}

            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === "reasoning") {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={(part as any).reasoning || part.text || ''}
                  />
                );
              }

              if (type === "text") {
                if (mode === "view") {
                  // AI SDK v5: part.text can be string or array, normalize it
                  const textContent = typeof part.text === 'string'
                    ? part.text
                    : Array.isArray(part.text)
                      ? (part.text as any[]).map((item: any) => {
                          // If array contains objects with 'type' and 'text', extract text
                          if (typeof item === 'object' && item !== null && 'text' in item) {
                            return item.text;
                          }
                          // If array contains strings, use them directly
                          return typeof item === 'string' ? item : '';
                        }).join('')
                      : '';

                  // Skip rendering if this is a raw JSON tool-call message
                  if (textContent?.trim().startsWith('{"type":"tool-')) {
                    console.log("📝 Skipping raw JSON tool-call message:", textContent.substring(0, 100));
                    return null;
                  }

                  // --- EMBED ARTIFACT (image/video/text) ---
                  let artifact: any = null;
                  if (textContent?.startsWith("```json")) {
                    try {
                      const jsonMatch = textContent.match(
                        /```json\s*({[\s\S]*?})\s*```/
                      );
                      if (jsonMatch?.[1]) {
                        artifact = JSON.parse(jsonMatch[1]);
                      }
                    } catch {}
                  } else if (
                    textContent?.startsWith("{") &&
                    textContent.endsWith("}")
                  ) {
                    try {
                      artifact = JSON.parse(textContent);
                    } catch {}
                  }
                  if (
                    artifact &&
                    artifact.kind === "text" &&
                    artifact.content
                  ) {
                    return (
                      <div
                        key={key}
                        className="flex flex-row gap-2 items-start"
                      >
                        <div
                          className="cursor-pointer w-full"
                          onClick={async () => {
                            const newArtifact = {
                              title: artifact.title || "",
                              documentId: artifact.documentId,
                              kind: "text" as const,
                              content: artifact.content,
                              isVisible: true,
                              status: "idle" as const,
                              boundingBox: {
                                top: 0,
                                left: 0,
                                width: 0,
                                height: 0,
                              },
                            };

                            // ВАЖНО: Сначала сохраняем в localStorage с isVisible: true
                            // чтобы предотвратить закрытие при восстановлении из useEffect
                            if (typeof window !== 'undefined' && chatId) {
                              const { saveArtifactToStorage } = await import('@/lib/utils/artifact-persistence');
                              saveArtifactToStorage(chatId, newArtifact);
                            }

                            // Затем открываем артефакт
                            setArtifact(newArtifact);
                          }}
                        >
                          <ScriptArtifactViewer
                            title={artifact.title || ""}
                            content={artifact.content}
                          />
                        </div>
                      </div>
                    );
                  }
                  // --- END EMBED ---
                  // Check if this is a resolution selection message
                  if (textContent?.startsWith("Выбрано разрешение:")) {
                    const resolutionMatch = textContent.match(
                      /разрешение: (\d+)x(\d+), стиль: (.+?), размер кадра: (.+?), модель: (.+?)(?:, сид: (\d+))?$/
                    );
                    if (resolutionMatch) {
                      const [
                        ,
                        width,
                        height,
                        style,
                        shotSize,
                        imageModel,
                        seed,
                      ] = resolutionMatch;
                      return (
                        <div
                          key={key}
                          className="flex flex-row gap-2 items-start"
                        >
                          <div
                            data-testid="message-content"
                            className="flex flex-col gap-4 bg-primary text-primary-foreground px-3 py-2 rounded-xl"
                          >
                            <div className="flex flex-col gap-2">
                              <p>
                                Выбрано разрешение: {width} × {height}
                              </p>
                              <p>Стиль: {style}</p>
                              <p>Размер кадра: {shotSize}</p>
                              <p>Модель: {imageModel}</p>
                              {seed && <p>Сид: {seed}</p>}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  }

                  return (
                    <div
                      key={key}
                      className="flex flex-row gap-2 items-start"
                    >
                      {message.role === "user" && !isReadonly && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="message-edit-button"
                              variant="ghost"
                              className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                              onClick={() => {
                                setMode("edit");
                              }}
                            >
                              <PencilEditIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit message</TooltipContent>
                        </Tooltip>
                      )}

                      <div
                        data-testid="message-content"
                        className={cn("flex flex-col gap-4", {
                          "bg-primary text-primary-foreground px-3 py-2 rounded-xl":
                            message.role === "user",
                        })}
                      >
                        <Markdown>{sanitizeText(textContent)}</Markdown>
                      </div>
                    </div>
                  );
                }

                if (mode === "edit") {
                  return (
                    <div
                      key={key}
                      className="flex flex-row gap-2 items-start"
                    >
                      <div className="size-8" />

                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        reload={reload}
                      />
                    </div>
                  );
                }
              }

              // AI SDK v5: "tool-invocation" type no longer exists
              // Tool parts now use types like "tool-configureImageGeneration", "tool-createDocument", etc.
              // Check for tool types using startsWith('tool-')
              if (type?.startsWith('tool-')) {
                const toolName = type.replace('tool-', '');
                const toolCallId = (part as any).toolCallId || '';
                const state = (part as any).state || 'unknown';
                const args = (part as any).input;
                const output = (part as any).output;

                // Debug: log all tool invocations
                console.log("🔍 Tool detected in message.tsx:", {
                  toolName,
                  state,
                  hasOutput: state === "output-available" && !!output,
                  output: state === "output-available" ? output : undefined,
                });

                if (state === "call" || state === "input-streaming") {
                  return null;
                }

                if (state === "output-available" || state === "result") {
                  const result = output;

                  // Handle image generation configuration
                  if (
                    toolName === "configureImageGeneration" &&
                    result?.type === "image-generation-settings"
                  ) {
                    const config = result as ImageGenerationConfig;
                    return (
                      <div
                        key={toolCallId}
                        className="p-4"
                      >
                        <MediaSettings
                          config={config}
                          onConfirm={(
                            settings: ImageSettings | VideoSettingsType
                          ) => {
                            console.log("Image settings selected:", settings);
                          }}
                          selectedChatModel={selectedChatModel}
                          selectedVisibilityType={selectedVisibilityType}
                          {...(append && { append })}
                        />
                      </div>
                    );
                  }

                  // Handle video generation configuration
                  if (
                    toolName === "configureVideoGeneration" &&
                    result?.type === "video-generation-settings"
                  ) {
                    const config = result as VideoGenerationConfig;
                    return (
                      <div
                        key={toolCallId}
                        className="p-4"
                      >
                        <MediaSettings
                          config={config}
                          onConfirm={(
                            settings: ImageSettings | VideoSettingsType
                          ) => {
                            console.log("Video settings selected:", settings);
                          }}
                          selectedChatModel={selectedChatModel}
                          selectedVisibilityType={selectedVisibilityType}
                          {...(append && { append })}
                        />
                      </div>
                    );
                  }

                  // Handle configureScriptGeneration tool result - opens artifact viewer and saves to chat
                  if (
                    toolName === "configureScriptGeneration" &&
                    result &&
                    typeof result === "object" &&
                    "id" in result &&
                    "kind" in result &&
                    "title" in result
                  ) {
                    const scriptTitle = result.title as string;
                    const scriptId = result.id as string;

                    console.log("📄 configureScriptGeneration tool result received:", {
                      id: scriptId,
                      kind: result.kind,
                      title: scriptTitle,
                    });

                    // Save script to chat immediately
                    if (setMessages) {
                      console.log("📄 Saving script to chat history...");
                      saveScriptToChat(
                        chatId,
                        scriptId,
                        scriptTitle,
                        setMessages
                      );
                    }

                    // Don't return any UI element - script artifact is already opened by use-artifact hook
                    return null;
                  }

                  // Handle createDocument tool result - opens artifact viewer
                  if (
                    toolName === "createDocument" &&
                    result &&
                    typeof result === "object" &&
                    "id" in result &&
                    "kind" in result &&
                    "title" in result
                  ) {
                    const artifactKind = result.kind as string;

                    // Parse title for image/video artifacts to get human-readable version
                    let displayTitle = result.title as string;
                    try {
                      if (artifactKind === "image" || artifactKind === "video") {
                        // Title might be JSON with parameters
                        if (displayTitle.startsWith("{")) {
                          const titleParams = JSON.parse(displayTitle);
                          displayTitle = titleParams.prompt || `AI Generated ${artifactKind}`;
                        }
                      }
                    } catch {
                      // Keep original title if parsing fails
                    }

                    console.log("🎨 createDocument tool result received:", {
                      id: result.id,
                      kind: artifactKind,
                      title: displayTitle,
                    });

                    // Automatically open artifact when document is created
                    // Use setTimeout to ensure state updates after render
                    setTimeout(() => {
                      setArtifact({
                        title: displayTitle,
                        documentId: result.id as string,
                        kind: artifactKind as any,
                        content: "", // Content will be loaded from database
                        isVisible: true,
                        status: "pending", // Set to pending initially for image/video
                        boundingBox: {
                          top: 0,
                          left: 0,
                          width: 0,
                          height: 0,
                        },
                      });

                    }, 100);

                    // Show a loading message for artifacts
                    return (
                      <div
                        key={toolCallId}
                        className="flex flex-row gap-2 items-start"
                      >
                        <div className="w-full p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                            <span className="text-sm text-muted-foreground">
                              {artifactKind === "image" && "Generating image..."}
                              {artifactKind === "video" && "Generating video..."}
                              {artifactKind === "text" && "Creating document..."}
                              {artifactKind === "sheet" && "Creating spreadsheet..."}
                              {artifactKind === "script" && "Creating script..."}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                }
              }

              return null;
            })}

            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                vote={vote}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
    if (!equal(prevProps.vote, nextProps.vote)) return false;

    return true;
  }
);

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message min-h-96"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          }
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
