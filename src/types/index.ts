export interface MealPlan {
  summary: string
  meals: Array<{ name: string; calories: number; protein: number; carbs: number; fat: number }>
}

export interface NutritionMetrics {
  bmi: number
  bmr: number
  tdee: number
  calorie_goal: number
  protein_grams: number
  carbs_grams: number
  fat_grams: number
}
