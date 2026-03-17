import api from "./api.js";

export const loginLocal = (payload) => api.post("/auth/login", payload);
export const loginSso = (payload) => api.post("/auth/sso-login", payload);
export const registerUser = (payload) => api.post("/auth/register", payload);
export const forgotPassword = (payload) => api.post("/auth/forgot-password", payload);
export const resetPassword = (payload) => api.post("/auth/reset-password", payload);
export const getMe = () => api.get("/auth/me");

