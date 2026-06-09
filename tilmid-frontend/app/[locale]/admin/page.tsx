'use client'

import { useEffect, useState } from 'react'
import { adminAPI } from '@/lib/api'

interface KPIs {
  totalStudents: number
  totalTeachers: number
  totalMentors: number
  pendingReports: number
  actionRequiredReports: number
  totalAlerts: number
  totalGrades: number
}

interface Student {
  _id: string
  userId: {
    firstName: string
    lastName: string
    email: string
  }
  studentCode: string
}

interface MentorWorkload {
  mentorId: string
  mentorName: string
  email: string
  currentCaseload: number
  maxCaseload: number
  loadPercentage: number
  status: string
  availableSlots: number
}

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [unassignedStudents, setUnassignedStudents] = useState<Student[]>([])
  const [mentorWorkload, setMentorWorkload] = useState<MentorWorkload[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpisRes, unassignedRes, workloadRes] = await Promise.all([
          adminAPI.getKPIs(),
          adminAPI.getStudents().then(res => {
            // For now, show all students as placeholder
            return { data: { students: res.data.students || [] } }
          }),
          adminAPI.getMentorWorkload(),
        ])

        setKpis(kpisRes.data)
        setUnassignedStudents(unassignedRes.data.students)
        setMentorWorkload(workloadRes.data)
      } catch (error) {
        console.error('Failed to fetch admin data', error)
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
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Students */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <p className="text-gray-600 font-semibold mb-2">Total Students</p>
          <p className="text-4xl font-bold text-blue-600 mb-2">{kpis?.totalStudents}</p>
          <p className="text-sm text-gray-500">Active students</p>
        </div>

        {/* Total Teachers */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <p className="text-gray-600 font-semibold mb-2">Total Teachers</p>
          <p className="text-4xl font-bold text-green-600 mb-2">{kpis?.totalTeachers}</p>
          <p className="text-sm text-gray-500">Faculty members</p>
        </div>

        {/* Total Mentors */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <p className="text-gray-600 font-semibold mb-2">Total Mentors</p>
          <p className="text-4xl font-bold text-purple-600 mb-2">{kpis?.totalMentors}</p>
          <p className="text-sm text-gray-500">Mentorship team</p>
        </div>

        {/* Pending Reports */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
          <p className="text-gray-600 font-semibold mb-2">Pending Reports</p>
          <p className="text-4xl font-bold text-orange-600 mb-2">{kpis?.pendingReports}</p>
          <p className="text-sm text-gray-500">Awaiting moderation</p>
        </div>
      </div>

      {/* Mentor Workload */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-2xl font-bold text-gray-800">👥 Mentor Workload</h3>
          <p className="text-gray-600 text-sm mt-1">Monitor mentor caseload and capacity</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Mentor Name</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Caseload</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Capacity</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {mentorWorkload.map((mentor) => (
                <tr key={mentor.mentorId} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{mentor.mentorName}</td>
                  <td className="px-6 py-4 text-gray-600">{mentor.email}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">{mentor.currentCaseload}/{mentor.maxCaseload}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          mentor.loadPercentage >= 80
                            ? 'bg-red-500'
                            : mentor.loadPercentage >= 60
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${mentor.loadPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{mentor.loadPercentage}%</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                      mentor.status === 'FULL'
                        ? 'bg-red-100 text-red-800'
                        : mentor.status === 'NEAR_CAPACITY'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {mentor.status === 'FULL' ? '🔴 Full' : 
                       mentor.status === 'NEAR_CAPACITY' ? '🟡 Near Full' : 
                       '🟢 Available'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unassigned Students */}
      {unassignedStudents.length > 0 && (
        <div className="bg-blue-50 rounded-lg border-l-4 border-blue-500 p-6">
          <h3 className="text-2xl font-bold text-blue-900 mb-2">⚠️ Unassigned Students</h3>
          <p className="text-blue-700 mb-4">
            {unassignedStudents.length} student(s) need mentor assignment
          </p>
          <div className="space-y-2">
            {unassignedStudents.slice(0, 5).map((student) => (
              <div key={student._id} className="bg-white p-4 rounded flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">
                    {student.userId.firstName} {student.userId.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{student.studentCode}</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  Assign Mentor
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 font-semibold mb-2">Total Grades</p>
          <p className="text-4xl font-bold text-indigo-600">{kpis?.totalGrades}</p>
          <p className="text-sm text-gray-500 mt-2">Records in system</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 font-semibold mb-2">Action Required</p>
          <p className="text-4xl font-bold text-red-600">{kpis?.actionRequiredReports}</p>
          <p className="text-sm text-gray-500 mt-2">Reports flagged</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 font-semibold mb-2">Unread Alerts</p>
          <p className="text-4xl font-bold text-orange-600">{kpis?.totalAlerts}</p>
          <p className="text-sm text-gray-500 mt-2">System notifications</p>
        </div>
      </div>
    </div>
  )
}