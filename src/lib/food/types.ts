
export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  confidence: number;
}

export interface FoodAnalysis {
  foods: FoodItem[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  recommendations: string[];
  timestamp: string;
}
