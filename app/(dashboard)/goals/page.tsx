"use client";

import { useEffect, useState } from "react";
import { getGoals } from "@/app/actions/goals";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";

import { Flag } from "lucide-react";
import { Goal } from "@/types/goal";
import { Loading } from "@/components/ui/loading";
import { GoalForm } from "@/components/goals/GoalForm";
import { GoalList } from "@/components/goals/GoalList";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    const data = await getGoals();
    setGoals(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        icon={<Flag className="w-6 h-6" />}
        title="Tujuan Keuangan"
        description="Lacak dan kelola target finansial Anda"
        action={<GoalForm onSuccess={fetchGoals} />}
      />

      {loading ? (
        <Loading text="Memuat Target Kamu..." />
      ) : (
        <GoalList goals={goals} onChange={fetchGoals} />
      )}
    </PageContainer>
  );
}
