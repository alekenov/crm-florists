import React, { useRef, useState } from "react";
import { Camera, X, Plus } from "lucide-react";
import { Button } from "./ui/button";

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUploader({
  images,
  onImagesChange,
  maxImages = 5,
  className = "",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages: string[] = [];
    const remainingSlots = maxImages - images.length;
    const filesToProcess = Math.min(
      files.length,
      remainingSlots,
    );

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === filesToProcess) {
              onImagesChange([...images, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Загруженные изображения */}
      {images.length > 0 && images.length <= 2 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div
                className="aspect-[3/4] bg-cover bg-center rounded-xl overflow-hidden border border-gray-200"
                style={{ backgroundImage: `url('${image}')` }}
              >
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded-md">
                    Главное
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Компактный список для 3+ изображений */}
      {images.length >= 3 && (
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Фотографии ({images.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div
                key={`thumb-${index}`}
                className="relative group"
              >
                <div
                  className="w-16 h-20 bg-cover bg-center rounded-lg border border-gray-200"
                  style={{ backgroundImage: `url('${image}')` }}
                >
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5 bg-black/70 text-white text-xs text-center rounded-b-lg">
                      Главное
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Область загрузки */}
      {canAddMore && (
        <div
          className={`border-2 border-dashed rounded-xl transition-colors cursor-pointer touch-manipulation ${
            dragOver
              ? "border-purple-400 bg-purple-50"
              : "border-gray-200 hover:border-gray-300"
          } ${images.length === 0 ? "h-48" : "h-32"}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              {images.length === 0 ? (
                <Camera className="w-6 h-6 text-gray-400" />
              ) : (
                <Plus className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <p className="text-gray-900 font-medium mb-1">
              {images.length === 0
                ? "Добавьте фото букета"
                : "Добавить ещё фото"}
            </p>
            <p className="text-gray-500 text-sm text-center">
              {images.length === 0
                ? "Нажмите или перетащите изображения сюда"
                : `Ещё ${maxImages - images.length} ${maxImages - images.length === 1 ? "фото" : "фотографий"}`}
            </p>
          </div>
        </div>
      )}

      {/* Скрытый input для выбора файлов */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Подсказка */}
      {images.length === 0 && (
        <p className="text-xs text-gray-500 text-center">
          Первое фото будет использоваться как главное
          изображение товара
        </p>
      )}
    </div>
  );
}