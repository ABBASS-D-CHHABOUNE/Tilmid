'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Grade {
  studentName: string
  subject: string
  score: number
  coefficient: number
  trimester: number
}

interface Report {
  id: string
  month: string
  status: 'APPROVED' | 'PENDING' | 'REJECTED'
  studentCount: number
}

export default function TeacherDashboard() {
  const router = useRouter()

  // Mock Data
  const profile = {
    firstName: 'Fatima',
    lastName: 'Teacher',
    email: 'teacher@tilmid.com',
    specialization: 'Mathematics & Science',
  }

  const grades: Grade[] = [
    { studentName: 'Omar Benali', subject: 'Mathematics', score: 14.5, coefficient: 3, trimester: 1 },
    { studentName: 'Fatima Zahra', subject: 'Mathematics', score: 12.0, coefficient: 3, trimester: 1 },
    { studentName: 'Mohammed Ali', subject: 'Science', score: 13.5, coefficient: 2, trimester: 1 },
    { studentName: 'Aisha Khan', subject: 'Mathematics', score: 11.0, coefficient: 3, trimester: 1 },
    { studentName: 'Hassan Ibrahim', subject: 'Science', score: 15.5, coefficient: 2, trimester: 1 },
  ]

  const reports: Report[] = [
    { id: '1', month: 'May 2026', status: 'APPROVED', studentCount: 25 },
    { id: '2', month: 'April 2026', status: 'APPROVED', studentCount: 25 },
    { id: '3', month: 'March 2026', status: 'PENDING', studentCount: 25 },
  ]

  const classes = [
    { name: 'Class 1A', students: 30 },
    { name: 'Class 1B', students: 28 },
    { name: 'Class 2A', students: 32 },
  ]

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  const gradesEntered = grades.length
  const passingGrades = grades.filter(g => g.score >= 10).length
  const failingGrades = grades.filter(g => g.score < 10).length
  const totalStudents = classes.reduce((sum, c) => sum + c.students, 0)

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome, {profile.firstName} {profile.lastName}! 👋</h2>
        <p className="text-indigo-100">Specialization: <span className="font-semibold">{profile.specialization}</span></p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Grades Entered */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
          <p className="text-gray-600 font-semibold mb-2">Grades Entered</p>
          <p className="text-5xl font-bold text-blue-600">{gradesEntered}</p>
          <p className="text-gray-500 text-sm mt-2">Total grades submitted</p>
        </div>

        {/* Passing Grades */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
          <p className="text-gray-600 font-semibold mb-2">Passing Grades</p>
          <p className="text-5xl font-bold text-green-600">{passingGrades}</p>
          <p className="text-gray-500 text-sm mt-2">Score ≥ 10/20</p>
        </div>

        {/* Failing Grades */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500">
          <p className="text-gray-600 font-semibold mb-2">Failing Grades</p>
          <p className="text-5xl font-bold text-red-600">{failingGrades}</p>
          <p className="text-gray-500 text-sm mt-2">Score 10/20</p>
        </div>

        {/* Total Students */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
          <p className="text-gray-600 font-semibold mb-2">Total Students</p>
          <p className="text-5xl font-bold text-purple-600">{totalStudents}</p>
          <p className="text-gray-500 text-sm mt-2">Across all classes</p>
        </div>
      </div>

      {/* Add New Grade Form */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">➕ Add New Grade</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Student ID</label>
            <input type="text" placeholder="Student ID" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Subject</label>
            <input type="text" placeholder="Subject" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Score (0-20)</label>
            <input type="number" min="0" max="20" placeholder="Score" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Coefficient</label>
            <input type="number" min="1" placeholder="Coefficient" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Trimester</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600">
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Academic Year</label>
            <input type="text" placeholder="2024-2025" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600" />
          </div>
          <button type="button" className="col-span-1 md:col-span-3 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold">
            ✅ Submit Grade
          </button>
        </form>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-2xl font-bold text-gray-800">📊 Recent Grades</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Student</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Subject</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Score</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Coefficient</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Trimester</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{grade.studentName}</td>
                  <td className="px-6 py-4 text-gray-600">{grade.subject}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">{grade.score}</span>/20
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {grade.coefficient}x
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">Trimester {grade.trimester}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                      grade.score >= 10
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {grade.score >= 10 ? '✅ ADMIS' : '❌ REFUSÉ'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* My Classes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">🏫 My Classes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classes.map((cls, idx) => (
            <div key={idx} className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border-l-4 border-indigo-600 hover:shadow-lg transition cursor-pointer">
              <p className="font-semibold text-indigo-800 mb-2">{cls.name}</p>
              <p className="text-4xl font-bold text-indigo-600 mb-2">{cls.students}</p>
              <p className="text-sm text-indigo-700">Students enrolled</p>
              <button className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-semibold">
                View Class
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Reports */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-2xl font-bold text-gray-800">📋 Monthly Reports</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">{report.month}</p>
                  <p className="text-sm text-gray-600">{report.studentCount} students</p>
                </div>
                <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                  report.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {report.status === 'APPROVED' ? '✅ APPROVED' : report.status === 'PENDING' ? '⏳ PENDING' : '❌ REJECTED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">📊 Quick Stats</h4>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span className="text-gray-600">Grades Entered:</span>
              <span className="font-bold text-indigo-600">{gradesEntered}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Passing Rate:</span>
              <span className="font-bold text-green-600">{((passingGrades/gradesEntered)*100).toFixed(0)}%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Reports Submitted:</span>
              <span className="font-bold text-purple-600">{reports.length}</span>
            </li>
          </ul>
        </div>

        <button className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-t-4 border-indigo-600">
          <p className="text-2xl mb-2">📝</p>
          <p className="font-semibold text-gray-800">Submit Report</p>
          <p className="text-sm text-gray-600 mt-2">Create monthly report</p>
        </button>

        <button className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-t-4 border-indigo-600">
          <p className="text-2xl mb-2">📊</p>
          <p className="font-semibold text-gray-800">View Analytics</p>
          <p className="text-sm text-gray-600 mt-2">Class performance data</p>
        </button>
      </div>
    </div>
  )
}