export const loginUser = async (username:string|null, password:string|null) => {
  const formData = new URLSearchParams();
  formData.append("username", username ?? "");
  formData.append("password", password ?? "") ;
  const response = await fetch("http://127.0.0.1:8000/api/v1/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });
  console.log(response)
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const data = await response.json(); // { access_token: "..." }
  return data;
};