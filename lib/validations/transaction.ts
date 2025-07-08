import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string().optional(),
  amount: z.number().min(1, "Nominal harus lebih dari 0"),
  type: z.enum(["income", "expense"]),
  date: z.string().nonempty("Tanggal wajib diisi"),
  note: z.string().optional(),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
