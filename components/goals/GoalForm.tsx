"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Edit3 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createGoal, updateGoal } from "@/app/actions/goals";
import { GoalInput, goalSchema } from "@/lib/validations/goal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Props {
  defaultValues?: GoalInput;
  isEdit?: boolean;
  onSuccess?: () => void;
}

export function GoalForm({ defaultValues, isEdit = false, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [formattedTargetAmount, setFormattedTargetAmount] = useState("");
  const [formattedSavedAmount, setFormattedSavedAmount] = useState("");

  const form = useForm<GoalInput>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      targetAmount: 0,
      savedAmount: 0,
      deadline: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (isEdit && defaultValues) {
      const formatted = {
        ...defaultValues,
        deadline: defaultValues.deadline.split("T")[0],
      };

      reset(formatted);
      setFormattedTargetAmount(
        defaultValues.targetAmount.toLocaleString("id-ID")
      );
      setFormattedSavedAmount(
        defaultValues.savedAmount.toLocaleString("id-ID")
      );
      setValue("targetAmount", defaultValues.targetAmount);
      setValue("savedAmount", defaultValues.savedAmount);
    } else {
      reset({ title: "", targetAmount: 0, savedAmount: 0, deadline: "" });
      setFormattedTargetAmount("");
      setFormattedSavedAmount("");
    }
  }, [isEdit, defaultValues, reset, setValue]);

  const onSubmit = async (data: GoalInput) => {
    const result = isEdit
      ? await updateGoal(defaultValues!.id!, data)
      : await createGoal({ ...data, savedAmount: 0 });

    if (result?.error) {
      const message =
        typeof result.error === "string" ? result.error : result.error.message;
      toast.error(message);
    } else {
      toast.success(`Target berhasil ${isEdit ? "diperbarui" : "ditambahkan"}`);
      setOpen(false);
      reset();
      onSuccess?.();
    }
  };

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "targetAmount" | "savedAmount"
  ) => {
    const raw = e.target.value.replace(/\./g, "");
    const value = parseInt(raw || "0", 10);

    const formatted = isNaN(value) ? "" : value.toLocaleString("id-ID");

    if (field === "targetAmount") {
      setFormattedTargetAmount(formatted);
    } else {
      setFormattedSavedAmount(formatted);
    }

    setValue(field, isNaN(value) ? 0 : value);
  };

  function parseDateLocal(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);

    return new Date(year, month - 1, day);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);

        if (!val) {
          reset({
            title: "",
            targetAmount: 0,
            savedAmount: 0,
            deadline: "",
          });
          setFormattedTargetAmount("");
          setFormattedSavedAmount("");
        }

        if (val && !isEdit) {
          reset({
            title: "",
            targetAmount: 0,
            savedAmount: 0,
            deadline: "",
          });
          setFormattedTargetAmount("");
          setFormattedSavedAmount("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={isEdit ? "outline" : "default"}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          {isEdit ? (
            <Edit3 className="w-4 h-4" />
          ) : (
            <CalendarIcon className="w-4 h-4" />
          )}
          {isEdit ? "Edit Target" : "Tambah Target"}
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[90%] max-w-lg rounded-2xl p-6 sm:p-8 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "Edit Target" : "Tambah Target Baru"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Isi detail target finansial kamu
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Judul Target</Label>
            <Input
              id="title"
              placeholder="Contoh: Liburan Bali"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="targetAmount">Jumlah Target</Label>
            <Input
              id="targetAmount"
              inputMode="numeric"
              placeholder="0"
              value={formattedTargetAmount}
              onChange={(e) => handleAmountChange(e, "targetAmount")}
            />
            {errors.targetAmount && (
              <p className="text-xs text-red-500">
                {errors.targetAmount.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="deadline">Batas Waktu</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watch("deadline") && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch("deadline")
                    ? format(parseDateLocal(watch("deadline")), "PPP", {
                        locale: id,
                      })
                    : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    watch("deadline") ? new Date(watch("deadline")) : undefined
                  }
                  onSelect={(date) => {
                    if (date) {
                      const localDate = format(date, "yyyy-MM-dd");
                      form.setValue("deadline", localDate);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {errors.deadline && (
              <p className="text-xs text-red-500">{errors.deadline.message}</p>
            )}
          </div>

          {isEdit && (
            <div className="grid gap-2">
              <Label htmlFor="savedAmount">Sudah Terkumpul</Label>
              <Input
                id="savedAmount"
                inputMode="numeric"
                placeholder="0"
                value={formattedSavedAmount}
                onChange={(e) => handleAmountChange(e, "savedAmount")}
              />
              {errors.savedAmount && (
                <p className="text-xs text-red-500">
                  {errors.savedAmount.message}
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 transition-colors"
          >
            {isEdit ? "Simpan Perubahan" : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
