import axios from 'axios';

// Environment variable for API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

// Request Interceptor to add Bearer token
api.interceptors.request.use(
    (config) => {
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor to handle 401s (optional clean up)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token on 401? Or leave it to the UI/AuthContext to handle?
            // Usually we might want to redirect here, but we'll let the AuthContext/Page handle the error state first
            // or we can dispatch a custom event.
            // For now, simpler is better: let the caller handle it.
        }
        return Promise.reject(error);
    }
);
