'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getTranslations } from '@/lib/translations'

interface Grade {
  subject: string
  score: number
  coefficient: number
  status: 'ADMIS' | 'REFUSE'
}

export default function StudentDashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'
  const t = getTranslations(locale)

  const profile = {
    firstName: 'Omar',
    lastName: 'Benali',
    email: 'student1@tilmid.com',
    studentCode: 'STU001',
  }

  const grades: Grade[] = [
    { subject: 'Mathematics', score: 14.5, coefficient: 3, status: 'ADMIS' },
    { subject: 'French', score: 12.0, coefficient: 2, status: 'ADMIS' },
    { subject: 'English', score: 13.5, coefficient: 2, status: 'ADMIS' },
    { subject: 'Science', score: 11.0, coefficient: 3, status: 'ADMIS' },
    { subject: 'History', score: 9.5, coefficient: 1, status: 'REFUSE' },
  ]

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
  const overallStatus = parseFloat(moyenne) >= 10 ? 'ADMIS' : 'REFUSE'

  const studentT = t.student as Record<string, string>

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">
          {studentT.welcome || 'Welcome'}, {profile.firstName}! 👋
        </h2>
        <p className="text-blue-100">
          {studentT.studentCode || 'Student Code'}: <span className="font-semibold">{profile.studentCode}</span>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
          <p className="text-gray-600 font-semibold mb-2">{studentT.average || 'Average'}</p>
          <p className="text-5xl font-bold text-green-600">{moyenne}</p>
          <p className="text-gray-500 text-sm mt-2">/20</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
          <p className="text-gray-600 font-semibold mb-2">{studentT.totalGrades || 'Total Grades'}</p>
          <p className="text-5xl font-bold text-blue-600">{grades.length}</p>
          <p className="text-gray-500 text-sm mt-2">Subjects</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-emerald-500">
          <p className="text-gray-600 font-semibold mb-2">{studentT.passing || 'Passing'}</p>
          <p className="text-5xl font-bold text-emerald-600">{passingGrades}</p>
          <p className="text-gray-500 text-sm mt-2">{studentT.admis || 'ADMIS'}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500">
          <p className="text-gray-600 font-semibold mb-2">{studentT.alerts || 'Alerts'}</p>
          <p className="text-5xl font-bold text-red-600">{failingGrades}</p>
          <p className="text-gray-500 text-sm mt-2">Needs attention</p>
        </div>
      </div>

      {/* Overall Status */}
      <div className={`rounded-lg p-6 ${overallStatus === 'ADMIS' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
        <p className="text-gray-600 font-semibold mb-2">{studentT.overallStatus || 'Overall Status'}</p>
        <p className={`text-3xl font-bold ${overallStatus === 'ADMIS' ? 'text-green-600' : 'text-red-600'}`}>
          {overallStatus === 'ADMIS' 
            ? `✅ ${studentT.admis || 'ADMIS'} (${studentT.passed || 'PASSED'})` 
            : `❌ ${studentT.refuse || 'REFUSÉ'} (${studentT.failed || 'FAILED'})`}
        </p>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-2xl font-bold text-gray-800">📊 {studentT.yourGrades || 'Your Grades'}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">{studentT.subject || 'Subject'}</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">{studentT.score || 'Score'}</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">{studentT.coefficient || 'Coefficient'}</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">{studentT.status || 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{grade.subject}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="text-lg font-semibold">{grade.score}</span>/20
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {grade.coefficient}x
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                      grade.status === 'ADMIS'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {grade.status === 'ADMIS' ? `✅ ${studentT.admis || 'ADMIS'}` : `❌ ${studentT.refuse || 'REFUSÉ'}`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts Section */}
      {failingGrades > 0 ? (
        <div className="bg-red-50 rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <h3 className="text-xl font-bold text-red-800 mb-4">⚠️ {studentT.attentionRequired || 'Attention Required'}</h3>
          <p className="text-red-700 mb-4">
            You have {failingGrades} subject(s) where you scored below 10/20. These subjects need immediate attention!
          </p>
          <ul className="space-y-2">
            {grades
              .filter(g => g.status === 'REFUSE')
              .map((grade, idx) => (
                <li key={idx} className="text-red-700">
                  • <span className="font-semibold">{grade.subject}</span>: {grade.score}/20
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <div className="bg-green-50 rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-green-800">✅ {studentT.excellent || 'Excellent!'}</h3>
          <p className="text-green-700">
            All your grades are passing! Keep up the good work and maintain this performance.
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">📊 Quick Stats</h4>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span className="text-gray-600">{studentT.average || 'Average'}:</span>
              <span className="font-bold text-blue-600">{moyenne}/20</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">{studentT.passing || 'Passing'}:</span>
              <span className="font-bold text-green-600">{passingGrades}/{grades.length}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">{studentT.alerts || 'Alerts'}:</span>
              <span className="font-bold text-red-600">{failingGrades}</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <h4 className="text-lg font-semibold text-blue-800 mb-4">🎯 Tips</h4>
          <ul className="space-y-2 text-blue-700 text-sm">
            <li>✅ Focus on subjects with low scores</li>
            <li>✅ Ask your teacher for help</li>
            <li>✅ Work with your mentor</li>
            <li>✅ Review regularly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}