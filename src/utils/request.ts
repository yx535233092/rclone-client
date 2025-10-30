import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  timeout: 5000
});

request.interceptors.request.use((config) => {
  return config;
});

request.interceptors.response.use(
  (response) => {
    const { code } = response.data;
    if (code !== 200) {
      message.error(response.data.message);
    }
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
