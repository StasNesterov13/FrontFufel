import { API_BASE_URL } from '@/constants/config';
import { MenuPlanDataAPI } from '@/types/dataAPI';
import { ScreenNavigationProp } from '@/types/navigation';

// Создать меню-план
export const createMenuPlan = async (
  token: string,
  navigation: ScreenNavigationProp,
  menuData: MenuPlanDataAPI
) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/menu-plans/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(menuData),
  });

  if (!response.ok) {
    if (response.status === 401) {
      navigation.navigate('Login');
      return;
    }
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};

// Получить меню-план
export const getMenuPlan = async (token: string, navigation: ScreenNavigationProp) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/menu-plans/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      navigation.navigate('Login');
      return;
    }
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};

// Удалить меню-план
export const deleteMenuPlan = async (token: string, navigation: ScreenNavigationProp) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/menu-plans/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      navigation.navigate('Login');
      return;
    }
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};

// Заменить рецепт
export const replaceRecipe = async (
  token: string,
  navigation: ScreenNavigationProp,
  recipeId: number
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/menu-plans/replace-recipe?recipe_id=${recipeId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      navigation.navigate('Login');
      return;
    }
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};
