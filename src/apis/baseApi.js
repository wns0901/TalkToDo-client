import axios from "axios";

// API URL 상수 정의
const API_URL = "http://localhost:8080";

// axios 인스턴스 생성
const baseApi = axios.create({
  // 기본 URL 설정
  baseURL: API_URL,
  
  // 기본 헤더 설정
  headers: {
    "Content-Type": "application/json",
  },
  
  // 타임아웃 설정 (5초)
  timeout: 5000,
});

// 요청 인터셉터
baseApi.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem("accessToken");
    
    // 토큰이 있으면 헤더에 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
baseApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 리프레시 토큰으로 새로운 액세스 토큰 발급
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(
          `${API_URL}/api/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        // 새로운 토큰으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return baseApi(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default baseApi;
