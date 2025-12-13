import { API_BASE_URL } from '@/constants/config';
import { ScreenNavigationProp } from '@/types/navigation';

export interface ProfileData {
  first_name: string;
  last_name: string;
  gender: string;
  birth_date: string;
  height: number;
  activity_level: string;
  diet_type: string;
}

export const createProfile = async (
  token: string,
  profileData: ProfileData,
  navigation: ScreenNavigationProp
) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/profiles/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
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

export const getProfile = async (token: string, navigation: ScreenNavigationProp) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/profiles/`, {
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
    throw new Error(error, {
      cause: {
        status: response.status,
      },
    });
  }

  return await response.json();
};
