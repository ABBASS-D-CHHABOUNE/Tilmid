'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

interface NavItem {
  label: string
  href: string
  icon: string
}

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, clearAuth } = useAuthStore()
  const [isOpen, setIsOpen] = useState(true)

  // Determine nav items based on user role
  const getNavItems = (): NavItem[] => {
    const role = user?.role?.toLowerCase() || 'student'
    
    const navMap: { [key: string]: NavItem[] } = {
      student: [
        { label: 'Dashboard', href: '/en/student', icon: '📊' },
        { label: 'My Grades', href: '/en/student#grades', icon: '📈' },
        { label: 'Alerts', href: '/en/student#alerts', icon: '🔔' },
        { label: 'Profile', href: '/en/student#profile', icon: '👤' },
      ],
      admin: [
        { label: 'Dashboard', href: '/en/admin', icon: '📊' },
        { label: 'Students', href: '/en/admin#students', icon: '👥' },
        { label: 'Mentors', href: '/en/admin#mentors', icon: '👨‍🏫' },
        { label: 'Reports', href: '/en/admin#reports', icon: '📋' },
        { label: 'Settings', href: '/en/admin#settings', icon: '⚙️' },
      ],
      teacher: [
        { label: 'Dashboard', href: '/en/teacher', icon: '📊' },
        { label: 'Add Grades', href: '/en/teacher#grades', icon: '✏️' },
        { label: 'Attendance', href: '/en/teacher#attendance', icon: '✅' },
        { label: 'Reports', href: '/en/teacher#reports', icon: '📋' },
        { label: 'Profile', href: '/en/teacher#profile', icon: '👤' },
      ],
      mentor: [
        { label: 'Dashboard', href: '/en/mentor', icon: '📊' },
        { label: 'My Students', href: '/en/mentor#students', icon: '👥' },
        { label: 'Sessions', href: '/en/mentor#sessions', icon: '📅' },
        { label: 'Ratings', href: '/en/mentor#ratings', icon: '⭐' },
        { label: 'Profile', href: '/en/mentor#profile', icon: '👤' },
      ],
      parent: [
        { label: 'Dashboard', href: '/en/parent', icon: '📊' },
        { label: 'Child Progress', href: '/en/parent#progress', icon: '📈' },
        { label: 'Grades', href: '/en/parent#grades', icon: '📚' },
        { label: 'Alerts', href: '/en/parent#alerts', icon: '🔔' },
        { label: 'Profile', href: '/en/parent#profile', icon: '👤' },
      ],
    }

    return navMap[role] || navMap.student
  }

  const navItems = getNavItems()

  const handleLogout = () => {
    clearAuth()
    localStorage.removeItem('token')
    router.push('/login')
  }

  const isActive = (href: string) => pathname === href

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-900 to-blue-700 text-white transition-all duration-300 fixed h-screen overflow-y-auto`}>
      {/* Header */}
      <div className="p-6 border-b border-blue-600">
        {isOpen ? (
          <div>
            <h1 className="text-2xl font-bold">TILMID</h1>
            <p className="text-blue-200 text-xs mt-1 capitalize">{user?.role || 'User'}</p>
          </div>
        ) : (
          <p className="text-2xl text-center">📱</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item, index) => (
          <button
            key={`${item.label}-${index}`}
            onClick={() => router.push(item.href)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              isActive(item.href)
                ? 'bg-blue-500 text-white'
                : 'text-blue-100 hover:bg-blue-600'
            }`}
            title={item.label}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-600 space-y-2">
        <div className={`${isOpen ? 'block' : 'hidden'} bg-blue-800 p-3 rounded-lg text-sm`}>
          <p className="font-semibold truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-blue-200 text-xs truncate">{user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm font-semibold"
        >
          <span>🚪</span>
          {isOpen && <span>Logout</span>}
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition"
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>
    </div>
  )
}