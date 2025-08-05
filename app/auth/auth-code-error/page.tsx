import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>
            Sorry, we couldn't sign you in. This could be due to an expired or invalid link.
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
