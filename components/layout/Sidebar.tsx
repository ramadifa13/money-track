"use client";

import { handleLogout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { navItems } from "./navItems";
import { LogOut } from "lucide-react";
import SidebarLink from "./SidebarLink";
import Image from "next/image";
import Logo from "@/public/logo.png";

export default function Sidebar() {
  return (
    <>
      <div>
        <div className="flex items-center justify-center p-6 border-b border-white/10">
        <Image
          src={Logo}
          alt="MoneyTrack Logo"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>
        <nav className="mt-4 flex flex-col gap-1 px-4">
          {navItems.map(({ href, label, icon }) => (
            <SidebarLink key={href} href={href} icon={icon}>
              {label}
            </SidebarLink>
          ))}
        </nav>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start px-6 text-red-500 mb-4"
          >
            <LogOut size={18} className="mr-2" />
            Keluar
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin ingin keluar?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan mengakhiri sesi Anda saat ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <form action={handleLogout}>
              <AlertDialogAction type="submit" className="bg-red-500 hover:bg-red-600">
                Keluar
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
