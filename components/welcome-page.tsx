"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, GraduationCap, School, BookOpen, Sparkles } from "lucide-react"

interface WelcomePageProps {
  onStart: () => void
}

export function WelcomePage({ onStart }: WelcomePageProps) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">

      {/* --- Background Image Hero --- */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-75 scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1950&q=80')",
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-accent/30 backdrop-blur-sm"></div>

      {/* Floating decorative shapes */}
      <Sparkles className="absolute top-10 left-10 w-10 h-10 text-accent animate-pulse" />
      <GraduationCap className="absolute bottom-16 right-14 w-14 h-14 text-accent/50 animate-bounce" />

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 text-center max-w-3xl px-6 space-y-10">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-white/90">Student Management System</span>
        </div>

        {/* Titles */}
        <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight drop-shadow-xl leading-[1.1]">
          Campus Hub
        </h1>

        <p className="text-lg md:text-2xl text-white/80 max-w-xl mx-auto leading-relaxed">
          Transformez votre expérience académique avec une plateforme élégante, intuitive et intelligente.
        </p>

        {/* Floating CTA Button */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">

          <Button
            onClick={onStart}
            size="lg"
            className="relative px-10 py-6 text-lg rounded-xl font-medium bg-accent text-black shadow-xl 
              transition-all duration-300 hover:scale-110 hover:shadow-accent/40 hover:shadow-2xl
              before:absolute before:-inset-1 before:bg-accent/40 before:blur-xl before:rounded-xl before:opacity-0
              hover:before:opacity-100 group"
          >
            Commencer maintenant
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="px-10 py-6 text-lg rounded-xl border-white/40 text-white backdrop-blur-md hover:bg-white/10"
          >
            En savoir plus
          </Button>

        </div>

        {/* Features — glassmorphism cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">

          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <School className="w-10 h-10 text-accent mb-4" />
            <div className="text-3xl font-bold text-white">100K+</div>
            <p className="text-sm text-white/70">Étudiants confiants</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <BookOpen className="w-10 h-10 text-accent mb-4" />
            <div className="text-3xl font-bold text-white">50+</div>
            <p className="text-sm text-white/70">Établissements</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <GraduationCap className="w-10 h-10 text-accent mb-4" />
            <div className="text-3xl font-bold text-white">24/7</div>
            <p className="text-sm text-white/70">Support disponible</p>
          </div>

        </div>
      </div>
    </div>
  )
}
