
"use client"

import { useState } from "react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

interface ChartFilterProps {
  options: string[] 
  onChange: (val: string) => void
}

export default function ChartFilter({ options, onChange }: ChartFilterProps) {
  const [value, setValue] = useState(options[0] || "");

  function handleChange(val: string) {
    setValue(val);
    onChange(val);
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="Pilih Bulan & Tahun" />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => {
          const [year, month] = opt.split("-");
          const label = new Date(Number(year), Number(month) - 1).toLocaleString("id-ID", {
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
  );
}
