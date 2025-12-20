import { API_BASE_URL } from '@/constants/config';

export const getGenders = async (token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/meta/genders`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error, { cause: { status: response.status } });
  }

  return response.json();
};

export const getMealTypes = async (token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/meta/meal_types`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error, { cause: { status: response.status } });
  }

  return response.json();
};

export const getStatuses = async (token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/meta/statuses`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error, { cause: { status: response.status } });
  }

  return response.json();
};

export const getActivityLevels = async (token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/meta/activity-levels`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error, { cause: { status: response.status } });
  }

  return response.json();
};

export const getDietTypes = async (token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/meta/diets`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error, { cause: { status: response.status } });
  }

  return response.json();
};

export const getGoalTypes = async (token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/meta/goals`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error, { cause: { status: response.status } });
  }

  return response.json();
};
