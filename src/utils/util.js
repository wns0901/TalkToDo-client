import api from "../apis/baseApi";

export const hasToken = () => {
  const token = api.defaults.headers.common.Authorization;
  return token !== undefined && token !== null && token !== "";
};

export const getToken = () => {
  return api.defaults.headers.common.Authorization;
};
