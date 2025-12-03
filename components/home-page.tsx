"use client"

import { GraduationCap, BookOpen, MessageSquare, Users, School } from "lucide-react"

export function HomePage({
  onNavigate,
}: {
  onNavigate: (page: "students" | "courses" | "student-courses" | "chatbot" | "universities") => void
}) {
  return (
    <section className="min-h-[calc(100vh-5rem)] relative overflow-hidden bg-background">
      
      {/* Floating Decorative Blobs (blue/cyan) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-tr from-accent/20 via-primary/10 to-accent/30 rounded-full blur-[120px] animate-blob"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-bl from-primary/20 via-accent/10 to-primary/30 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center relative z-10">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-6 py-2 bg-accent/10 backdrop-blur-md border border-accent/30 rounded-full text-sm text-accent font-semibold">
          <School className="w-4 h-4 text-accent" />
          Abdelhamid Mehri University – Constantine 2
        </span>

        {/* Main Title */}
        <h1 className="mt-6 text-6xl md:text-7xl font-extrabold text-foreground drop-shadow-lg">
          Campus Management System
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Gérez vos étudiants, organisez les cours et exploitez l'IA pour une assistance intelligente.
        </p>
      </div>

      {/* Features Cards */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16 relative z-10">
        {[
          {
            icon: <GraduationCap className="w-10 h-10 text-primary" />,
            title: "Student Management",
            desc: "Ajouter, mettre à jour, supprimer et rechercher des étudiants. Gérer les inscriptions et les associations universitaires.",
            colorFrom: "from-primary/20",
            colorTo: "to-accent/20",
            navigate: "students",
          },
          {
            icon: <BookOpen className="w-10 h-10 text-accent" />,
            title: "Course Management",
            desc: "Créer et gérer les cours, organiser les horaires et gérer les inscriptions par catégorie.",
            colorFrom: "from-accent/20",
            colorTo: "to-primary/10",
            navigate: "courses",
          },
          {
            icon: <Users className="w-10 h-10 text-primary" />,
            title: "Student-Courses",
            desc: "Voir les inscriptions des étudiants avec des détails sur les relations cours en temps réel.",
            colorFrom: "from-primary/20",
            colorTo: "to-accent/10",
            navigate: "student-courses",
          },
          {
            icon: <MessageSquare className="w-10 h-10 text-accent" />,
            title: "AI Chatbot",
            desc: "Traduction et résumé de texte avec une assistance IA en temps réel.",
            colorFrom: "from-accent/20",
            colorTo: "to-primary/10",
            navigate: "chatbot",
          },
          {
            icon: <School className="w-10 h-10 text-primary" />,
            title: "University Management",
            desc: "Ajouter, mettre à jour et gérer les universités associées aux étudiants et aux cours.",
            colorFrom: "from-primary/20",
            colorTo: "to-accent/20",
            navigate: "universities",
          },
        ].map((card, index) => (
          <div
            key={index}
            onClick={() => onNavigate(card.navigate as any)}
            className="group p-10 rounded-3xl cursor-pointer bg-card/50 backdrop-blur-xl border border-border/20 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
          >
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${card.colorFrom} ${card.colorTo} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}
            >
              {card.icon}
            </div>
            <h3 className="mt-6 text-3xl font-bold text-foreground">{card.title}</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">{card.desc}</p>
            <div className="mt-4 flex items-center text-accent font-semibold">
              Explore <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center text-muted-foreground text-sm border-t border-border pt-12 relative z-10">
        <p className="font-semibold">Master 1 – Data Science & Intelligent Systems</p>
        <p className="mt-1">NTIC Faculty | Mini-Project: Campus Student Management</p>
      </footer>
    </section>
  )
}
