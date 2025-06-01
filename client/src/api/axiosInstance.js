import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", 
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const token = JSON.parse(userInfo).token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
