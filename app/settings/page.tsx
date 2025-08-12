"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Key, Bell, Trash2, Download, Moon, Sun, Monitor, Loader2, Save } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"

interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
}

interface UserPreferences {
  theme: string
  email_notifications: boolean
  slack_notifications: boolean
  notification_events: {
    secret_accessed: boolean
    secret_modified: boolean
    team_member_added: boolean
    failed_login: boolean
    api_key_usage: boolean
  }
  two_factor_enabled: boolean
  session_timeout: number
  timezone: string
  date_format: string
  time_format: string
  api_rate_limit: number
}

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  // Form states
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [company, setCompany] = useState("")

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)

      // Load profile and preferences in parallel
      const [profileResponse, preferencesResponse] = await Promise.all([
        fetch("/api/user/profile"),
        fetch("/api/user/preferences"),
      ])

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setProfile(profileData.profile)

        // Split full name into first and last name
        const nameParts = profileData.profile.full_name?.split(" ") || []
        setFirstName(nameParts[0] || "")
        setLastName(nameParts.slice(1).join(" ") || "")
      }

      if (preferencesResponse.ok) {
        const preferencesData = await preferencesResponse.json()
        setPreferences(preferencesData.preferences)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveProfile = async () => {
    if (!profile) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: `${firstName} ${lastName}`.trim(),
          // company would need to be added to profiles table
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        loadUserData() // Refresh data
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const savePreferences = async (updates: Partial<UserPreferences>) => {
    if (!preferences) return

    try {
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const data = await response.json()
        setPreferences(data.preferences)
        toast({
          title: "Success",
          description: "Preferences updated successfully",
        })
      } else {
        throw new Error("Failed to update preferences")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      })
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    savePreferences({ theme: newTheme })
  }

  const handleNotificationToggle = (key: keyof UserPreferences, value: boolean) => {
    savePreferences({ [key]: value })
  }

  const handleNotificationEventToggle = (event: string, value: boolean) => {
    if (!preferences) return

    const updatedEvents = {
      ...preferences.notification_events,
      [event]: value,
    }
    savePreferences({ notification_events: updatedEvents })
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
            <p className="text-slate-600 mt-1">Manage your account and security preferences</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 max-w-3xl">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="api">API Keys</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={profile?.email || ""} disabled className="bg-slate-50" />
                    <p className="text-xs text-slate-500">Email cannot be changed here. Contact support if needed.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={preferences?.timezone || "UTC"}
                      onValueChange={(value) => savePreferences({ timezone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Europe/Paris">Paris</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select
                        value={preferences?.date_format || "MM/DD/YYYY"}
                        onValueChange={(value) => savePreferences({ date_format: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeFormat">Time Format</Label>
                      <Select
                        value={preferences?.time_format || "12h"}
                        onValueChange={(value) => savePreferences({ time_format: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12 Hour</SelectItem>
                          <SelectItem value="24h">24 Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={saveProfile} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>Export your data or delete your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Export Account Data</h4>
                      <p className="text-sm text-slate-600">Download all your secrets and settings</p>
                    </div>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-600">Delete Account</h4>
                      <p className="text-sm text-slate-600">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Preferences</CardTitle>
                  <CardDescription>Customize the appearance of your interface</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          theme === "light"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() => handleThemeChange("light")}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Sun className="h-4 w-4" />
                          <span className="font-medium">Light</span>
                        </div>
                        <div className="w-full h-8 bg-white border rounded"></div>
                      </div>
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          theme === "dark"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() => handleThemeChange("dark")}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Moon className="h-4 w-4" />
                          <span className="font-medium">Dark</span>
                        </div>
                        <div className="w-full h-8 bg-slate-800 border rounded"></div>
                      </div>
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          theme === "system"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() => handleThemeChange("system")}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Monitor className="h-4 w-4" />
                          <span className="font-medium">System</span>
                        </div>
                        <div className="w-full h-8 bg-gradient-to-r from-white to-slate-800 border rounded"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Configure your security preferences and authentication methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={preferences?.two_factor_enabled ? "default" : "secondary"}>
                        {preferences?.two_factor_enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <Switch
                        checked={preferences?.two_factor_enabled || false}
                        onCheckedChange={(checked) => handleNotificationToggle("two_factor_enabled", checked)}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Select
                      value={preferences?.session_timeout?.toString() || "30"}
                      onValueChange={(value) => savePreferences({ session_timeout: Number.parseInt(value) })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose how you want to be notified about important events</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-slate-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={preferences?.email_notifications || false}
                      onCheckedChange={(checked) => handleNotificationToggle("email_notifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Slack Integration</h4>
                      <p className="text-sm text-slate-600">Send notifications to your Slack workspace</p>
                    </div>
                    <Switch
                      checked={preferences?.slack_notifications || false}
                      onCheckedChange={(checked) => handleNotificationToggle("slack_notifications", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">Event Types</h4>
                    <div className="space-y-3">
                      {preferences?.notification_events &&
                        Object.entries(preferences.notification_events).map(([event, enabled]) => (
                          <div key={event} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{event.replace("_", " ")}</span>
                            <Switch
                              checked={enabled}
                              onCheckedChange={(checked) => handleNotificationEventToggle(event, checked)}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="mr-2 h-5 w-5" />
                    API Keys
                  </CardTitle>
                  <CardDescription>Manage your API keys for programmatic access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="rateLimit">API Rate Limit (requests/hour)</Label>
                      <p className="text-sm text-slate-600">Maximum API requests per hour</p>
                    </div>
                    <Select
                      value={preferences?.api_rate_limit?.toString() || "1000"}
                      onValueChange={(value) => savePreferences({ api_rate_limit: Number.parseInt(value) })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="500">500</SelectItem>
                        <SelectItem value="1000">1,000</SelectItem>
                        <SelectItem value="5000">5,000</SelectItem>
                        <SelectItem value="10000">10,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Key className="mr-2 h-4 w-4" />
                    Generate New API Key
                  </Button>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Production API Key</p>
                        <p className="text-sm text-slate-600 font-mono">sv_prod_••••••••••••••••</p>
                        <p className="text-xs text-slate-500">Created: Jan 10, 2024 • Last used: 2 hours ago</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Regenerate
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Manage your subscription and billing information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Enterprise Plan</h3>
                      <p className="text-slate-600">$99/month • Unlimited secrets and team members</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">∞</p>
                      <p className="text-sm text-slate-600">Secrets</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">∞</p>
                      <p className="text-sm text-slate-600">Team Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">99.9%</p>
                      <p className="text-sm text-slate-600">Uptime SLA</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline">Change Plan</Button>
                    <Button variant="outline">View Invoices</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
