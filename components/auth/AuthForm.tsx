/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { useLoading } from "../providers/LoadingProvider";

type AuthFormProps = {
  type: "login" | "register";
  action: (formData: FormData) => void;
};

export function AuthForm({ type, action }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { setLoading } = useLoading();

  const title = type === "login" ? "Masuk ke Akun" : "Buat Akun";
  const buttonLabel = type === "login" ? "Masuk" : "Daftar";
  const switchLabel =
    type === "login" ? "Belum punya akun?" : "Sudah punya akun?";
  const switchLink = type === "login" ? "/register" : "/login";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormErrors({});
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const schema = type === "login" ? loginSchema : registerSchema;
    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        fieldErrors[field] = err.message;
      });
      setFormErrors(fieldErrors);
      toast.error("Data tidak valid");
      setLoading(false);
      return;
    }

    try {
      await action(formData);
      toast.success(
        type === "login" ? "Berhasil masuk" : "Registrasi berhasil"
      );
    } catch (e: any) {
      if (e.message?.includes("NEXT_REDIRECT")) return;
      const message = e.message || "Terjadi kesalahan";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <h2 className="text-xl font-semibold text-center text-gray-700">
        {title}
      </h2>

      {type === "register" && (
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nama Lengkap
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formErrors.name && (
            <p className="text-sm text-red-600">{formErrors.name}</p>
          )}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {formErrors.email && (
          <p className="text-sm text-red-600">{formErrors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {formErrors.password && (
          <p className="text-sm text-red-600">{formErrors.password}</p>
        )}
      </div>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <Button type="submit" className="w-full">
        {buttonLabel}
      </Button>

      <p className="text-sm text-center text-gray-600">
        {switchLabel}{" "}
        <a href={switchLink} className="text-blue-600 hover:underline">
          {type === "login" ? "Daftar di sini" : "Masuk di sini"}
        </a>
      </p>
    </motion.form>
  );
}
