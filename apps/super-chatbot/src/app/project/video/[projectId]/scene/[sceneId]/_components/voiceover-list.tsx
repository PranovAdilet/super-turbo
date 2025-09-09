import { FileTypeEnum, type IFileRead } from "@turbo-super/api";
import { AudioFile } from "./audio-file";
import { EmptyAudioFile } from "./empty-audio-file";
import { useFileList, useSceneGetById, useSceneUpdate } from "@/lib/api";

export function VoiceoverList({
  projectId,
  sceneId,
  onCreateAudio,
}: {
  projectId: string;
  sceneId: string;
  onCreateAudio?: () => void;
}) {
  const { data: scene, isLoading: isSceneLoading } = useSceneGetById({
    id: sceneId,
  });

  const { data: files, isLoading: isFilesLoading } = useFileList({
    projectId,
    sceneId,
    types: [FileTypeEnum.VOICEOVER],
  });

  const { mutate: update } = useSceneUpdate();

  const handleSelect = (file: IFileRead | null, isPlaceholder?: boolean) => {
    if (!scene) return;
    if (!scene.file_id) return;

    const id = isPlaceholder ? null : file?.id;

    update({
      id: scene.id,
      requestBody: {
        ...scene,
        file_id: scene.file_id,
        voiceover_id: id,
      },
    });
  };

  const isLoading = isFilesLoading || isSceneLoading;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 text-sm font-medium text-muted-foreground">
        Voiceover Files
      </div>
      <div className="flex size-full gap-3 overflow-auto">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse aspect-video rounded-lg border bg-muted"
            />
          ))
        ) : (
          <>
            {/* Пустая карточка для сброса выбора */}
            <EmptyAudioFile
              onSelect={() => {
                // Создаем placeholder объект для voiceover
                const placeholderFile: IFileRead = {
                  id: "placeholder-voiceover",
                  url: null,
                  thumbnail_url: null,
                  type: FileTypeEnum.VOICEOVER,
                  image_generation_id: null,
                  image_generation: null,
                  video_generation_id: null,
                  video_generation: null,
                  audio_generation_id: null,
                  audio_generation: null,
                  duration: null,
                  tasks: [],
                };
                handleSelect(placeholderFile, true);
              }}
              isActive={!scene?.voiceover_id}
              onCreateAudio={onCreateAudio}
            />

            {/* Файлы */}
            {files?.items?.map((file) => (
              <AudioFile
                key={file.id}
                file={file}
                onSelect={handleSelect}
                type="voiceover"
                isActive={scene?.voiceover_id === file.id}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
