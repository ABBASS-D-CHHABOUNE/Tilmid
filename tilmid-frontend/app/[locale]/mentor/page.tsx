'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getTranslations } from '@/lib/translations'

interface Student {
  _id: string
  name: string
  email: string
  assignmentDate: string
  performance: number
}

interface Session {
  _id: string
  studentName: string
  type: string
  duration: number
  date: string
  notes: string
}

interface Rating {
  _id: string
  studentName: string
  rating: number
  feedback: string
  date: string
}

export default function MentorDashboard() {
  const router = useRouter()
  const pathname = usePathname()

  const locale = pathname.split('/')[1] || 'en'
  const t = getTranslations(locale)

  const students: Student[] = [
    {
      _id: '1',
      name: 'Omar Benali',
      email: 'omar@tilmid.com',
      assignmentDate: '2026-06-01',
      performance: 85,
    },
    {
      _id: '2',
      name: 'Fatima Zahra',
      email: 'fatima@tilmid.com',
      assignmentDate: '2026-06-02',
      performance: 78,
    },
    {
      _id: '3',
      name: 'Mohammed Ali',
      email: 'ali@tilmid.com',
      assignmentDate: '2026-06-03',
      performance: 92,
    },
  ]

  const sessions: Session[] = [
    {
      _id: '1',
      studentName: 'Omar Benali',
      type: 'Academic',
      duration: 60,
      date: '2026-06-08',
      notes: 'Discussed Mathematics concepts',
    },
    {
      _id: '2',
      studentName: 'Fatima Zahra',
      type: 'Career',
      duration: 45,
      date: '2026-06-07',
      notes: 'Career path guidance',
    },
    {
      _id: '3',
      studentName: 'Mohammed Ali',
      type: 'Academic',
      duration: 90,
      date: '2026-06-06',
      notes: 'Science project review',
    },
    {
      _id: '4',
      studentName: 'Omar Benali',
      type: 'Personal',
      duration: 30,
      date: '2026-06-05',
      notes: 'General support',
    },
  ]

  const ratings: Rating[] = [
    {
      _id: '1',
      studentName: 'Omar Benali',
      rating: 5,
      feedback: 'Excellent guidance and support!',
      date: '2026-06-08',
    },
    {
      _id: '2',
      studentName: 'Fatima Zahra',
      rating: 4,
      feedback: 'Very helpful mentor, great insights',
      date: '2026-06-07',
    },
    {
      _id: '3',
      studentName: 'Mohammed Ali',
      rating: 5,
      feedback: 'Outstanding support throughout the year',
      date: '2026-06-06',
    },
  ]

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.replace('/login')
    }
  }, [router])

  const mentorT = t.mentor as Record<string, string>
  const commonT = t.common as Record<string, string>

  const averageRating = (
    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
  ).toFixed(1)

  const totalSessionHours = (
    sessions.reduce((sum, s) => sum + s.duration, 0) / 60
  ).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">
          {mentorT.welcome || 'Welcome'}, Ahmed Hassan! 👋
        </h2>

        <p className="text-purple-100">
          Email:{' '}
          <span className="font-semibold">
            mentor@tilmid.com
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
          <p className="text-gray-600 font-semibold mb-2">
            {mentorT.myStudents || 'My Students'}
          </p>
          <p className="text-5xl font-bold text-blue-600">
            {students.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
          <p className="text-gray-600 font-semibold mb-2">
            {mentorT.totalSessions || 'Total Sessions'}
          </p>
          <p className="text-5xl font-bold text-green-600">
            {sessions.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
          <p className="text-gray-600 font-semibold mb-2">
            {mentorT.averageRating || 'Average Rating'}
          </p>
          <p className="text-5xl font-bold text-yellow-600">
            ⭐ {averageRating}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-indigo-500">
          <p className="text-gray-600 font-semibold mb-2">
            {mentorT.totalHours || 'Total Hours'}
          </p>
          <p className="text-5xl font-bold text-indigo-600">
            {totalSessionHours}h
          </p>
        </div>
      </div>

      {/* Your remaining tables stay exactly the same */}
    </div>
  )
}