"use server";

import { createServerActionClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Goal } from "@/types/goal";

export type GoalInput = Omit<Goal, "id"> & { id?: string };

export async function getGoals(): Promise<Goal[]> {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return [];

  const { data, error } = await supabase
    .from("Goal")
    .select("*")
    .eq("userId", session.user.id)
    .order("deadline", { ascending: true });

  if (error) {
    console.error("Failed to fetch goals:", error.message);
    return [];
  }

  return data || [];
}

export async function createGoal(data: GoalInput) {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return { error: "Unauthorized" };

  const result = await supabase.from("Goal").insert({
    ...data,
    userId: session.user.id,
  });

  return result;
}

export async function updateGoal(id: string, data: GoalInput) {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return { error: "Unauthorized" };

  const result = await supabase
    .from("Goal")
    .update(data)
    .eq("id", id)
    .eq("userId", session.user.id);

  return result;
}

export async function deleteGoal(id: string) {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return { error: "Unauthorized" };

  const result = await supabase
    .from("Goal")
    .delete()
    .eq("id", id)
    .eq("userId", session.user.id);

  return result;
}
