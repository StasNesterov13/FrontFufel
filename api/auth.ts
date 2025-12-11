import { API_BASE_URL } from "@/constants/config"
import { ScreenNavigationProp } from "@/types/navigation"

export const loginUser = async (
  username: string,
  password: string,
  navigation: ScreenNavigationProp
) => {
  const formData = new URLSearchParams()
  formData.append("username", username)
  formData.append("password", password)

  const response = await fetch(`${API_BASE_URL}/api/v1/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  })

  if (!response.ok) {
    if (response.status === 401) {
      navigation.navigate("Login") // редирект на экран логина
      return
    }
    const error = await response.text()
    throw new Error(error)
  }

  return await response.json()
}
