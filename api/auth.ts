import { API_BASE_URL } from '@/constants/config';

export const login = async (username: string, password: string) => {
  const body = new URLSearchParams();
  body.append('username', username);
  body.append('password', password);

  const response = await fetch(`${API_BASE_URL}/api/v1/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};
