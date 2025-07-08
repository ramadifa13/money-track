"use client";

import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { Transaction } from "@/types/transaction";
import { Category } from "@/types/category";
import { TransactionForm } from "./TransactionForm";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpCircle,  Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  tx: Transaction;
  categories: Category[];
  onDelete: (id: string) => void;
  onTransactionChange: () => void;
}

export function TransactionItem({
  tx,
  categories,
  onDelete,
  onTransactionChange,
}: Props) {
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    if (showActions) {
      const timeout = setTimeout(() => setShowActions(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [showActions]);

  const handlers = useSwipeable({
    onSwipedLeft: () => setShowActions(true),
    onSwipedRight: () => setShowActions(false),
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));

  return (
    <div className="relative rounded-xl overflow-hidden shadow-sm border bg-gray-100">
      <div className="absolute top-0 right-0 bottom-0 z-0 w-[160px] sm:hidden py-4 px-2 bg-gray-100 flex flex-col justify-center items-stretch gap-2 shadow-md">
        <TransactionForm
          onSuccess={onTransactionChange}
          categories={categories}
          defaultValues={{
            id: tx.id,
            amount: tx.amount,
            categoryId: tx.category?.id ?? "",
            date: tx.date.split("T")[0],
            note: tx.note ?? "",
            type: tx.type,
          }}
          isEdit
          triggerText="Edit"
        />
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={() => onDelete(tx.id)}
        >
            <Trash2 className="w-4 h-4" />
          Hapus
        </Button>
      </div>

      <div
        {...handlers}
        className={cn(
          "relative z-10 bg-white flex px-4 py-3 gap-3 items-start transition-transform duration-300 pr-[180px] sm:pr-4",
          showActions ? "-translate-x-[160px]" : "translate-x-0"
        )}
      >
        {tx.type === "income" ? (
          <ArrowDownCircle className="text-green-500 w-5 h-5 mt-1 flex-shrink-0" />
        ) : (
          <ArrowUpCircle className="text-red-500 w-5 h-5 mt-1 flex-shrink-0" />
        )}

        <div className="flex-1">
          <p className="font-medium text-base text-gray-800">
            Rp{tx.amount.toLocaleString("id-ID")}{" "}
            <span
              className={cn(
                "text-sm font-normal",
                tx.type === "income" ? "text-green-600" : "text-red-600"
              )}
            >
              ({tx.type === "income" ? "Pemasukan" : "Pengeluaran"})
            </span>
          </p>
          <p className="text-sm text-gray-500">
            {formatDate(tx.date)} • {tx.category?.name}
          </p>
          {tx.note && (
            <p className="text-sm text-gray-600 italic mt-1">&quot;{tx.note}&quot;</p>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <TransactionForm
            onSuccess={onTransactionChange}
            categories={categories}
            defaultValues={{
              id: tx.id,
              amount: tx.amount,
              categoryId: tx.category?.id ?? "",
              date: tx.date.split("T")[0],
              note: tx.note ?? "",
              type: tx.type,
            }}
            isEdit
            triggerText="Edit"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(tx.id)}
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
}
