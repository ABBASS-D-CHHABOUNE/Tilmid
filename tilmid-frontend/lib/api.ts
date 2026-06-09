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
  register: (data: unknown) => api.post('/auth/register', data),
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

export const teacherAPI = {
  getProfile: () => api.get('/teachers/profile'),
  getClasses: () => api.get('/teachers/classes'),
  getClassStudents: (classId: string) => api.get(`/teachers/classes/${classId}/students`),
  markAttendance: (data: unknown) => api.post('/teachers/attendance', data),
  getStudentAttendance: (studentId: string) => api.get(`/teachers/attendance/student/${studentId}`),
  submitMonthlyReport: (data: unknown) => api.post('/teachers/reports', data),
  getMyReports: () => api.get('/teachers/reports'),
  getMyGrades: () => api.get('/teachers/grades'),
  createGrade: (data: unknown) => api.post('/grades', data),
}

export default api