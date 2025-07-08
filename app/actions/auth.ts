"use server"

import { PrismaClient } from "@prisma/client"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { loginSchema, registerSchema } from "@/lib/validations/auth"

const prisma = new PrismaClient()

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const result = loginSchema.safeParse({ email, password })
  if (!result.success) {
    throw new Error("Email atau password tidak valid")
  }

const supabase = createServerActionClient({ cookies })
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error("Login error:", error.message)
    throw new Error("Email atau password salah")
  }

  redirect("/dashboard")
}

export async function register(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const result = registerSchema.safeParse({ name, email, password })
  if (!result.success) {
    throw new Error("Data registrasi tidak valid")
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new Error("Email sudah terdaftar")
  }

  const supabase = createServerActionClient({ cookies })
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  const userId = data.user?.id
  if (userId) {
    await prisma.user.create({
      data: {
        id: userId,
        email,
        name,
      },
    })
  }

  redirect("/dashboard")
}


export async function handleLogout() {
  const supabase = createServerActionClient({ cookies })
  await supabase.auth.signOut()
  redirect("/login")
}
