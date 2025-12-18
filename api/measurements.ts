import { API_BASE_URL } from '@/constants/config';
import { MeasurementData } from '@/types/data';

export const createMeasurements = async (
  token: string | null,
  measurementData: MeasurementData
) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/measurements/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(measurementData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};

export const getAllMeasurements = async (token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/measurements/`, {
    method: 'GET',
    headers: {
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

export const getLastMeasurement = async (token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/measurements/latest`, {
    method: 'GET',
    headers: {
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

export const updateMeasurements = async (
  token: string | null,
  measurementData: MeasurementData
) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/measurements/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(measurementData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};
