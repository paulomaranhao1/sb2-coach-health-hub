
import React, { forwardRef } from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends ButtonProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  loading?: boolean;
  loadingText?: string;
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ children, loading, loadingText, className, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "transition-all duration-200",
          loading && "cursor-wait opacity-75",
          className
        )}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            {loadingText || 'Carregando...'}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export { AccessibleButton };
