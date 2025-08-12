"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface MagicLinkFormProps {
  onSuccess?: () => void
  className?: string
}

export function MagicLinkForm({ onSuccess, className }: MagicLinkFormProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setSuccess(true)
      onSuccess?.()
    } catch (error: any) {
      console.error("Magic link error:", error)
      setError(error.message || "Failed to send magic link")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Alert className="border-emerald-200 bg-emerald-50">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-700">
            Magic link sent! Check your email and click the link to sign in.
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={() => {
            setSuccess(false)
            setEmail("")
          }}
          className="w-full bg-transparent"
        >
          Send Another Link
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="magic-email">Email Address</Label>
        <Input
          id="magic-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <Button type="submit" disabled={isLoading || !email} className="w-full bg-emerald-600 hover:bg-emerald-700">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <Mail className="mr-2 h-4 w-4" />
        {isLoading ? "Sending..." : "Send Magic Link"}
      </Button>

      <p className="text-xs text-slate-500 text-center">
        We'll send you a secure login link via email. No password required!
      </p>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}
    </form>
  )
}
