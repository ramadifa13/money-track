import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import MobileSidebar from "@/components/layout/MobileSidebar";
import Sidebar from "@/components/layout/Sidebar";


export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
    
      <header className="md:hidden flex items-center justify-between p-4 bg-gray-900 text-white">
        <div className="text-lg font-bold">MoneyTrack</div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-gray-900 text-white">
            <SheetHeader>
              <SheetTitle>
                <VisuallyHidden>Menu Navigasi</VisuallyHidden>
              </SheetTitle>
            </SheetHeader>
            <MobileSidebar />
          </SheetContent>
        </Sheet>
      </header>

      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col justify-between bg-gray-900 text-white h-full">
        <Sidebar />
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}

