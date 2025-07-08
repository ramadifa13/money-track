"use client";

import { Transaction } from "@/types/transaction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  return (
    <Card className="mb-6 shadow-md border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
          5 Transaksi Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4">
        {!transactions.length ? (
          <p className="text-muted-foreground text-sm">Belum ada transaksi.</p>
        ) : (
          transactions.map((tx) => {
            return (
              <div
                key={tx.id}
                className={cn(
                  "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 rounded-md",
                  tx.type === "income"
                    ? "bg-green-50 border-l-4 border-green-500"
                    : "bg-red-50 border-l-4 border-red-500"
                )}
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {tx.category?.name || "Tanpa Kategori"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {tx.note || "-"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.date).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <div className="sm:flex-shrink-0 sm:ml-4 w-full sm:w-auto">
                  <Badge
                    variant="outline"
                    className={cn(
                      "w-full sm:w-auto flex items-center justify-center sm:justify-start text-xs px-3 py-1.5 rounded-md",
                      tx.type === "income"
                        ? "border-green-600 text-green-600"
                        : "border-red-600 text-red-600"
                    )}
                  >
                    {tx.type === "income" ? (
                      <ArrowDown className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowUp className="w-3 h-3 mr-1" />
                    )}
                    Rp{tx.amount.toLocaleString("id-ID")}
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
