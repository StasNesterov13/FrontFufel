import { API_BASE_URL } from '@/constants/config';
import { ScreenNavigationProp } from '@/types/navigation';

type GoalData = {
  type: string;
  target_weight: number;
  start_at: string;
  end_at: string;
};

// Создать цель
export const createGoals = async (
  token: string,
  goalData: GoalData,
  navigation: ScreenNavigationProp
) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/goals/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(goalData),
  });

  if (!response.ok) {
    if (response.status === 401) {
      navigation.navigate('Login'); // редирект на Login при 401
      return;
    }
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};

// Получить цели
export const getGoals = async (token: string, navigation: ScreenNavigationProp) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/goals/`, {
    method: 'GET',
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
    throw new Error(error, {
      cause: {
        status: response.status,
      },
    });
  }

  return await response.json();
};

export const updateGoals = async (
  token: string,
  goalData: Partial<GoalData>,
  navigation: ScreenNavigationProp
) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/goals/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(goalData),
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
