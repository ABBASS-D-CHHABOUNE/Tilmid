'use client'

import { useEffect, useState } from 'react'
import { studentAPI } from '@/lib/api'

interface StudentData {
  _id: string
  userId: {
    firstName: string
    lastName: string
    email: string
  }
  studentCode: string
}

interface Grade {
  _id: string
  subject: string
  score: number
  coefficient: number
  status: string
}

interface Moyenne {
  moyenne: number
  status: string
  failingSubjects: string[]
}

interface Alert {
  _id: string
  message: string
  type: string
  createdAt: string
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<StudentData | null>(null)
  const [moyenne, setMoyenne] = useState<Moyenne | null>(null)
  const [grades, setGrades] = useState<Grade[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, moyenneRes, gradesRes, alertsRes] = await Promise.all([
          studentAPI.getProfile(),
          studentAPI.getMoyenne(),
          studentAPI.getGrades(),
          studentAPI.getAlerts(),
        ])

        setProfile(profileRes.data)
        setMoyenne(moyenneRes.data)
        setGrades(gradesRes.data || [])
        setAlerts(alertsRes.data || [])
      } catch (error) {
        console.error('Failed to fetch dashboard data', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl text-gray-600">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {profile?.userId?.firstName} {profile?.userId?.lastName}!
        </h2>
        <p className="text-gray-600">
          Student Code: <span className="font-semibold">{profile?.studentCode}</span>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Moyenne Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
          <p className="text-blue-100 font-semibold mb-2">Your Average</p>
          <p className="text-5xl font-bold mb-2">
            {moyenne?.moyenne ? moyenne.moyenne.toFixed(2) : 'N/A'}
          </p>
          <p className={`text-lg font-bold ${
            moyenne?.status === 'ADMIS' ? 'text-green-300' : 'text-red-300'
          }`}>
            {moyenne?.status === 'ADMIS' ? '✓ ADMIS (Pass)' : '✗ REFUSÉ (Fail)'}
          </p>
        </div>

        {/* Total Grades */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow-lg p-6 text-white">
          <p className="text-purple-100 font-semibold mb-2">Total Grades</p>
          <p className="text-5xl font-bold mb-2">{grades.length}</p>
          <p className="text-purple-100">Subjects evaluated</p>
        </div>

        {/* Alerts */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg shadow-lg p-6 text-white">
          <p className="text-orange-100 font-semibold mb-2">Alerts</p>
          <p className="text-5xl font-bold mb-2">{alerts.length}</p>
          <p className="text-orange-100">Notifications</p>
        </div>
      </div>

      {/* Failing Subjects (if any) */}
      {moyenne?.failingSubjects && moyenne.failingSubjects.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <h3 className="text-lg font-bold text-red-800 mb-2">⚠️ Attention Needed</h3>
          <p className="text-red-700">
            You need to improve in: <span className="font-semibold">{moyenne.failingSubjects.join(', ')}</span>
          </p>
        </div>
      )}

      {/* Grades Table */}
      {grades.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-2xl font-bold text-gray-800">📊 My Grades</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Subject</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Score</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Coefficient</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => (
                  <tr key={grade._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-800 font-medium">{grade.subject}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-lg text-gray-800">{grade.score}</span>
                      <span className="text-gray-600">/20</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{grade.coefficient}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                        grade.status === 'ADMIS' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {grade.status === 'ADMIS' ? '✓ ADMIS' : '✗ REFUSÉ'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <p className="text-gray-600 text-lg">No grades yet. Check back soon!</p>
        </div>
      )}

      {/* Alerts Section */}
      {alerts.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-2xl font-bold text-gray-800">🔔 Alerts & Notifications</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.map((alert) => (
              <div key={alert._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{alert.message}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(alert.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-green-50 rounded-lg p-6 text-center border-l-4 border-green-500">
          <p className="text-green-800 text-lg font-semibold">✓ No alerts! Keep up the good work!</p>
        </div>
      )}
    </div>
  )
}