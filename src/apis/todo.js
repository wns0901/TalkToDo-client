import api from "./baseApi";

// 할일 전체 조회
export const getTodosByUser = (userId) => api.get(`/api/todos/user/${userId}`);
// 할일 추가
export const createTodo = (todo) => api.post(`/api/todos`, todo);
// 할일 수정
export const updateTodo = (id, todo) => api.put(`/api/todos/${id}`, todo);
// 할일 삭제
export const deleteTodo = (id) => api.delete(`/api/todos/${id}`);
// 할일 완료 토글
export const toggleTodoComplete = (id) => api.put(`/api/todos/${id}/complete`);
// 할일 복구
export const restoreTodo = (id) => api.put(`/api/todos/${id}/restore`);
// 활성 할일만
export const getActiveTodos = (userId) => api.get(`/api/todos/user/${userId}/active`);
// 완료된 할일만
export const getCompletedTodos = (userId) => api.get(`/api/todos/user/${userId}/completed`); 
