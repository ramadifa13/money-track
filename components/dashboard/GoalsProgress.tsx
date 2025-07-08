"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Goal } from "@/types/goal"

interface GoalsProgressProps {
  goals: Goal[]
}

export default function GoalsProgress({ goals }: GoalsProgressProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">Progress Target Keuangan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!goals.length ? (
          <p className="text-muted-foreground text-sm">Belum ada target keuangan.</p>
        ) : (
          goals.map((goal) => {
            const percent = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100)
            return (
              <div
                key={goal.id}
                className="p-4 rounded-md border bg-white shadow-sm"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium text-sm">{goal.title}</p>
                  <p className="text-xs text-gray-500">
                    {percent.toFixed(0)}%
                  </p>
                </div>
                <Progress value={percent} className="h-2 mb-2" />
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Terkumpul: Rp{goal.savedAmount.toLocaleString("id-ID")}</span>
                  <span>Target: Rp{goal.targetAmount.toLocaleString("id-ID")}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Deadline: {new Date(goal.deadline).toLocaleDateString("id-ID")}
                </p>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
