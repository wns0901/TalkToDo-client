import api from "./baseApi";

export const login = (username, password) => {
  return api.post(
    "login",
    { username, password },
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
};

export const userInfo = () => {
  return api.get("/auth");
};

export const logout = () => {
  return api.post("/logout");
};
