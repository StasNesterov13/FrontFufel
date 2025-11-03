export const createProfile = async (
  token: string,
  profileData: {
    first_name: string;
    last_name: string;
    gender: string;
    birth_date: string; // ISO-формат, например "2000-05-12T00:00:00"
    height: number;
    activity_level: string;
    diet_type: string;
  }
) => {
  const response = await fetch("http://192.168.0.102:8000/api/v1/profiles/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // токен для Depends(verify_access_token)
    },
    body: JSON.stringify(profileData),
    
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
};


export const getProfile = async (token: string) => {
  const response = await fetch("http://192.168.0.102:8000/api/v1/profiles/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
};

