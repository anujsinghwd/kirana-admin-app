import React from "react";

/**
 * Props for NoData component
 */
interface NoDataProps {
  message?: string; // Optional custom message
  className?: string; // Optional custom styles
  imageSize?: number; // Optional image width (in px)
}

/**
 * A reusable placeholder component for "no data" states.
 */
const NoData: React.FC<NoDataProps> = ({
  message = "No Data",
  className = "",
  imageSize = 144, // default 36 * 4 (w-36)
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 gap-2 text-center ${className}`}
    >
      <img
        src={"https://res.cloudinary.com/decexqep6/image/upload/v1762003420/nothing_c4yc3a.webp"}
        alt="No data illustration"
        width={imageSize}
        height={imageSize}
        className="object-contain"
        loading="lazy"
      />
      <p className="text-neutral-500 text-sm md:text-base">{message}</p>
    </div>
  );
};

export default NoData;
