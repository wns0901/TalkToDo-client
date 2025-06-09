import api from "./api";

// 활성화된 TODO 목록 조회
export const getActiveTodos = async () => {
  const response = await api.get("/api/todos/active");
  return response.data;
};

// 완료된 TODO 목록 조회
export const getCompletedTodos = async () => {
  const response = await api.get("/api/todos/completed");
  return response.data;
};

// TODO 생성
export const createTodo = async (todoData) => {
  const response = await api.post("/api/todos", todoData);
  return response.data;
};

// TODO 수정
export const updateTodo = async (id, todoData) => {
  const response = await api.put(`/api/todos/${id}`, todoData);
  return response.data;
};

// TODO 삭제
export const deleteTodo = async (id) => {
  const response = await api.delete(`/api/todos/${id}`);
  return response.data;
};

// TODO 완료 상태 토글
export const toggleTodoComplete = async (id) => {
  const response = await api.put(`/api/todos/${id}/toggle`);
  return response.data;
};

// TODO를 캘린더에 추가
export const addTodoToCalendar = async (todoId, scheduleData) => {
  const response = await api.post(`/api/todos/${todoId}/schedule`, scheduleData);
  return response.data;
};

// TODO를 캘린더에서 제거
export const removeTodoFromCalendar = async (todoId) => {
  const response = await api.delete(`/api/todos/${todoId}/schedule`);
  return response.data;
}; 