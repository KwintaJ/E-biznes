import axios from 'axios';

const api = axios.create({
  baseURL: 'http://bs-local.com:8080/products',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;