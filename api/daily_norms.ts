import { API_BASE_URL } from "@/constants/config"
import { ScreenNavigationProp } from "@/types/navigation"


export const getDailyNorms = async (
  token: string,
  navigation: ScreenNavigationProp
) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/daily-norms/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      navigation.navigate("Login")
      return
    }

    const error = await response.text()
    throw new Error(error, {
      cause: { status: response.status },
    })
  }

  return await response.json()
}

export const recalculateDailyNorms = async (
  token: string,
  navigation: ScreenNavigationProp
) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/daily-norms/recalculate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      navigation.navigate("Login")
      return
    }

    const error = await response.text()
    throw new Error(error)
  }

  return await response.json()
}

export const getDailyProgress = async (
  token: string,
  target_date: string ,   
  navigation: ScreenNavigationProp
) => {
  const query = new URLSearchParams(target_date)
  query.append("target_date", target_date)

  const response = await fetch(
    `${API_BASE_URL}/api/v1/daily-norms/progress?${query}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    if (response.status === 401) {
      navigation.navigate("Login")
      return
    }

    const error = await response.text()
    throw new Error(error)
  }

  return await response.json()
}
