const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
export const API_URL = rawApiUrl.replace(/\/+$/, '');
