import api from './api';

export const login = (username, password) => {
  return api.post('/auth/login', { username, password });
};

export const userInfo = () => {
  return api.get('/auth/userinfo');
};

export const logout = () => {
  return api.post('/auth/logout');
}; 