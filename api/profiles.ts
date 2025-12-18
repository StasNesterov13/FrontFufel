import { API_BASE_URL } from '@/constants/config';
import { ProfileData } from '@/types/data';

export const createProfile = async (token: string | null, profileData: ProfileData) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/profiles/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};

export const updateProfile = async (token: string | null, profileData: ProfileData) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/profiles/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};

export const getProfile = async (token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/profiles/`, {
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
