import { Plus, CircleSlash2 } from "lucide-react";

interface EmptyAudioFileProps {
  onSelect: () => void;
  isActive: boolean;
  onCreateAudio?: () => void;
}

export function EmptyAudioFile({
  onSelect,
  isActive,
  onCreateAudio,
}: EmptyAudioFileProps) {
  return (
    <div className="group relative aspect-video max-w-[300px]">
      {/* Оборудуем кнопку onClick для выбора */}
      <button
        onClick={onSelect}
        className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-lg border-2  transition-all duration-200 ${
          isActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/20"
        }`}
      >
        {/* Иконка типа файла */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/20 mb-3">
          <CircleSlash2 />
        </div>

        {/* Плюс иконка без вложенной кнопки */}
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/40 cursor-pointer hover:bg-muted/90"
          onClick={(e) => {
            e.stopPropagation();
            onCreateAudio?.();
          }}
        >
          <Plus className="size-5 text-muted-foreground" />
        </div>

        {/* Overlay при hover */}
        {/* {hovered && (
          <div className="absolute inset-0 bg-black/5 transition-opacity duration-200" />
        )} */}
      </button>

      {/* Индикатор активного состояния */}
      {isActive && (
        <div className="absolute top-1 left-1 p-1.5 bg-primary text-primary-foreground rounded-full shadow-lg z-20">
          <div className="w-2 h-2 bg-current rounded-full" />
        </div>
      )}
    </div>
  );
}
