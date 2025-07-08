"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function getCategories() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return [];

  const { data, error } = await supabase
    .from("Category")
    .select("id, name, type")

  if (error) {
    console.error("Failed to fetch categories", error);
    return [];
  }

  return data;
}
