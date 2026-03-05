import axios from 'axios';

export interface ApiRequestProps {
  httpMethod: 'get' | 'post' | 'patch' | 'delete';
  data?: Record<string, unknown>;
  route: string;
}

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
});

export function apiClient({ httpMethod, data, route }: ApiRequestProps) {
  return httpClient.request({
    method: httpMethod,
    data,
    url: route,
  });
}
