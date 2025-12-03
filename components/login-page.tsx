"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Lock, Mail, Sparkles } from "lucide-react"

interface LoginPageProps {
  onLoginSuccess: () => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simple validation - in production, connect to your backend
    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simple demo credentials
    if (email === "admin@university.edu" && password === "admin123") {
      onLoginSuccess()
    } else {
      setError("Invalid email or password")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">Campus Admin</h1>
          <p className="text-slate-400 font-medium">Abdelhamid Mehri University</p>
          <p className="text-slate-500 text-sm">NTIC Faculty - Data Science & AI</p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Card Header Gradient */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"></div>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-slate-400 text-sm">Sign in to manage your campus</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <Input
                    type="email"
                    placeholder="admin@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-slate-700 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-slate-700 transition-colors"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-2.5 rounded-lg hover:from-blue-600 hover:to-cyan-500 transition-all duration-200 disabled:opacity-50 shadow-lg shadow-blue-500/20 mt-6"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="border-t border-slate-700/50 pt-4">
              <p className="text-xs text-slate-500 mb-3">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-slate-400">
                <p>
                  Email: <span className="text-blue-400">admin@university.edu</span>
                </p>
                <p>
                  Password: <span className="text-blue-400">admin123</span>
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-xs">
          <p>Master 1 - Data Science and Intelligent Systems</p>
          <p className="mt-1">Mini-Project: Campus Student Management with Microservices</p>
        </div>
      </div>
    </div>
  )
}
