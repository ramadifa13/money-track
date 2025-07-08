"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function getSummary() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null;

  const userId = session.user.id;

  const { data: incomeData } = await supabase
    .from("Transaction")
    .select("amount", { count: "exact", head: false })
    .eq("userId", userId)
    .eq("type", "income");

  const totalIncome = incomeData?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

  const { data: expenseData } = await supabase
    .from("Transaction")
    .select("amount", { count: "exact", head: false })
    .eq("userId", userId)
    .eq("type", "expense");

  const totalExpense =
    expenseData?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

  const balance = totalIncome - totalExpense;

  return {
    income: totalIncome,
    expense: totalExpense,
    balance,
  };
}

export async function getRecentTransactions() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return [];

  const { data } = await supabase
    .from("Transaction")
    .select("id, amount, type, date, note, Category(id, name)")
    .eq("userId", session.user.id)
    .order("date", { ascending: false })
    .limit(5);

  const transactions =
    data?.map((tx) => ({
      id: tx.id,
      amount: tx.amount,
      type: tx.type,
      date: tx.date,
      note: tx.note,
      category: Array.isArray(tx.Category) ? tx.Category[0] : tx.Category,
    })) || [];

  return transactions;
}

export async function getGoals() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return []

  const { data } = await supabase
    .from("Goal")
    .select("id, title, targetAmount, savedAmount, deadline")
    .eq("userId", session.user.id)
    .order("deadline", { ascending: true })

  return data || []
}

export async function getAvailableMonths() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return [];

  const { data } = await supabase
    .from("Transaction")
    .select("date")
    .eq("userId", session.user.id);

  const uniqueMonths = new Set<string>();

  data?.forEach((tx) => {
    const date = new Date(tx.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    uniqueMonths.add(key);
  });

  return Array.from(uniqueMonths).sort((a, b) => (a > b ? -1 : 1)); 
}

export async function getMonthlySummary(month: string) {
  const [year, mon] = month.split("-").map(Number);
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) return { income: 0, expense: 0 };

  const startDate = new Date(year, mon - 1, 1).toISOString();
  const endDate = new Date(year, mon, 0, 23, 59, 59).toISOString();

  const { data: transactions } = await supabase
    .from("Transaction")
    .select("amount, type")
    .eq("userId", session.user.id)
    .gte("date", startDate)
    .lte("date", endDate);

  const income = transactions?.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0) || 0;
  const expense = transactions?.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0) || 0;

  return { income, expense };
}
