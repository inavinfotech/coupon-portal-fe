import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5007/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("coupon_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Failed to read auth token", err);
  }
  return config;
});

// Auto-logout on 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("coupon_token");
      localStorage.removeItem("coupon_email");
      if (window.location.pathname !== "/coupon/login") {
        window.location.href = "/coupon/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
