import api from "./baseApi";

// 카테고리 목록 조회
export const getCategories = (userId) => api.get(`/api/categories/user/${userId}`);
// 카테고리 추가
export const addCategory = (userId, category) => api.post(`/api/categories/user/${userId}`, category, { headers: { 'Content-Type': 'application/json' } });
// 카테고리 삭제
export const deleteCategory = (userId, category) => api.delete(`/api/categories/user/${userId}/${encodeURIComponent(category)}`); 