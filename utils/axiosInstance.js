import axios from "axios";
import  store  from "../redux/store";
import { logout } from "../redux/reducers/AuthSlice";
const api ="https://interngo.onrender.com"   
export const axiosInstance = axios.create({
    baseURL:api,
    timeout:10000
}) 

axiosInstance.interceptors.response.use(
    response => response,
    error => { 
        
      if (error.response && error.response.status === 401) {  
        
        store.dispatch(logout());
  
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