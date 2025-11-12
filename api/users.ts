import { API_BASE_URL } from "@/constants/config";
export const registerUser = async (email: string | null, password: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email ?? "", password: password ?? "" }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
};
