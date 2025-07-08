import { handleLogout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { navItems } from "./navItems";
import { LogOut } from "lucide-react";
import SidebarLink from "./SidebarLink";

export default function MobileSidebar() {
  return (
    <div className="flex flex-col justify-between h-full">
      <nav className="mt-6 px-4 flex flex-col gap-1">
        {navItems.map(({ href, label, icon }) => (
          <SidebarLink key={href} href={href} icon={icon}>
            {label}
          </SidebarLink>
        ))}
      </nav>
      <form action={handleLogout} className="px-4 py-4 border-t border-white/10">
        <Button
          type="submit"
          variant="ghost"
          className="w-full justify-start text-red-500"
        >
          <LogOut size={18} className="mr-2" />
          Keluar
        </Button>
      </form>
    </div>
  );
}
