import { API_BASE_URL } from '@/constants/config';
import { GoalData } from '@/types/data';

export const createGoals = async (token: string | null, goalData: GoalData) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/goals/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(goalData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};

export const getGoals = async (token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/goals/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error, {
      cause: {
        status: response.status,
      },
    });
  }

  return await response.json();
};

export const updateGoals = async (token: string | null, goalData: GoalData) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/goals/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(goalData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};
