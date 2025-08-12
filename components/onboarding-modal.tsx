"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Shield, FolderPlus, Key, Users, Sparkles, ArrowRight, ArrowLeft, X, CheckCircle, Play } from "lucide-react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { CreateProjectModal } from "@/components/create-project-modal"

const stepIcons = {
  welcome: Shield,
  "create-project": FolderPlus,
  "add-secret": Key,
  "explore-features": Sparkles,
  "setup-team": Users,
}

const stepContent = {
  welcome: {
    title: "Welcome to SecureVault! 🎉",
    description: "Your secure secret management platform is ready. Let's get you set up in just a few steps.",
    content: (
      <div className="space-y-4">
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <h4 className="font-medium text-emerald-900 mb-2">What you'll learn:</h4>
          <ul className="text-sm text-emerald-700 space-y-1">
            <li>• How to organize secrets with projects</li>
            <li>• Adding and managing your sensitive data</li>
            <li>• Sharing secrets securely with your team</li>
            <li>• Best practices for secret management</li>
          </ul>
        </div>
        <p className="text-sm text-slate-600">
          This quick tour will take about 2 minutes. You can skip it anytime and return later.
        </p>
      </div>
    ),
  },
  "create-project": {
    title: "Create Your First Project",
    description: "Projects help you organize secrets by application, environment, or team.",
    content: (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Why use projects?</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Keep secrets organized by application</li>
            <li>• Set different access permissions per project</li>
            <li>• Manage environments (dev, staging, prod)</li>
            <li>• Track changes with audit logs</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <CreateProjectModal
            trigger={
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <FolderPlus className="mr-2 h-4 w-4" />
                Create Your First Project
              </Button>
            }
          />
        </div>
      </div>
    ),
  },
  "add-secret": {
    title: "Add Your First Secret",
    description: "Store API keys, database URLs, tokens, and other sensitive information securely.",
    content: (
      <div className="space-y-4">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-900 mb-2">Secret types we support:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-purple-700">
            <div>• API Keys</div>
            <div>• Database URLs</div>
            <div>• Auth Tokens</div>
            <div>• Webhook Secrets</div>
            <div>• Certificates</div>
            <div>• Custom Values</div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-600 mb-4">
            All secrets are encrypted with AES-256 before storage. Only you and authorized team members can decrypt
            them.
          </p>
          <Button variant="outline" className="bg-transparent">
            <Key className="mr-2 h-4 w-4" />
            I'll Add Secrets Later
          </Button>
        </div>
      </div>
    ),
  },
  "explore-features": {
    title: "Explore Key Features",
    description: "Discover powerful features that make secret management easy and secure.",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-3 rounded-lg">
            <h5 className="font-medium text-slate-900 mb-1">🔄 Version History</h5>
            <p className="text-xs text-slate-600">Track changes and rollback when needed</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <h5 className="font-medium text-slate-900 mb-1">🌍 Environments</h5>
            <p className="text-xs text-slate-600">Separate dev, staging, and production</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <h5 className="font-medium text-slate-900 mb-1">🔍 Advanced Search</h5>
            <p className="text-xs text-slate-600">Find secrets quickly with filters</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <h5 className="font-medium text-slate-900 mb-1">📊 Audit Logs</h5>
            <p className="text-xs text-slate-600">Complete access and change history</p>
          </div>
        </div>
        <div className="text-center">
          <Button variant="outline" className="bg-transparent">
            <Play className="mr-2 h-4 w-4" />
            Take Interactive Tour
          </Button>
        </div>
      </div>
    ),
  },
  "setup-team": {
    title: "Invite Your Team",
    description: "Collaborate securely by inviting team members with role-based access control.",
    content: (
      <div className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-yellow-900 mb-2">Team collaboration features:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Role-based access (Admin, Developer, Read-only)</li>
            <li>• Per-secret sharing permissions</li>
            <li>• Team activity monitoring</li>
            <li>• Secure invitation system</li>
          </ul>
        </div>
        <div className="flex justify-center space-x-3">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Users className="mr-2 h-4 w-4" />
            Invite Team Members
          </Button>
          <Button variant="outline" className="bg-transparent">
            Skip for Now
          </Button>
        </div>
      </div>
    ),
  },
}

export function OnboardingModal() {
  const {
    showOnboarding,
    setShowOnboarding,
    currentStep,
    steps,
    nextStep,
    previousStep,
    skipOnboarding,
    completeStep,
    isComplete,
  } = useOnboarding()

  const [isAnimating, setIsAnimating] = useState(false)

  if (!showOnboarding) return null

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100
  const Icon = stepIcons[currentStepData?.id as keyof typeof stepIcons] || Shield

  const handleNext = async () => {
    setIsAnimating(true)

    // Complete current step
    if (currentStepData) {
      await completeStep(currentStepData.id)
    }

    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        nextStep()
      } else {
        // Onboarding complete
        setShowOnboarding(false)
      }
      setIsAnimating(false)
    }, 200)
  }

  const handlePrevious = () => {
    setIsAnimating(true)
    setTimeout(() => {
      previousStep()
      setIsAnimating(false)
    }, 200)
  }

  const handleSkip = () => {
    skipOnboarding()
  }

  if (!currentStepData) return null

  const content = stepContent[currentStepData.id as keyof typeof stepContent]

  return (
    <Dialog open={showOnboarding} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Icon className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">{content?.title}</DialogTitle>
                <DialogDescription className="text-base">{content?.description}</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-slate-600">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className={`transition-opacity duration-200 ${isAnimating ? "opacity-50" : "opacity-100"}`}>
          {content?.content}
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? "bg-emerald-600" : index < currentStep ? "bg-emerald-300" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious} disabled={isAnimating} className="bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
            {currentStepData.optional && (
              <Badge variant="secondary" className="text-xs">
                Optional
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={handleSkip} className="text-slate-600 hover:text-slate-800">
              Skip Tour
            </Button>
            <Button onClick={handleNext} disabled={isAnimating} className="bg-emerald-600 hover:bg-emerald-700">
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
