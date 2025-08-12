import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, ArrowLeft, Mail } from "lucide-react"
import { Suspense } from "react"

function ErrorContent() {
  if (typeof window === "undefined") {
    return null
  }

  const searchParams = new URLSearchParams(window.location.search)
  const error = searchParams.get("error")

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>We encountered an issue while trying to sign you in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-2">Common solutions:</h4>
            <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
              <li>The magic link may have expired (links expire after 1 hour)</li>
              <li>The link may have already been used</li>
              <li>Try requesting a new magic link</li>
              <li>Check that you're using the same browser and device</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Link href="/auth">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Mail className="mr-2 h-4 w-4" />
                Request New Magic Link
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="outline" className="w-full bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthCodeError() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  )
}
