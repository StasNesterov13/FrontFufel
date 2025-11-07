export interface MenuPlanCreate {
  start_date: string; // пример: "2025-11-06"
  end_date: string;   // пример: "2025-11-13"
}

export const createMenuPlan = async (
  token: string,
  menuData: MenuPlanCreate
) => {
  const response = await fetch("http://192.168.0.102:8000/api/v1/menu-plans/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(menuData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
};


export const getMenuPlan = async (token: string) => {
  const response = await fetch("http://192.168.0.102:8000/api/v1/menu-plans/", {
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


export const deleteMenuPlan = async (token: string) => {
  const response = await fetch("http://192.168.0.102:8000/api/v1/menu-plans/", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
};

