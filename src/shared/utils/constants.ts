
// Application constants
export const APP_NAME = 'SB2coach.ai';

export const ROUTES = {
  HOME: '/',
  PRIVACY: '/privacy-policy',
  TERMS: '/terms-of-service',
} as const;

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;
