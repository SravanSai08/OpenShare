import axios from "axios";

const API = axios.create({
  baseURL: "https://openshare-2.onrender.com/api", // 👈 your Render backend URL
});

// Add token to request if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
