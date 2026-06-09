import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
}

export const gradeAPI = {
  getStudentMoyenne: (studentId: string) =>
    api.get(`/grades/moyenne/${studentId}`),
}

export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  getGrades: () => api.get('/students/grades'),
  getMoyenne: () => api.get('/students/moyenne'),
  getAlerts: () => api.get('/students/alerts'),
}

export const adminAPI = {
  getKPIs: () => api.get('/admin/kpis'),
  getStudents: () => api.get('/admin/students'),
  getMentors: () => api.get('/admin/mentors'),
  getMentorWorkload: () => api.get('/admin/mentors/workload'),
}

export default api