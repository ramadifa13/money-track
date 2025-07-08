import { LayoutDashboard, List, Target } from "lucide-react";

export const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    href: "/transactions",
    label: "Transaksi",
    icon: <List size={18} />,
  },
  {
    href: "/goals",
    label: "Target",
    icon: <Target size={18} />,
  }
];
