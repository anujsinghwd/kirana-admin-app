import { useLayoutEffect } from 'react';

/**
 * Hook to lock the body scroll when a modal is open.
 * It saves the original overflow style and restores it on cleanup.
 * This handles nested modals correctly by restoring the previous state (e.g., 'hidden' -> 'hidden').
 */
export const useLockBodyScroll = (isOpen: boolean) => {
  useLayoutEffect(() => {
    if (!isOpen) return;

    // Save original style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';

    // Restore original style on cleanup
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);
};
