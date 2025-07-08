"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const COLORS = ["#4ade80", "#f87171"];

interface IncomeExpenseChartProps {
  availableMonths: string[];
  fetchChartData: (
    month: string
  ) => Promise<{ income: number; expense: number }>;
}

export default function IncomeExpenseChart({
  availableMonths,
  fetchChartData,
}: IncomeExpenseChartProps) {
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0] || "");
  const [chartData, setChartData] = useState<{
    income: number;
    expense: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMonth) {
      setLoading(true);
      fetchChartData(selectedMonth)
        .then((data) => {
          setChartData(data);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedMonth]);

  const data = [
    { name: "Pemasukan", value: chartData?.income || 0 },
    { name: "Pengeluaran", value: chartData?.expense || 0 },
  ];

  if (!availableMonths.length) {
    return (
      <Card className="mb-6 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            Grafik Pemasukan vs Pengeluaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Belum ada data transaksi.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 shadow-lg rounded-2xl border border-muted">
      <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <CardTitle className="text-base sm:text-lg font-semibold">
          Pemasukan vs Pengeluaran
        </CardTitle>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-fit text-sm bg-muted/30 border-muted rounded-md hover:bg-muted/50 transition">
            <SelectValue placeholder="Pilih Bulan" />
          </SelectTrigger>
          <SelectContent>
            {availableMonths.map((opt) => {
              const [year, month] = opt.split("-");
              const label = new Date(
                Number(year),
                Number(month) - 1
              ).toLocaleString("id-ID", {
                month: "long",
                year: "numeric",
              });
              return (
                <SelectItem key={opt} value={opt}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="relative h-64">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={65}
                  outerRadius={85}
                  dataKey="value"
                  labelLine={false}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `Rp${value.toLocaleString("id-ID")}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-4 text-xs sm:text-sm">
              {data.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 text-gray-600"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="whitespace-nowrap">{entry.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
