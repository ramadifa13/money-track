
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-6 text-center">
      <AlertTriangle className="text-red-500 mb-4" size={48} />
      <h1 className="text-3xl font-semibold mb-2">Halaman tidak ditemukan</h1>
      <p className="mb-6 text-gray-600">
        Maaf, halaman yang kamu cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link href="/">
        <Button>← Kembali </Button>
      </Link>
    </div>
  )
}
