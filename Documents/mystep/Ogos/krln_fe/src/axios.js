import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://172.26.14.87:3000/api',
  timeout: 10000, // 10 seconds timeout
  headers: { 'Content-Type': 'application/json' },

  
});

export default instance;
