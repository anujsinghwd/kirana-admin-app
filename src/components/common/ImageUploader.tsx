import React, { useState, useEffect } from "react";

export interface ImageUploaderProps {
  /** Maximum images allowed */
  maxCount?: number;
  /** Existing image URLs for edit mode */
  defaultImages?: string[];
  /** Called when images change */
  onChange: (files: FileList | null, previews: string[]) => void;
}

/**
 * ✅ ImageUploader
 * Reusable component for uploading, previewing, and managing images.
 * Works seamlessly on mobile and desktop (camera support included).
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({
  maxCount = 3,
  defaultImages = [],
  onChange,
}) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [previews, setPreviews] = useState<string[]>(defaultImages);

  /** ---------------------------
   * 🧩 Add new image (camera or file picker)
   ----------------------------*/
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previews.length >= maxCount) {
      alert(`You can upload a maximum of ${maxCount} images.`);
      return;
    }

    // Construct new FileList
    const dt = new DataTransfer();
    if (files) Array.from(files).forEach((f) => dt.items.add(f));
    dt.items.add(file);

    setFiles(dt.files);
    setPreviews((prev) => [...prev, URL.createObjectURL(file)]);
  };

  /** ---------------------------
   * ❌ Remove image
   ----------------------------*/
  const handleRemoveImage = (index: number) => {
    if (!files && defaultImages.length === 0) {
      setPreviews((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    const newPreviews = previews.filter((_, i) => i !== index);
    const dt = new DataTransfer();

    if (files) {
      const filesArr = Array.from(files);
      filesArr.splice(index, 1);
      filesArr.forEach((f) => dt.items.add(f));
    }

    setFiles(dt.files.length > 0 ? dt.files : null);
    setPreviews(newPreviews);
  };

  /** ---------------------------
   * 🔁 Sync with parent component
   ----------------------------*/
  useEffect(() => {
    onChange(files, previews);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, previews]);

  /** ---------------------------
   * 🧰 Helper: Disable upload if max reached
   ----------------------------*/
  const isDisabled = previews.length >= maxCount;

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        Upload Images
      </label>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((url, i) => (
            <div key={i} className="relative group">
              <img
                src={url}
                alt={`preview-${i}`}
                className="w-24 h-24 object-cover border border-gray-200 rounded-md shadow-sm"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(i)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-90 hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Buttons */}
      <div className="flex gap-3 flex-wrap">
        {/* Camera Button */}
        <label
          className={`flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer text-sm ${
            isDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <CameraIcon />
          Take Photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleAddImage}
            className="hidden"
            disabled={isDisabled}
          />
        </label>

        {/* Gallery Button */}
        <label
          className={`flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded cursor-pointer text-sm hover:bg-blue-50 ${
            isDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <AddPhotoIcon />
          Add Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleAddImage}
            className="hidden"
            disabled={isDisabled}
          />
        </label>
      </div>

      {/* Hint */}
      <p className="text-xs text-gray-500">
        You can upload up to <strong>{maxCount}</strong> images.
      </p>
    </div>
  );
};

/** ---------------------------
 * 📷 Icon: Camera
 ----------------------------*/
const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 11.25v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

/** ---------------------------
 * 🖼️ Icon: Add Photo
 ----------------------------*/
const AddPhotoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

export default ImageUploader;
