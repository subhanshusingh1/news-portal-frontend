import axios from 'axios';
import apiBaseUrls from './apiBaseUrl';

export const authService = axios.create({
  baseURL: apiBaseUrls.auth,
  timeout: 5000,
});

export const contentService = axios.create({
  baseURL: apiBaseUrls.content,
  timeout: 5000,
});

export const regionService = axios.create({
  baseURL: apiBaseUrls.region,
  timeout: 5000,
});
