import { API_BASE_URL } from "@/constants/config";
export const loginUser = async (username: string | null, password: string | null) => {
  const formData = new URLSearchParams();
  formData.append("username", username ?? "");
  formData.append("password", password ?? "");

  const response = await fetch(`${API_BASE_URL}/api/v1/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  return await response.json();
};
