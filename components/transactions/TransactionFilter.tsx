"use client";

import { useEffect, useRef, useState } from "react";
import { addDays, format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TransactionFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const didMount = useRef(false);

  const [date, setDate] = useState<DateRange | undefined>({
    from: searchParams.get("from")
      ? new Date(searchParams.get("from")!)
      : addDays(new Date(), -30),
    to: searchParams.get("to") ? new Date(searchParams.get("to")!) : new Date(),
  });

  const [type, setType] = useState(searchParams.get("type") || "all");

useEffect(() => {
    if (!didMount.current) {
    didMount.current = true;
    return;
  }
  const params = new URLSearchParams(searchParams);
  const newParams = new URLSearchParams();

  if (date?.from && date?.to) {
    const formatDate = (d: Date) =>
      [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");

    const fromStr = formatDate(date.from);
    const toStr = formatDate(date.to);

    newParams.set("from", fromStr);
    newParams.set("to", toStr);
  }

  if (type && type !== "all") {
    newParams.set("type", type);
  }

  if (newParams.toString() !== params.toString()) {
    router.push(`?${newParams.toString()}`);
  }
}, [date, type]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className="w-full justify-start text-left font-medium rounded-xl border border-gray-300 shadow-sm"
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd MMM yyyy")} -{" "}
                  {format(date.to, "dd MMM yyyy")}
                </>
              ) : (
                format(date.from, "dd MMM yyyy")
              )
            ) : (
              <span className="text-muted-foreground">
                Pilih rentang tanggal
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-full font-medium rounded-xl border border-gray-300 shadow-sm bg-white">
          <SelectValue placeholder="Tipe Transaksi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua</SelectItem>
          <SelectItem value="income">Pemasukan</SelectItem>
          <SelectItem value="expense">Pengeluaran</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
