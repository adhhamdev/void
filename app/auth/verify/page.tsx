"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token_hash = searchParams.get("token_hash")
        const type = searchParams.get("type")

        if (!token_hash || !type) {
          throw new Error("Missing verification parameters")
        }

        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        })

        if (error) throw error

        if (data.user) {
          setStatus("success")
          setMessage("Email verified successfully! Redirecting to dashboard...")

          // Redirect after a short delay
          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
        }
      } catch (error: any) {
        setStatus("error")
        setMessage(error.message || "Verification failed")
      }
    }

    verifyUser()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />}
            {status === "success" && (
              <div className="bg-emerald-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
            )}
            {status === "error" && <AlertTriangle className="h-8 w-8 text-red-500" />}
          </div>
          <CardTitle>
            {status === "loading" && "Verifying..."}
            {status === "success" && "Verification Successful"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we verify your email address."}
            {status === "success" && "Your email has been verified successfully."}
            {status === "error" && "We encountered an issue verifying your email."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert
              className={`mb-4 ${
                status === "success"
                  ? "border-emerald-200 bg-emerald-50"
                  : status === "error"
                    ? "border-red-200 bg-red-50"
                    : "border-blue-200 bg-blue-50"
              }`}
            >
              <AlertDescription
                className={
                  status === "success" ? "text-emerald-700" : status === "error" ? "text-red-700" : "text-blue-700"
                }
              >
                {message}
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <div className="space-y-2">
              <Link href="/auth">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Back to Sign In</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
