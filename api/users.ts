import { API_BASE_URL } from '@/constants/config';
import { UserData } from '@/types/data';

export const registerUser = async (userData: UserData) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};

export const getUser = async (token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
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
