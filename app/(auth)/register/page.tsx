import { register } from "@/app/actions/auth"
import { AuthForm } from "@/components/auth/AuthForm"

export default function RegisterPage() {
  return <AuthForm type="register" action={register} />
}
