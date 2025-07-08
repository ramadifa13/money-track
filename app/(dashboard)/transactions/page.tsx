"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getTransactions } from "@/app/actions/transactions";
import { getCategories } from "@/app/actions/categories";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { TransactionFilter } from "@/components/transactions/TransactionFilter";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { ListOrdered } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { Loading } from "@/components/ui/loading";
import { Category } from "@/types/category";

export default function TransactionsPage() {
  const searchParams = useSearchParams();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const type = searchParams.get("type") || undefined;

  const fetchTransactions = useCallback(async () => {
    const data = await getTransactions({ from, to, type });
    setTransactions(data);
    setLoading(false);
  }, [from, to, type]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        icon={<ListOrdered className="w-6 h-6" />}
        title="Transaksi"
        description="Lihat dan kelola riwayat transaksi Anda"
        action={
          <TransactionForm
            categories={categories}
            onSuccess={fetchTransactions}
          />
        }
      />

      <div className="mb-6">
        <TransactionFilter />
      </div>

      {loading ? (
        <Loading text="Memuat transaksi..." />
      ) : (
        <TransactionList
          transactions={transactions}
          categories={categories}
          onTransactionChange={fetchTransactions}
        />
      )}
    </PageContainer>
  );
}
