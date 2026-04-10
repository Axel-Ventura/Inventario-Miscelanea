import { apiUrl } from "./api-base";

export const loginRequest = async (data) => {
  const res = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const logoutRequest = async (token) => {
  await fetch(apiUrl("/api/auth/logout"), {
    method: "POST",
    headers: {
      Authorization: token,
    },
  });
};

export const logoutAllRequest = async (token) => {
  await fetch(apiUrl("/api/auth/logout-all"), {
    method: "POST",
    headers: {
      Authorization: token,
    },
  });
};