import axios from "axios";
import store from "../redux/store";
import { logout } from "../redux/reducers/AuthSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = "https://interngo.onrender.com"; 
export const axiosInstance = axios.create({
  baseURL: api,
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const token = await AsyncStorage.getItem("fcmToken");
      await AsyncStorage.removeItem("fcmToken");
      const state = store.getState();
      const id = state.auth?.data?.data?.userId;
      store.dispatch(logout());
      await axiosInstance.post(`/api/notifications/deleteFCM`, { 
          userId: id,
          fcmToken: token, 
      });
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.data?.data?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
