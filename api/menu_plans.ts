import { API_BASE_URL } from '@/constants/config';

export interface MenuPlanData {
  start_date: string;
  end_date: string;
}

export const createMenuPlan = async (token: string | null, menuPlanData: MenuPlanData) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/menu-plans/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(menuPlanData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};

export const getMenuPlan = async (token: string | null, target_date: string) => {
  const url = new URL(`${API_BASE_URL}/api/v1/menu-plans/`);
  url.searchParams.append('target_date', target_date);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};

export const deleteMenuPlan = async (token: string | null, id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/menu-plans/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};

export const updateMenuPlan = async (token: string | null, recipeId: number) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/menu-plans/recipe/${recipeId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};
