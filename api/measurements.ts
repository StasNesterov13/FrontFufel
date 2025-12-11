import { API_BASE_URL } from "@/constants/config"
import { ScreenNavigationProp } from "@/types/navigation"

type MeasurementData = {
  measured_at: string
  weight: number
  bodyfat: number
  notes: string
}

// Создать измерение
export const createMeasurements = async (
  token: string,
  measurementData: MeasurementData,
  navigation: ScreenNavigationProp
) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/measurements/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(measurementData),
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

// Получить измерения
export const getMeasurements = async (
  token: string,
  navigation: ScreenNavigationProp
) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/measurements/`, {
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
      cause: {
        status: response.status,
      },
    });
  }

  return await response.json()
}

// Получить измерения
export const getLastMeasurements = async (
  token: string,
  navigation: ScreenNavigationProp
) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/measurements/latest`, {
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
      cause: {
        status: response.status,
      },
    });
  }

  return await response.json()
}

// Обновить измерение (частично)
export const updateMeasurements = async (
  token: string,
  measurementData: Partial<MeasurementData>,
  navigation: ScreenNavigationProp
) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/measurements/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(measurementData),
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
