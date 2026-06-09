import type { Metadata } from "next"
import { Cairo } from 'next/font/google'
import "./globals.css"

const cairo = Cairo({ 
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo'
})

export const metadata: Metadata = {
  title: "TILMID - School Management System",
  description: "Moroccan Educational Platform for seamless school management",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cairo.className}>
      <body className="bg-gray-50 font-cairo antialiased">
        {children}
      </body>
    </html>
  )
}