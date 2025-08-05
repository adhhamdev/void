"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Mail, Shield, Key, Globe } from "lucide-react"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleMagicLink = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-emerald-100 p-3 rounded-full">
              <Shield className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">SecureVault</h1>
            <p className="text-slate-600 mt-2">Developer-friendly secret management</p>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">Choose your preferred authentication method</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="magic-link" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
                <TabsTrigger value="oauth">OAuth</TabsTrigger>
              </TabsList>

              <TabsContent value="magic-link" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleMagicLink}
                  disabled={isLoading}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {isLoading ? "Sending..." : "Send Magic Link"}
                </Button>
                <p className="text-xs text-slate-500 text-center">We'll send you a secure login link via email</p>
              </TabsContent>

              <TabsContent value="oauth" className="space-y-4">
                <Button variant="outline" className="w-full bg-transparent">
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Globe className="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Key className="mr-2 h-4 w-4" />
                  Continue with SSO
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-sm text-slate-500">Secured with AES-256 encryption</p>
          <div className="flex justify-center space-x-4 text-xs text-slate-400">
            <span>SOC 2 Compliant</span>
            <span>•</span>
            <span>Zero Trust</span>
            <span>•</span>
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  )
}
