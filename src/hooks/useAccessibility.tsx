
import { useEffect, useRef, useState } from 'react';
import { useLogger } from '@/utils/logger';

interface UseAccessibilityOptions {
  focusOnMount?: boolean;
  trapFocus?: boolean;
  announceChanges?: boolean;
  enableKeyboardNavigation?: boolean;
}

export function useAccessibility(options: UseAccessibilityOptions = {}) {
  const {
    focusOnMount = false,
    trapFocus = false,
    announceChanges = false,
    enableKeyboardNavigation = true
  } = options;

  const containerRef = useRef<HTMLElement>(null);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const logger = useLogger('useAccessibility');

  // Focus management
  useEffect(() => {
    if (focusOnMount && containerRef.current) {
      const firstFocusable = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      if (firstFocusable) {
        firstFocusable.focus();
        logger.info('Auto-focused first element on mount');
      }
    }
  }, [focusOnMount, logger]);

  // Focus trap
  useEffect(() => {
    if (!trapFocus || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [trapFocus]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNavigation || !containerRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      
      // Arrow key navigation for buttons and links
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const focusableElements = Array.from(
          containerRef.current!.querySelectorAll(
            'button:not([disabled]), [role="button"]:not([aria-disabled="true"]), a[href]'
          )
        ) as HTMLElement[];

        const currentIndex = focusableElements.indexOf(target);
        if (currentIndex === -1) return;

        let nextIndex = currentIndex;
        
        switch (e.key) {
          case 'ArrowUp':
          case 'ArrowLeft':
            nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
            break;
          case 'ArrowDown':
          case 'ArrowRight':
            nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
            break;
        }

        e.preventDefault();
        focusableElements[nextIndex]?.focus();
        logger.info('Navigated with keyboard', { direction: e.key });
      }
    };

    containerRef.current.addEventListener('keydown', handleKeyDown);
    return () => containerRef.current?.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardNavigation, logger]);

  // Screen reader announcements
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announceChanges) return;

    setAnnouncements(prev => [...prev, message]);
    logger.info('Screen reader announcement', { message, priority });

    // Clear announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(ann => ann !== message));
    }, 1000);
  };

  return {
    containerRef,
    announce,
    announcements
  };
}
