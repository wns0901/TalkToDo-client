import api from "./baseApi";

// 일정 전체 조회
export const getSchedulesByUser = (userId) => api.get(`/api/schedules/user/${userId}`);
// 일정 추가
export const createSchedule = (schedule) => api.post(`/api/schedules`, schedule);
// 일정 수정
export const updateSchedule = (id, schedule) => api.put(`/api/schedules/${id}`, schedule);
// 일정 삭제
export const deleteSchedule = (id) => api.delete(`/api/schedules/${id}`);
// 할일을 캘린더에 추가
export const addTodoToCalendar = (todoId, schedule) => api.post(`/api/schedules/todo/${todoId}/calendar`, schedule);
// 할일을 캘린더에서 제거
export const removeTodoFromCalendar = (todoId) => api.delete(`/api/schedules/todo/${todoId}/calendar`); 