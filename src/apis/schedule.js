import api from "./api";

// 특정 날짜의 스케줄 조회
export const getSchedulesByDate = async (userId, date) => {
  const response = await api.get(`/api/schedules/date/${date}`);
  return response.data;
};

// 특정 월의 스케줄 조회
export const getSchedulesByMonth = async (userId, year, month) => {
  const response = await api.get(`/api/schedules/month/${year}/${month}`);
  return response.data;
};

// 스케줄 생성
export const createSchedule = async (scheduleData) => {
  const response = await api.post("/api/schedules", scheduleData);
  return response.data;
};

// 스케줄 수정
export const updateSchedule = async (id, scheduleData) => {
  const response = await api.put(`/api/schedules/${id}`, scheduleData);
  return response.data;
};

// 스케줄 삭제
export const deleteSchedule = async (id) => {
  const response = await api.delete(`/api/schedules/${id}`);
  return response.data;
}; 