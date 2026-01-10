import axios from 'axios';

// Configure base URL - change this when connecting to your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8081";


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials) => {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Terms endpoints
export const termsApi = {
  getAll: async (category) => {
    const params = category ? { category } : {};
    const response = await api.get('/terms', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/terms/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/terms/categories');
    return response.data;
  },

  search: async (query) => {
    const response = await api.get('/terms/search', { params: { q: query } });
    return response.data;
  },
};

// Game endpoints
export const gameApi = {
  startSession: async (category, difficulty) => {
    const response = await api.post('/game/start', { category, difficulty });
    return response.data;
  },

  getQuestion: async (sessionId) => {
    const response = await api.get(`/game/${sessionId}/question`);
    return response.data;
  },

  submitAnswer: async (sessionId, questionId, answer) => {
    const response = await api.post(`/game/${sessionId}/answer`, { 
      question_id: questionId, 
      answer 
    });
    return response.data;
  },

  endSession: async (sessionId) => {
    const response = await api.post(`/game/${sessionId}/end`);
    return response.data;
  },

  getSessionHistory: async () => {
    const response = await api.get('/game/history');
    return response.data;
  },
};

// Progress endpoints
export const progressApi = {
  getUserProgress: async () => {
    const response = await api.get('/progress');
    return response.data;
  },

  getLeaderboard: async (limit) => {
    const params = limit ? { limit } : {};
    const response = await api.get('/progress/leaderboard', { params });
    return response.data;
  },
};

export default api;
