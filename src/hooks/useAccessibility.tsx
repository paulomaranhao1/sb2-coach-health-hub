
import { useRef, useState, useCallback, useEffect } from 'react';

interface UseAccessibilityOptions {
  announceChanges?: boolean;
  enableKeyboardNavigation?: boolean;
  focusOnMount?: boolean;
}

export const useAccessibility = <T extends HTMLElement = HTMLDivElement>(
  options: UseAccessibilityOptions = {}
) => {
  const {
    announceChanges = false,
    enableKeyboardNavigation = false,
    focusOnMount = false
  } = options;

  const containerRef = useRef<T>(null);
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const announce = useCallback((message: string) => {
    if (announceChanges) {
      setAnnouncements(prev => [...prev.slice(-2), message]); // Keep last 3 announcements
      
      // Clear announcements after a delay to prevent accumulation
      setTimeout(() => {
        setAnnouncements(prev => prev.slice(1));
      }, 3000);
    }
  }, [announceChanges]);

  const handleKeyNavigation = useCallback((event: KeyboardEvent) => {
    if (!enableKeyboardNavigation || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const focusableArray = Array.from(focusableElements) as HTMLElement[];
    const currentIndex = focusableArray.indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % focusableArray.length;
        focusableArray[nextIndex]?.focus();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = currentIndex === 0 ? focusableArray.length - 1 : currentIndex - 1;
        focusableArray[prevIndex]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        focusableArray[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        focusableArray[focusableArray.length - 1]?.focus();
        break;
    }
  }, [enableKeyboardNavigation]);

  useEffect(() => {
    if (enableKeyboardNavigation && containerRef.current) {
      const container = containerRef.current;
      container.addEventListener('keydown', handleKeyNavigation);
      
      return () => {
        container.removeEventListener('keydown', handleKeyNavigation);
      };
    }
  }, [enableKeyboardNavigation, handleKeyNavigation]);

  useEffect(() => {
    if (focusOnMount && containerRef.current) {
      const firstFocusable = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      firstFocusable?.focus();
    }
  }, [focusOnMount]);

  return {
    containerRef,
    announce,
    announcements: announcements.filter(Boolean)
  };
};
