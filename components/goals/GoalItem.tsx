"use client";

import { Goal } from "@/types/goal";
import { Button } from "@/components/ui/button";
import { GoalForm } from "./GoalForm";
import { Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { deleteGoal } from "@/app/actions/goals";
import { toast } from "sonner";
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

interface Props {
  goal: Goal;
  onChange: () => void;
}

export function GoalItem({ goal, onChange }: Props) {
  const onDelete = async () => {
    toast.promise(deleteGoal(goal.id), {
      loading: "Menghapus target...",
      success: () => {
        onChange();
        return "Target berhasil dihapus";
      },
      error: (err) => {
        const message =
          typeof err === "string" ? err : err?.message || "Terjadi kesalahan";
        return `Gagal menghapus target: ${message}`;
      },
    });
  };

  const progress = Math.min(
    100,
    Math.floor((goal.savedAmount / goal.targetAmount) * 100)
  );

  const sisa = goal.targetAmount - goal.savedAmount;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col justify-between h-full border border-gray-100">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-800">{goal.title}</h3>
        <p className="text-sm text-gray-600">
          Tersimpan:{" "}
          <span className="font-medium text-green-600">
            Rp {goal.savedAmount.toLocaleString()}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          Sisa:{" "}
          <span className="font-medium text-red-500">
            Rp {sisa.toLocaleString()}
          </span>
        </p>

        <div className="mt-2">
          <Progress value={progress} className="h-2 rounded-full" />
          <p className="text-xs text-gray-500 mt-1">{progress}% dari target</p>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Deadline:{" "}
          <span className="text-gray-600">
            {new Date(goal.deadline).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4 w-full">
        <div className="w-full sm:w-auto">
          <GoalForm defaultValues={goal} isEdit onSuccess={onChange} />
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-1 w-full sm:w-auto justify-center transition-all duration-200 bg-red-600 hover:bg-red-700"
            >
              <Trash2 size={16} /> Hapus
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Target?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Target ini akan dihapus
                secara permanen dari daftar kamu.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Ya, Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
