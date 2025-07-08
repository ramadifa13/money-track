import { z } from "zod";

export const goalSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Judul wajib diisi"),
  targetAmount: z.number().min(1, "Jumlah target harus lebih dari 0"),
  savedAmount: z.number().min(0, "Jumlah yang disimpan tidak boleh negatif"),
  deadline: z.string().nonempty("Tanggal target wajib diisi"),
});

export type GoalInput = z.infer<typeof goalSchema>;
