import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";

const baseApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});


// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


// API 응답 데이터 변환 함수
const transformResponse = (response) => {
  // 응답 데이터가 있는 경우에만 변환
  if (response?.data) {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
    };
  }
  return response;
};

// API 에러 처리 함수
const handleApiError = (error) => {
  if (error.response) {
    // 서버에서 응답이 온 경우
    const { status, data } = error.response;
    switch (status) {
      case 400:
        throw new Error(data.message || "잘못된 요청입니다.");
      case 401:
        throw new Error("인증이 필요합니다.");
      case 403:
        throw new Error("접근이 거부되었습니다.");
      case 404:
        throw new Error("요청한 리소스를 찾을 수 없습니다.");
      case 500:
        throw new Error("서버 오류가 발생했습니다.");
      default:
        throw new Error(data.message || "알 수 없는 오류가 발생했습니다.");
    }
  } else if (error.request) {
    // 요청은 보냈지만 응답이 없는 경우
    throw new Error("서버에 연결할 수 없습니다.");
  } else {
    // 요청 설정 중 오류가 발생한 경우
    throw new Error("요청을 처리할 수 없습니다.");
  }
};

// API 요청 래퍼 함수
const apiRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return transformResponse(response);
  } catch (error) {
    handleApiError(error);
  }
};

// API 인스턴스에 유틸리티 메서드 추가
const api = {
  // GET 요청
  get: async (url, config) => {
    return apiRequest(() => baseApi.get(url, config));
  },

  // POST 요청
  post: async (url, data, config) => {
    return apiRequest(() => baseApi.post(url, data, config));
  },

  // PUT 요청
  put: async (url, data, config) => {
    return apiRequest(() => baseApi.put(url, data, config));
  },

  // DELETE 요청
  delete: async (url, config) => {
    return apiRequest(() => baseApi.delete(url, config));
  },

  // PATCH 요청
  patch: async (url, data, config) => {
    return apiRequest(() => baseApi.patch(url, data, config));
  },

  // 파일 업로드
  upload: async (url, formData, config) => {
    return apiRequest(() => baseApi.post(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    }));
  },

  // 파일 다운로드
  download: async (url, config) => {
    const response = await baseApi.get(url, {
      ...config,
      responseType: "blob",
    });
    return response;
  },
};

export default api; 

