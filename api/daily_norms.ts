import { API_BASE_URL } from '@/constants/config';

export const getDailyNorms = async (token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/daily-norms/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error, {
      cause: { status: response.status },
    });
  }

  return await response.json();
};

export const recalculateDailyNorms = async (token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/daily-norms/recalculate`, {
    method: 'POST',
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

export const getDayProgress = async (token: string | null, target_date: string) => {
  const query = new URLSearchParams({
    target_date: target_date,
  }).toString();

  const response = await fetch(`${API_BASE_URL}/api/v1/daily-norms/progress?${query}`, {
    method: 'GET',
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
