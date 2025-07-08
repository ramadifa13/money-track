import {
  getGoals,
  getRecentTransactions,
  getSummary,
  getAvailableMonths,
  getMonthlySummary,
} from "@/app/actions/dashboard";
import GoalsProgress from "@/components/dashboard/GoalsProgress";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import SummaryCards from "@/components/dashboard/SummaryCards";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { LayoutDashboard } from "lucide-react";

export default async function DashboardPage() {
  const [summary, recentTransactions, goals, availableMonths] =
    await Promise.all([
      getSummary(),
      getRecentTransactions(),
      getGoals(),
      getAvailableMonths(),
    ]);

  return (
    <PageContainer>
      <PageHeader
        icon={<LayoutDashboard className="w-6 h-6" />}
        title="Dashboard"
        description="Ringkasan dan aktivitas terbaru Anda"
      />
      <SummaryCards data={summary} />
      <RecentTransactions transactions={recentTransactions} />
      <GoalsProgress goals={goals} />
      <IncomeExpenseChart
        availableMonths={availableMonths}
        fetchChartData={getMonthlySummary}
      />
    </PageContainer>
  );
}
