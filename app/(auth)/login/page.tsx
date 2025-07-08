import { login } from "@/app/actions/auth"
import { AuthForm } from "@/components/auth/AuthForm"

export default function LoginPage() {
  return <AuthForm type="login" action={login} />
}
