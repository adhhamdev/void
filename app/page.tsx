"use client"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Key, Globe, Users, Lock, Zap, CheckCircle } from "lucide-react"
import Link from "next/link"
import { QuickMagicLink } from "@/components/quick-magic-link"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-slate-900">SecureVault</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth">
              <Button variant="outline" className="bg-transparent">
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-blue-50/30"
            style={{
              transform: `translate3d(0, ${scrollY * 0.1}px, 0)`,
            }}
          />

          <div
            className="absolute top-20 left-10 w-32 h-32 bg-emerald-200/20 rounded-full blur-xl"
            style={{
              transform: `translate3d(0, ${scrollY * 0.2}px, 0)`,
            }}
          />
          <div
            className="absolute top-40 right-20 w-24 h-24 bg-blue-200/20 rounded-full blur-xl"
            style={{
              transform: `translate3d(0, ${scrollY * 0.15}px, 0)`,
            }}
          />
          <div
            className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-200/20 rounded-full blur-xl"
            style={{
              transform: `translate3d(0, ${scrollY * 0.25}px, 0)`,
            }}
          />

          <div
            className="absolute top-32 right-1/4 text-emerald-300/30"
            style={{
              transform: `translate3d(0, ${scrollY * 0.3}px, 0) rotate(${scrollY * 0.1}deg)`,
            }}
          >
            <Key className="h-16 w-16" />
          </div>
          <div
            className="absolute bottom-32 right-10 text-blue-300/30"
            style={{
              transform: `translate3d(0, ${scrollY * 0.2}px, 0) rotate(${-scrollY * 0.05}deg)`,
            }}
          >
            <Lock className="h-12 w-12" />
          </div>
          <div
            className="absolute top-1/2 left-10 text-purple-300/30"
            style={{
              transform: `translate3d(0, ${scrollY * 0.35}px, 0) rotate(${scrollY * 0.08}deg)`,
            }}
          >
            <Shield className="h-20 w-20" />
          </div>
        </div>

        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div
            style={{
              transform: `translate3d(0, ${scrollY * 0.05}px, 0)`,
            }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-emerald-100 p-4 rounded-full shadow-lg">
                <Shield className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Secure Secret Management
              <span className="text-emerald-600"> Made Simple</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Store, manage, and share your application secrets securely with your team. End-to-end encryption, audit
              logs, and seamless integrations.
            </p>

            {/* Quick Magic Link */}
            <div className="max-w-md mx-auto mb-8">
              <QuickMagicLink placeholder="Enter your email to get started" buttonText="Try Free" className="w-full" />
            </div>

            <p className="text-sm text-slate-500">No credit card required • Free forever for personal use</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything you need for secret management</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built for developers, trusted by teams. SecureVault provides enterprise-grade security with
              developer-friendly tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-fr">
            {/* Large Feature Card - End-to-End Encryption */}
            <div className="md:col-span-2 lg:col-span-2 md:row-span-2">
              <Card className="h-full border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="bg-emerald-500 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Lock className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-4 text-slate-900">End-to-End Encryption</CardTitle>
                    <CardDescription className="text-base text-slate-700 leading-relaxed">
                      Your secrets are encrypted with AES-256 before they leave your device. Zero-knowledge architecture
                      ensures only you can decrypt your data. Military-grade security for your most sensitive
                      information.
                    </CardDescription>
                  </div>
                  <div className="mt-6 flex items-center text-emerald-600 font-medium">
                    <span>Learn more</span>
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Medium Feature Card - Team Collaboration */}
            <div className="md:col-span-2 lg:col-span-2">
              <Card className="h-full border-0 bg-gradient-to-br from-blue-50 to-blue-100/50  hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="bg-blue-500 p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-3 text-slate-900">Team Collaboration</CardTitle>
                    <CardDescription className="text-slate-700">
                      Share secrets securely with your team. Role-based access control ensures the right people have
                      access.
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Small Feature Card - Developer Experience */}
            <div className="md:col-span-2 lg:col-span-2">
              <Card className="h-full border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50  hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <div className="bg-yellow-500 p-3 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg mb-2 text-slate-900">Developer Experience</CardTitle>
                  <CardDescription className="text-sm text-slate-700">
                    CLI tools, API access, and seamless integrations.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Medium Feature Card - Environment Management */}
            <div className="md:col-span-2 lg:col-span-4">
              <Card className="h-full border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="bg-purple-500 p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-3 text-slate-900">Environment Management</CardTitle>
                    <CardDescription className="text-slate-700">
                      Organize secrets by environment (dev, staging, prod). Deploy with confidence knowing your configs
                      are secure.
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Large Feature Card - Audit & Compliance */}
            <div className="md:col-span-2 lg:col-span-3 md:row-span-2">
              <Card className="h-full border-0 bg-gradient-to-br from-red-50 to-red-100/50  hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="bg-red-500 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Key className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-4 text-slate-900">Audit & Compliance</CardTitle>
                    <CardDescription className="text-base text-slate-700 leading-relaxed">
                      Complete audit trails for all secret access. SOC 2 compliant infrastructure with detailed access
                      logs. Meet enterprise compliance requirements with comprehensive reporting and monitoring.
                    </CardDescription>
                  </div>
                  <div className="mt-6 flex items-center text-red-600 font-medium">
                    <span>View compliance docs</span>
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Small Feature Card - Version Control */}
            <div className="md:col-span-2 lg:col-span-3">
              <Card className="h-full border-0 bg-gradient-to-br from-green-50 to-green-100/50  hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <div className="bg-green-500 p-3 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg mb-2 text-slate-900">Version Control</CardTitle>
                  <CardDescription className="text-sm text-slate-700">
                    Track changes with full version history and rollback capabilities.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-emerald-600">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to secure your secrets?</h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Join thousands of developers who trust SecureVault with their most sensitive data.
          </p>
          <div className="max-w-md mx-auto">
            <QuickMagicLink placeholder="Enter your email" buttonText="Get Started Free" className="w-full" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-emerald-400" />
              <span className="font-bold text-white">SecureVault</span>
            </div>
            <div className="text-sm">© 2024 SecureVault. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
