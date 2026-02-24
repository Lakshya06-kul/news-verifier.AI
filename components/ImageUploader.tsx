
import React, { useRef } from 'react';

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageChange: (file: File) => void;
  onClear: () => void;
}

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const ImageUploader: React.FC<ImageUploaderProps> = ({ imagePreview, onImageChange, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageChange(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div>
      {imagePreview ? (
        <div className="relative group">
            <img src={imagePreview} alt="News article preview" className="w-full h-auto max-h-96 object-contain rounded-lg shadow-md" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <button onClick={onClear} className="bg-red-500 text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 transition-colors">
                    Remove Image
                </button>
            </div>
        </div>
      ) : (
        <div 
            className="border-2 border-dashed border-brand-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-brand-blue hover:bg-blue-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
          />
          <UploadIcon className="mx-auto h-12 w-12 text-brand-gray-600"/>
          <p className="mt-2 text-sm font-medium text-brand-gray-800">
            <span className="text-brand-blue">Click to upload</span> or drag and drop
          </p>
          <p className="mt-1 text-xs text-brand-gray-600">PNG, JPG, WEBP</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
