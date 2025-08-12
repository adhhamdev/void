"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Play, RotateCcw } from "lucide-react"
import { useOnboarding } from "@/contexts/onboarding-context"

export function OnboardingChecklist() {
  const { steps, showOnboarding, setShowOnboarding, restartOnboarding, isComplete } = useOnboarding()

  const completedSteps = steps.filter((step) => step.completed).length
  const totalSteps = steps.filter((step) => !step.optional).length
  const progress = (completedSteps / steps.length) * 100

  if (isComplete) return null

  return (
    <Card className="border-emerald-200 bg-emerald-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-emerald-900">Getting Started</CardTitle>
            <CardDescription className="text-emerald-700">
              Complete these steps to get the most out of SecureVault
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
            {completedSteps}/{steps.length} complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-700">Progress</span>
            <span className="text-emerald-700">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-emerald-100" />
        </div>

        <div className="space-y-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-emerald-100/50 transition-colors"
            >
              {step.completed ? (
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    step.completed ? "text-emerald-900 line-through" : "text-emerald-800"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-emerald-600">{step.description}</p>
              </div>
              {step.optional && (
                <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-600">
                  Optional
                </Badge>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2 pt-2 border-t border-emerald-200">
          <Button size="sm" onClick={() => setShowOnboarding(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Play className="mr-2 h-4 w-4" />
            {showOnboarding ? "Continue Tour" : "Start Tour"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={restartOnboarding}
            className="bg-transparent border-emerald-300 text-emerald-700 hover:bg-emerald-100"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
