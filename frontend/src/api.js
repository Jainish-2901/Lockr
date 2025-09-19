import axios from "axios";

const API = axios.create({ baseURL: process.env.VITE_API_URL });

// Add JWT token to requests if logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const signup = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);
export const resetPassword = (data) => API.post("/auth/reset-password", data);

// Vault
export const addVaultItem = (data) => API.post("/vault", data);
export const getVaultItems = () => API.get("/vault");
export const deleteVaultItem = (id) => API.delete(`/vault/${id}`);
export const updateVaultItem = (id, data) => API.put(`/vault/${id}`, data);