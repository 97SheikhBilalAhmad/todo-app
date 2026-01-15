import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5300",
  withCredentials: true,
});

// 🔐 REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
         config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
