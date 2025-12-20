import { API_BASE_URL } from '@/constants/config';

export interface RecipeNutrition {
  grams: number;
}

export const calculateRecipeNutrition = async (
  token: string | null,
  recipeId: number,
  nutritionData: RecipeNutrition
) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/recipes/${recipeId}/nutrition`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(nutritionData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error, {
      cause: {
        status: response.status,
      },
    });
  }

  return response.json();
};
