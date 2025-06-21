import api from "./baseApi";

// 일정 전체 조회
export const getSchedulesByUser = (userId) => api.get(`/api/schedules/user/${userId}`);
// 일정 추가
export const createSchedule = (schedule) => api.post(`/api/schedules`, schedule);
// 일정 수정
export const updateSchedule = (id, schedule) => api.put(`/api/schedules/${id}`, schedule);
// 일정 삭제
export const deleteSchedule = (id) => api.delete(`/api/schedules/${id}`);

export async function addTodoToCalendar(todoId, data, token) {
  return (await (api.post(`/api/schedules/todo/${todoId}/calendar`, data))).data 
}

export async function removeTodoFromCalendar(todoId, token) {
  return fetch(`/api/schedules/todo/${todoId}/calendar`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
} 
