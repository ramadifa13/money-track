import type { ReactNode } from "react";
import Image from "next/image";
import Logo from "../../../public/logo.png";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0eafc] to-[#cfdef3] px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="flex justify-center mb-6">
          <Image
            src={Logo}
            alt="MoneyTrack Logo"
            className="rounded-4xl ring-2 ring-white/20 shadow-lg shadow-white/10 p-1 bg-gray-800 object-contain"
            width={100}
            height={100}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
