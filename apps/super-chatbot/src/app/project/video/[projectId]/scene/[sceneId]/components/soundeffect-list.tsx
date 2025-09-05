import { FileTypeEnum, type IFileRead, type ISceneRead } from "@turbo-super/api";
import { AudioFile } from "./audio-file";
import { EmptyAudioFile } from "./empty-audio-file";

export function SoundEffectList({
  files,
  scene,
  onSelect,
  isLoading,
}: {
  files: IFileRead[];
  scene: ISceneRead | null;
  onSelect: (file: IFileRead, isPlaceholder?: boolean) => void;
  isLoading?: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 text-sm font-medium text-muted-foreground">
        Sound Effect Files
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
                // Создаем placeholder объект для sound effect
                const placeholderFile: IFileRead = {
                  id: "placeholder-soundeffect",
                  url: null,
                  thumbnail_url: null,
                  type: FileTypeEnum.SOUND_EFFECT,
                  image_generation_id: null,
                  image_generation: null,
                  video_generation_id: null,
                  video_generation: null,
                  audio_generation_id: null,
                  audio_generation: null,
                  duration: null,
                  tasks: [],
                };
                onSelect(placeholderFile, true);
              }}
              type="soundeffect"
              isActive={!scene?.sound_effect_id}
            />

            {/* Файлы */}
            {files.map((file) => (
              <AudioFile
                key={file.id}
                file={file}
                scene={scene}
                onSelect={onSelect}
                type="soundeffect"
                isActive={scene?.sound_effect_id === file.id}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
