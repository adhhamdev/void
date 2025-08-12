"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface QuickMagicLinkProps {
  className?: string
  buttonText?: string
  placeholder?: string
}

export function QuickMagicLink({
  className = "",
  buttonText = "Send Magic Link",
  placeholder = "Enter your email",
}: QuickMagicLinkProps) {
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
    } catch (error: any) {
      setError(error.message || "Failed to send magic link")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Alert className={`border-emerald-200 bg-emerald-50 ${className}`}>
        <CheckCircle className="h-4 w-4 text-emerald-600" />
        <AlertDescription className="text-emerald-700">
          Magic link sent! Check your email and click the link to sign in.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`flex space-x-2 ${className}`}>
      <Input
        type="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        required
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading || !email} className="bg-emerald-600 hover:bg-emerald-700">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            {buttonText}
          </>
        )}
      </Button>
      {error && (
        <Alert className="mt-2 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}
    </form>
  )
}
