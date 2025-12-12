import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("API request with token:", config.url);
  } else {
    console.warn("API request without token:", config.url);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth API
const authApi = {
  registerUser: (data: any) => api.post("/auth/register", data),
  loginUser: (data: any) => api.post("/auth/login", data),
  registerProvider: (data: any) => api.post("/auth/provider-register", data),
  loginProvider: (data: any) => api.post("/auth/provider-login", data),
  loginAdmin: (data: any) => api.post("/auth/admin-login", data),
};

// Provider API
const providerApi = {
  getProviders: (params?: any) => api.get("/providers", { params }),
  getFeaturedProviders: () => api.get("/providers/featured"),
  getProviderById: (id: string) => api.get(`/providers/${id}`),
  updateProvider: (id: string, data: any) => api.put(`/providers/${id}`, data),
};

// User API
const userApi = {
  getUserProfile: (id: string) => api.get(`/users/${id}`),
  updateUserProfile: (id: string, data: any) => api.put(`/users/${id}`, data),
  addToFavorites: (data: any) => api.post("/users/favorites", data),
  removeFromFavorites: (data: any) => api.delete("/users/favorites", { data }),
};

// Admin API
const adminApi = {
  getPendingProviders: () => api.get("/providers/pending"),
  verifyProvider: (id: string) => api.put(`/providers/${id}/verify`),
  rejectProvider: (id: string) => api.put(`/providers/${id}/reject`),
};

export { api, authApi, providerApi, userApi, adminApi };