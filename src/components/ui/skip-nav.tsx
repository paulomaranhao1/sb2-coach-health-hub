
import React from 'react';
import { cn } from '@/lib/utils';

interface SkipNavProps {
  links: Array<{
    href: string;
    label: string;
  }>;
  className?: string;
}

const SkipNav = ({ links, className }: SkipNavProps) => {
  return (
    <nav 
      className={cn(
        "sr-only focus-within:not-sr-only",
        "fixed top-0 left-0 z-50 bg-white shadow-lg p-4",
        "flex gap-2",
        className
      )}
      aria-label="Links de navegação rápida"
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};

export { SkipNav };
