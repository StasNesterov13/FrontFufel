export const loginUser = async (username:string|null, password:string|null) => {
  const formData = new URLSearchParams();
  formData.append("username", username ?? "");
  formData.append("password", password ?? "") ;
  const response = await fetch("http://192.168.0.102:8000/api/v1/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  
  const data = await response.json(); // { access_token: "..." }
  return data;
};

export const registerUser = async (email: string | null, password: string | null) => {
  const response = await fetch("http://192.168.0.102:8000/api/v1/users/register", {
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
