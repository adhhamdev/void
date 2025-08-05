import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>
            Sorry, we couldn't log you in. The authentication link may have expired or been used already.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/auth">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Try Again</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
