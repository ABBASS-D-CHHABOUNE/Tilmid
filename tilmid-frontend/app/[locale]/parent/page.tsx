'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Grade {
  subject: string
  score: number
  coefficient: number
  status: 'ADMIS' | 'REFUSE'
}

interface Alert {
  id: string
  type: 'warning' | 'info' | 'success'
  message: string
  date: string
}

interface Report {
  id: string
  month: string
  status: 'APPROVED' | 'PENDING' | 'REJECTED'
  notes: string
}

export default function ParentDashboard() {
  const router = useRouter()

  // Mock Data
  const profile = {
    firstName: 'Fatima',
    lastName: 'Ahmed',
    email: 'parent1@tilmid.com',
  }

  const child = {
    firstName: 'Omar',
    lastName: 'Benali',
    studentCode: 'STU001',
    class: 'Class 1A',
    mentor: 'Ahmed Hassan',
  }

  const grades: Grade[] = [
    { subject: 'Mathematics', score: 14.5, coefficient: 3, status: 'ADMIS' },
    { subject: 'French', score: 12.0, coefficient: 2, status: 'ADMIS' },
    { subject: 'English', score: 13.5, coefficient: 2, status: 'ADMIS' },
    { subject: 'Science', score: 11.0, coefficient: 3, status: 'ADMIS' },
    { subject: 'History', score: 9.5, coefficient: 1, status: 'REFUSE' },
  ]

  const alerts: Alert[] = [
    { id: '1', type: 'warning', message: 'History score below 10/20 - needs attention', date: '2026-06-10' },
    { id: '2', type: 'info', message: 'Monthly report available for review', date: '2026-06-09' },
    { id: '3', type: 'success', message: 'Mathematics improvement noticed', date: '2026-06-08' },
  ]

  const reports: Report[] = [
    { id: '1', month: 'May 2026', status: 'APPROVED', notes: 'Good progress overall' },
    { id: '2', month: 'April 2026', status: 'APPROVED', notes: 'Consistent performance' },
    { id: '3', month: 'March 2026', status: 'PENDING', notes: 'Under review' },
  ]

  const attendance = {
    present: 48,
    absent: 2,
    late: 5,
    totalDays: 55,
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  const moyenne = (
    grades.reduce((sum, g) => sum + g.score * g.coefficient, 0) /
    grades.reduce((sum, g) => sum + g.coefficient, 0)
  ).toFixed(2)

  const passingGrades = grades.filter(g => g.status === 'ADMIS').length
  const failingGrades = grades.filter(g => g.status === 'REFUSE').length
  const attendancePercentage = ((attendance.present / attendance.totalDays) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome, {profile.firstName}! 👋</h2>
        <p className="text-orange-100">Monitoring: <span className="font-semibold">{child.firstName} {child.lastName}</span></p>
      </div>

      {/* Child Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Student Name</p>
            <p className="text-lg font-semibold text-gray-800">{child.firstName} {child.lastName}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Student Code</p>
            <p className="text-lg font-semibold text-gray-800">{child.studentCode}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Class</p>
            <p className="text-lg font-semibold text-gray-800">{child.class}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Mentor</p>
            <p className="text-lg font-semibold text-gray-800">{child.mentor}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Average */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
          <p className="text-gray-600 font-semibold mb-2">Current Average</p>
          <p className="text-5xl font-bold text-green-600">{moyenne}</p>
          <p className="text-gray-500 text-sm mt-2">/20</p>
        </div>

        {/* Passing Grades */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-emerald-500">
          <p className="text-gray-600 font-semibold mb-2">Passing Grades</p>
          <p className="text-5xl font-bold text-emerald-600">{passingGrades}/{grades.length}</p>
          <p className="text-gray-500 text-sm mt-2">ADMIS subjects</p>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
          <p className="text-gray-600 font-semibold mb-2">Attendance</p>
          <p className="text-5xl font-bold text-blue-600">{attendancePercentage}%</p>
          <p className="text-gray-500 text-sm mt-2">{attendance.present}/{attendance.totalDays} days</p>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500">
          <p className="text-gray-600 font-semibold mb-2">Alerts</p>
          <p className="text-5xl font-bold text-red-600">{failingGrades}</p>
          <p className="text-gray-500 text-sm mt-2">Subjects below 10/20</p>
        </div>
      </div>

      {/* Overall Status */}
      <div className={`rounded-lg p-6 ${parseFloat(moyenne) >= 10 ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
        <p className="text-gray-600 font-semibold mb-2">Academic Status</p>
        <p className={`text-3xl font-bold ${parseFloat(moyenne) >= 10 ? 'text-green-600' : 'text-red-600'}`}>
          {parseFloat(moyenne) >= 10 ? '✅ ADMIS (PASSING)' : '❌ REFUSÉ (FAILING)'}
        </p>
        <p className="text-gray-700 mt-2">
          {parseFloat(moyenne) >= 10 
            ? 'Your child is performing well. Continue to encourage them!'
            : 'Your child needs support in some subjects. Consider arranging additional tutoring.'}
        </p>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-2xl font-bold text-gray-800">📊 Child&apos;s Grades</h3>
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
              {grades.map((grade, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{grade.subject}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            grade.score >= 14 ? 'bg-green-600' :
                            grade.score >= 10 ? 'bg-blue-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${(grade.score / 20) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{grade.score}/20</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{grade.coefficient}x</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full font-semibold text-sm ${grade.status === 'ADMIS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {grade.status === 'ADMIS' ? '✅ ADMIS' : '❌ REFUSÉ'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">📅 Attendance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-600">
            <p className="text-green-800 font-semibold">Present</p>
            <p className="text-3xl font-bold text-green-600">{attendance.present}</p>
            <p className="text-sm text-green-700 mt-2">days</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border-l-4 border-red-600">
            <p className="text-red-800 font-semibold">Absent</p>
            <p className="text-3xl font-bold text-red-600">{attendance.absent}</p>
            <p className="text-sm text-red-700 mt-2">days</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border-l-4 border-yellow-600">
            <p className="text-yellow-800 font-semibold">Late</p>
            <p className="text-3xl font-bold text-yellow-600">{attendance.late}</p>
            <p className="text-sm text-yellow-700 mt-2">days</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-600">
            <p className="text-blue-800 font-semibold">Attendance Rate</p>
            <p className="text-3xl font-bold text-blue-600">{attendancePercentage}%</p>
            <p className="text-sm text-blue-700 mt-2">on time</p>
          </div>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-2xl font-bold text-gray-800">🔔 Alerts & Notifications</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div key={alert.id} className={`p-6 flex gap-4 ${alert.type === 'warning' ? 'bg-red-50' : alert.type === 'info' ? 'bg-blue-50' : 'bg-green-50'}`}>
                <div className={`text-3xl ${alert.type === 'warning' ? 'text-red-600' : alert.type === 'info' ? 'text-blue-600' : 'text-green-600'}`}>
                  {alert.type === 'warning' ? '⚠️' : alert.type === 'info' ? 'ℹ️' : '✅'}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${alert.type === 'warning' ? 'text-red-800' : alert.type === 'info' ? 'text-blue-800' : 'text-green-800'}`}>
                    {alert.message}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{new Date(alert.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-600">
              No alerts at this time
            </div>
          )}
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
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{report.month}</p>
                  <p className="text-sm text-gray-600">{report.notes}</p>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-t-4 border-orange-600">
          <p className="text-2xl mb-2">📧</p>
          <p className="font-semibold text-gray-800">Contact Mentor</p>
          <p className="text-sm text-gray-600 mt-2">Reach out to {child.mentor}</p>
        </button>
        <button className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-t-4 border-orange-600">
          <p className="text-2xl mb-2">📞</p>
          <p className="font-semibold text-gray-800">Schedule Meeting</p>
          <p className="text-sm text-gray-600 mt-2">Book a parent-teacher conference</p>
        </button>
        <button className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-t-4 border-orange-600">
          <p className="text-2xl mb-2">📊</p>
          <p className="font-semibold text-gray-800">View Analytics</p>
          <p className="text-sm text-gray-600 mt-2">Detailed performance insights</p>
        </button>
      </div>
    </div>
  )
}