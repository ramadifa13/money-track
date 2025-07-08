"use server";

import { TransactionInput } from "@/lib/validations/transaction";
import { createServerActionClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function getTransactions({
  from,
  to,
  type,
}: {
  from?: string;
  to?: string;
  type?: string;
} = {}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return [];

  let query = supabase
    .from("Transaction")
    .select("id, amount, type, date, note, Category(id, name)")
    .eq("userId", session.user.id)
    .order("date", { ascending: false });

  if (from) {
    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);
    query = query.gte("date", fromDate.toISOString());
  }

  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    query = query.lte("date", toDate.toISOString());
  }

  if (type && type !== "all") {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch transactions", error);
    return [];
  }

  return (
    data?.map((tx) => ({
      id: tx.id,
      amount: tx.amount,
      type: tx.type,
      date: tx.date,
      note: tx.note,
      category: Array.isArray(tx.Category) ? tx.Category[0] : tx.Category,
    })) || []
  );
}

export async function createTransaction(data: TransactionInput) {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return { error: "Unauthorized" };

  const result = await supabase.from("Transaction").insert({
    ...data,
    userId: session.user.id,
  });

  return result;
}

export async function updateTransaction(id: string, data: TransactionInput) {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return { error: "Unauthorized" };

  const result = await supabase
    .from("Transaction")
    .update(data)
    .eq("id", id)
    .eq("userId", session.user.id);

  return result;
}

export async function deleteTransaction(id: string) {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return { error: "Unauthorized" };

  const result = await supabase
    .from("Transaction")
    .delete()
    .eq("id", id)
    .eq("userId", session.user.id);

  return result;
}