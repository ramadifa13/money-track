import type { ReactNode } from "react";
import Image from "next/image";
import Logo from "../../public/logo.png";

export default function AuthLayout({
  children,
  type,
}: {
  children: ReactNode;
  type: "login" | "register";
}) {
  const isLogin = type === "login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl relative">
        <div className="flex justify-center mb-6">
          <Image
            src={Logo}
            alt="MoneyTrack Logo"
            width={80}
            height={80}
            className="rounded-full border border-gray-300 shadow-sm"
          />
        </div>

        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center gap-2 text-xl font-semibold ${
              isLogin ? "text-indigo-600" : "text-emerald-600"
            }`}
          >
            {isLogin ? "🔐 Masuk ke Akun" : "✍️ Daftar Baru"}
          </div>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin
              ? "Selamat datang kembali di MoneyTrack"
              : "Kelola keuanganmu dengan lebih baik"}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
