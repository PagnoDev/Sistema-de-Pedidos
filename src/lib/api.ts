import axios from "axios";
import type { NextApiRequest, NextApiResponse } from 'next';

const api = axios.create({
  baseURL: "http://localhost:8000/api", // ajuste se necessário
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default api;