
export const mockUserProfile = {
  user_id: 'mock-user-123',
  name: 'João Silva',
  email: 'joao@example.com',
  weight: 85,
  height: 175,
  age: 30,
  gender: 'male',
  goal_weight: 75,
  onboarding_completed: true,
  auth_provider: 'email'
};

export const mockUserStats = {
  points: 1250,
  level: 8,
  streak: 15,
  shields: ['first_weigh', 'week_streak', 'month_active'],
  stickers: ['healthy_meal', 'workout_done', 'water_goal'],
  last_activity_date: new Date().toISOString().split('T')[0],
  total_photos_analyzed: 45,
  total_calories_tracked: 12500
};

export const mockSubscription = {
  subscription_type: 'premium',
  subscription_active: true,
  subscription_expires_at: '2024-12-31'
};

export const mockWeightEntries = [
  { id: '1', weight: 85, date: '2024-01-15', created_at: '2024-01-15T10:00:00Z' },
  { id: '2', weight: 84.5, date: '2024-01-22', created_at: '2024-01-22T10:00:00Z' },
  { id: '3', weight: 83.8, date: '2024-01-29', created_at: '2024-01-29T10:00:00Z' },
  { id: '4', weight: 83.2, date: '2024-02-05', created_at: '2024-02-05T10:00:00Z' },
  { id: '5', weight: 82.7, date: '2024-02-12', created_at: '2024-02-12T10:00:00Z' }
];
