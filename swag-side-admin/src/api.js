import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3333',
});

export function getApiError(error) {
  return (
    error.response?.data?.details ||
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    'Erro desconhecido'
  );
}
