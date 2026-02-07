import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

export const quizService = {
  getQuizzes: () => api.get('/quizzes'),
  getQuiz: (id: string) => api.get(`/quizzes/${id}`),
  createQuiz: (data: any) => api.post('/quizzes', data),
  deleteQuiz: (id: string) => api.delete(`/quizzes/${id}`),
};

export default api;
