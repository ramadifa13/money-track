
"use client";

import { Transaction } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteTransaction } from "@/app/actions/transactions";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Category } from "@/types/category";
import { TransactionItem } from "./TransactionItem";

interface Props {
  transactions: Transaction[];
  categories: Category[];
  onTransactionChange: () => void;
}

export function TransactionList({
  transactions,
  categories,
  onTransactionChange,
}: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);


  const onDelete = async () => {
    if (!deletingId) return;
    const result = await deleteTransaction(deletingId);
    if (result.error) {
      toast.error("Gagal menghapus transaksi");
    } else {
      toast.success("Transaksi berhasil dihapus");
      await onTransactionChange();
    }
    setDeletingId(null);
  };


  return (
    <div className="space-y-4">
         {transactions.map((tx) => (
      <TransactionItem
        key={tx.id}
        tx={tx}
        categories={categories}
        onDelete={(id) => setDeletingId(id)}
        onTransactionChange={onTransactionChange}
      />
    ))}

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Yakin ingin menghapus transaksi?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="ghost" onClick={() => setDeletingId(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Hapus
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
