import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, RefreshCw } from "lucide-react"

export default function MagicLinkSent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <Mail className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We've sent you a secure magic link. Click the link in your email to sign in to SecureVault.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-2">What to do next:</h4>
            <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
              <li>Check your email inbox</li>
              <li>Look for an email from SecureVault</li>
              <li>Click the "Sign In" button in the email</li>
              <li>You'll be automatically signed in</li>
            </ol>
          </div>

          <div className="text-center space-y-3">
            <p className="text-sm text-slate-600">Didn't receive the email? Check your spam folder or try again.</p>
            <div className="flex space-x-2">
              <Link href="/auth" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Button>
              </Link>
              <Link href="/auth" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend Link
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
