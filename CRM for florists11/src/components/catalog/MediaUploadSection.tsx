import { ImageUploader } from "../ImageUploader";

interface MediaUploadSectionProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function MediaUploadSection({ images, onImagesChange }: MediaUploadSectionProps) {
  return (
    <div className="p-6 pb-4 lg:p-0">
      <div className="space-y-4 lg:space-y-6">
        <div className="lg:space-y-2">
          <label className="hidden lg:block text-gray-700 mb-4">
            Фотографии и видео
          </label>
          <ImageUploader 
            images={images}
            onImagesChange={onImagesChange}
            maxImages={8}
          />
        </div>
        <div className="bg-gray-50 rounded-lg h-16 flex items-center px-4 hover:bg-gray-100 transition-colors cursor-pointer lg:h-12">
          <svg className="w-8 h-8" fill="none" preserveAspectRatio="none" viewBox="0 0 28 23">
            <g>
              <path d="M0 0h28v23H0z" fill="#C8C0D3" />
            </g>
          </svg>
          <p className="text-gray-900 ml-4 lg:text-gray-700">
            Добавьте видео
          </p>
        </div>
      </div>
    </div>
  );
}