"use client";

import { Goal } from "@/types/goal";
import { GoalItem } from "./GoalItem";

interface Props {
  goals: Goal[];
  onChange: () => void;
}

export function GoalList({ goals, onChange }: Props) {
  if (!goals.length) {
    return (
      <div className="text-center text-gray-500 mt-10 text-sm sm:text-base">
        Belum ada target yang ditambahkan.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
      {goals.map((goal) => (
        <GoalItem key={goal.id} goal={goal} onChange={onChange} />
      ))}
    </div>
  );
}
