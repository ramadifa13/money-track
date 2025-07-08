
import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">MoneyTrack</h1>
        {children}
      </div>
    </div>
  )
}
