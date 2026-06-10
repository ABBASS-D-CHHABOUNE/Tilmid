'use client'

import { useEffect, useState } from 'react'
import { teacherAPI } from '@/lib/api'

interface Teacher {
  _id: string
  userId: {
    firstName: string
    lastName: string
    email: string
  }
  specialization: string
}

interface Grade {
  _id: string
  subject: string
  score: number
  coefficient: number
  status: string
  studentId: {
    userId: {
      firstName: string
      lastName: string
    }
  }
}

interface Report {
  _id: string
  studentId?: {
    userId?: {
      firstName: string
      lastName: string
    }
  }
  month: number
  year: number
  status: string
  createdAt: string
}

export default function TeacherDashboard() {
  const [profile, setProfile] = useState<Teacher | null>(null)
  const [grades, setGrades] = useState<Grade[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [newGrade, setNewGrade] = useState({
    studentId: '',
    subject: '',
    score: '',
    coefficient: '1',
    trimester: '1',
    academicYear: '2024-2025',
  })
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, gradesRes, reportsRes] = await Promise.all([
          teacherAPI.getProfile(),
          teacherAPI.getMyGrades(),
          teacherAPI.getMyReports(),
        ])

        setProfile(profileRes.data)
        setGrades(gradesRes.data.grades || [])
        setReports(reportsRes.data.reports || [])
      } catch (error) {
        console.error('Failed to fetch teacher data', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await teacherAPI.createGrade({
        studentId: newGrade.studentId,
        subject: newGrade.subject,
        score: parseFloat(newGrade.score),
        coefficient: parseInt(newGrade.coefficient),
        trimester: parseInt(newGrade.trimester),
        academicYear: newGrade.academicYear,
      })
      setSubmitMessage('✅ Grade added successfully!')
      setNewGrade({
        studentId: '',
        subject: '',
        score: '',
        coefficient: '1',
        trimester: '1',
        academicYear: '2024-2025',
      })
      setTimeout(() => setSubmitMessage(''), 3000)
    } catch (error) {
      setSubmitMessage('❌ Failed to add grade')
    }
  }

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
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {profile?.userId?.firstName} {profile?.userId?.lastName}!
        </h2>
        <p className="text-gray-600">
          Specialization: <span className="font-semibold">{profile?.specialization || 'N/A'}</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Grades Entered */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
          <p className="text-blue-100 font-semibold mb-2">Grades Entered</p>
          <p className="text-5xl font-bold mb-2">{grades.length}</p>
          <p className="text-blue-100">Total records</p>
        </div>

        {/* ADMIS Count */}
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-lg p-6 text-white">
          <p className="text-green-100 font-semibold mb-2">Passing Grades</p>
          <p className="text-5xl font-bold mb-2">
            {grades.filter(g => g.status === 'ADMIS').length}
          </p>
          <p className="text-green-100">Students passing</p>
        </div>

        {/* REFUSE Count */}
        <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg p-6 text-white">
          <p className="text-red-100 font-semibold mb-2">Failing Grades</p>
          <p className="text-5xl font-bold mb-2">
            {grades.filter(g => g.status === 'REFUSE').length}
          </p>
          <p className="text-red-100">Need attention</p>
        </div>
      </div>

      {/* Add Grade Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">📝 Add New Grade</h3>
        
        {submitMessage && (
          <div className={`p-4 rounded mb-4 ${
            submitMessage.includes('✅') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {submitMessage}
          </div>
        )}

        <form onSubmit={handleGradeSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Student ID</label>
            <input
              type="text"
              value={newGrade.studentId}
              onChange={(e) => setNewGrade({...newGrade, studentId: e.target.value})}
              placeholder="Paste student ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Subject</label>
            <input
              type="text"
              value={newGrade.subject}
              onChange={(e) => setNewGrade({...newGrade, subject: e.target.value})}
              placeholder="e.g., Mathématiques"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Score (0-20)</label>
            <input
              type="number"
              min="0"
              max="20"
              step="0.5"
              value={newGrade.score}
              onChange={(e) => setNewGrade({...newGrade, score: e.target.value})}
              placeholder="e.g., 15.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Coefficient</label>
            <input
              type="number"
              min="1"
              value={newGrade.coefficient}
              onChange={(e) => setNewGrade({...newGrade, coefficient: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Trimester</label>
            <select
              value={newGrade.trimester}
              onChange={(e) => setNewGrade({...newGrade, trimester: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="1">Trimester 1</option>
              <option value="2">Trimester 2</option>
              <option value="3">Trimester 3</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Academic Year</label>
            <input
              type="text"
              value={newGrade.academicYear}
              onChange={(e) => setNewGrade({...newGrade, academicYear: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <button
            type="submit"
            className="col-span-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition"
          >
            Add Grade
          </button>
        </form>
      </div>

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
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Student</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Subject</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Score</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Coefficient</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => (
                  <tr key={grade._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {grade.studentId?.userId?.firstName || 'Unknown'} {grade.studentId?.userId?.lastName || 'Student'}
                    </td>
                    <td className="px-6 py-4 text-gray-800">{grade.subject}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{grade.score}/20</td>
                    <td className="px-6 py-4 text-gray-600">{grade.coefficient}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                        grade.status === 'ADMIS'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {grade.status === 'ADMIS' ? '✓ ADMIS' : '✗ REFUSE'}
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
          <p className="text-gray-600 text-lg">No grades entered yet. Start by adding grades above!</p>
        </div>
      )}

      {/* Reports Section */}
      {reports.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-2xl font-bold text-gray-800">📋 Submitted Reports</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div key={report._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {report.studentId?.userId?.firstName || 'Unknown'} {report.studentId?.userId?.lastName || 'Student'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                    report.status === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : report.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}