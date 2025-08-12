"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"

interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
  optional?: boolean
}

interface OnboardingContextType {
  isFirstTime: boolean
  currentStep: number
  steps: OnboardingStep[]
  showOnboarding: boolean
  setShowOnboarding: (show: boolean) => void
  completeStep: (stepId: string) => void
  skipOnboarding: () => void
  restartOnboarding: () => void
  nextStep: () => void
  previousStep: () => void
  isComplete: boolean
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

const defaultSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to SecureVault",
    description: "Let's get you started with secure secret management",
    completed: false,
  },
  {
    id: "create-project",
    title: "Create Your First Project",
    description: "Projects help organize your secrets by application or team",
    completed: false,
  },
  {
    id: "add-secret",
    title: "Add Your First Secret",
    description: "Store your first API key, database URL, or other sensitive data",
    completed: false,
  },
  {
    id: "explore-features",
    title: "Explore Key Features",
    description: "Learn about sharing, environments, and team collaboration",
    completed: false,
  },
  {
    id: "setup-team",
    title: "Invite Team Members",
    description: "Collaborate securely with your team",
    completed: false,
    optional: true,
  },
]

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<OnboardingStep[]>(defaultSteps)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (user) {
      checkOnboardingStatus()
    }
  }, [user])

  const checkOnboardingStatus = async () => {
    try {
      // Check if user has completed onboarding
      const { data: preferences } = await supabase
        .from("user_preferences")
        .select("onboarding_completed, onboarding_step")
        .eq("user_id", user?.id)
        .single()

      if (!preferences || !preferences.onboarding_completed) {
        setIsFirstTime(true)
        setCurrentStep(preferences?.onboarding_step || 0)

        // Check if user has any projects (indicates they've used the app before)
        const { data: userOrgs } = await supabase
          .from("organization_members")
          .select("organization_id")
          .eq("user_id", user?.id)

        if (userOrgs && userOrgs.length > 0) {
          const orgIds = userOrgs.map((org) => org.organization_id)
          const { data: projects } = await supabase.from("projects").select("id").in("organization_id", orgIds).limit(1)

          // If user has projects, they're not truly first-time
          if (projects && projects.length > 0) {
            setIsFirstTime(false)
            // Auto-complete some steps
            const updatedSteps = [...defaultSteps]
            updatedSteps[1].completed = true // create-project
            setSteps(updatedSteps)
          }
        }

        // Show onboarding for first-time users or those who haven't completed it
        setShowOnboarding(true)
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error)
    }
  }

  const completeStep = async (stepId: string) => {
    const updatedSteps = steps.map((step) => (step.id === stepId ? { ...step, completed: true } : step))
    setSteps(updatedSteps)

    // Save progress to database
    try {
      await supabase.from("user_preferences").upsert({
        user_id: user?.id,
        onboarding_step: currentStep + 1,
        onboarding_completed: false,
      })
    } catch (error) {
      console.error("Error saving onboarding progress:", error)
    }
  }

  const skipOnboarding = async () => {
    setShowOnboarding(false)
    try {
      await supabase.from("user_preferences").upsert({
        user_id: user?.id,
        onboarding_completed: true,
        onboarding_step: steps.length,
      })
    } catch (error) {
      console.error("Error skipping onboarding:", error)
    }
  }

  const restartOnboarding = () => {
    setCurrentStep(0)
    setSteps(defaultSteps)
    setShowOnboarding(true)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isComplete = steps.filter((step) => !step.optional).every((step) => step.completed)

  return (
    <OnboardingContext.Provider
      value={{
        isFirstTime,
        currentStep,
        steps,
        showOnboarding,
        setShowOnboarding,
        completeStep,
        skipOnboarding,
        restartOnboarding,
        nextStep,
        previousStep,
        isComplete,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
