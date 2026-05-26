import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">

        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="mb-4 text-3xl font-bold">
          Account Created Successfully
        </h1>

        <p className="mb-6 text-gray-600">
          Please check your email inbox to verify your account.
        </p>

        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700 transition"
        >
          Go to Login
        </Link>

      </div>
    </div>
  )
}