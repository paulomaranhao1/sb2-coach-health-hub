
import React from 'react';

interface ScreenReaderAnnouncerProps {
  announcements: string[];
  priority?: 'polite' | 'assertive';
}

const ScreenReaderAnnouncer = ({ 
  announcements, 
  priority = 'polite' 
}: ScreenReaderAnnouncerProps) => {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {announcements.map((announcement, index) => (
        <div key={`${announcement}-${index}`}>
          {announcement}
        </div>
      ))}
    </div>
  );
};

export { ScreenReaderAnnouncer };
