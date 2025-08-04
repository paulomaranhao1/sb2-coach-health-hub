
export interface UserProfile {
  id?: string;
  user_id: string;
  name?: string;
  email?: string;
  age?: number;
  weight?: number;
  height?: number;
  goal_weight?: number;
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal?: 'lose_weight' | 'maintain_weight' | 'gain_weight';
  created_at?: string;
  updated_at?: string;
  onboarding_completed?: boolean;
}

export interface UserStats {
  id?: string;
  user_id: string;
  points: number;
  level: number;
  shields: string[];
  stickers: string[];
  streak: number;
  created_at?: string;
  updated_at?: string;
}
