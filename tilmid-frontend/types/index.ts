export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'TEACHER' | 'MENTOR' | 'PARENT' | 'STUDENT'
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Student {
  _id: string
  userId: {
    firstName: string
    lastName: string
    email: string
  }
  studentCode: string
  moyenne?: number
  status?: 'ADMIS' | 'REFUSE'
}

export interface Grade {
  _id: string
  subject: string
  score: number
  coefficient: number
  status: 'ADMIS' | 'REFUSE'
  moyenne?: number
}

export interface Alert {
  _id: string
  type: string
  message: string
  isRead: boolean
  createdAt: string
}