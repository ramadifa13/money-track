"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  transactionSchema,
  TransactionInput,
} from "@/lib/validations/transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  createTransaction,
  updateTransaction,
} from "@/app/actions/transactions";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Plus, Pencil, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format, parseISO } from "date-fns";
import { Calendar } from "../ui/calendar";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
}

interface Props {
  categories: Category[];
  defaultValues?: TransactionInput;
  isEdit?: boolean;
  triggerText?: string;
  onSuccess?: () => void;
}

export function TransactionForm({
  categories,
  defaultValues,
  isEdit = false,
  triggerText = "Tambah Transaksi",
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false);

  const [formattedAmount, setFormattedAmount] = useState("");

  const form = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues || {
      amount: 0,
      type: "income",
      date: new Date().toISOString().split("T")[0],
      note: "",
      categoryId: "",
    },
  });

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const type = watch("type");

  const filteredCategories = categories.filter((cat) => cat.type === type);

  useEffect(() => {
    if (!isEdit) {
      form.setValue("categoryId", "");
    }
  }, [type, isEdit]);

  const onSubmit = async (data: TransactionInput) => {
    const cleanData = { ...data };
    if (!isEdit) {
      delete cleanData.id;
    }

    const result =
      isEdit && data.id
        ? await updateTransaction(data.id, cleanData)
        : await createTransaction(cleanData);

    if (result?.error) {
      toast.error("Gagal menyimpan transaksi");
    } else {
      toast.success(
        `Transaksi berhasil ${isEdit ? "diperbarui" : "ditambahkan"}`
      );
      reset();
      setFormattedAmount("");
      setOpen(false);
      if (onSuccess) await onSuccess();
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, ""); // hapus titik
    const numericValue = parseInt(rawValue || "0", 10);

    if (!isNaN(numericValue)) {
      setFormattedAmount(numericValue.toLocaleString("id-ID")); // format ke ribuan
      form.setValue("amount", numericValue); // update react-hook-form
    } else {
      setFormattedAmount("");
      form.setValue("amount", 0);
    }
  };

  useEffect(() => {
    if (defaultValues?.amount) {
      setFormattedAmount(defaultValues.amount.toLocaleString("id-ID"));
    }
  }, [defaultValues?.amount]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          reset(
            defaultValues || {
              amount: 0,
              type: "income",
              date: new Date(Date.now() + 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
              note: "",
              categoryId: "",
            }
          );
          setFormattedAmount("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="bg-green-500 hover:bg-green-700 flex items-center gap-2 w-full sm:w-auto"
          variant={isEdit ? "destructive" : "default"}
          size="sm"
        >
          {isEdit ? (
            <Pencil className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-lg rounded-2xl p-6 sm:p-8 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "Edit Transaksi" : "Tambah Transaksi"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Isi formulir berikut untuk {isEdit ? "memperbarui" : "menambahkan"}{" "}
            transaksi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Nominal</Label>
            <Input
              inputMode="numeric"
              value={formattedAmount}
              onChange={handleAmountChange}
              placeholder="0"
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Tipe</Label>
            <Select
              value={type}
              onValueChange={(value) =>
                form.setValue("type", value as "income" | "expense")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Pemasukan</SelectItem>
                <SelectItem value="expense">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-xs text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Tanggal</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !watch("date") && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch("date")
                    ? format(parseISO(watch("date")), "dd MMMM yyyy")
                    : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={parseISO(watch("date"))}
                  onSelect={(date) => {
                    if (date) {
                      form.setValue("date", date.toISOString().split("T")[0]);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-xs text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Kategori</Label>
            <Select
              value={watch("categoryId")}
              onValueChange={(value) => form.setValue("categoryId", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note">Catatan (opsional)</Label>
            <Textarea
              id="note"
              rows={3}
              placeholder="Contoh: bayar tagihan, bonus proyek, dll"
              {...register("note")}
            />
          </div>

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
