"use client"

import React from "react"
import { Navigation, PageType } from "@/components/navigation"
import { HomePage } from "@/components/home-page"
import { WelcomePage } from "@/components/welcome-page"
import StudentDashboard from "@/components/student-dashboard"
import { CourseDashboard } from "@/components/course-dashboard"
import StudentCourseView from "@/components/student-course-view"
import { ChatbotInterface } from "@/components/chatbot-interface"
import UniversityPage from "@/components/UniversityPage"
import EnrollmentPage from "@/components/EnrollmentPage"

export default function Page() {
  const [currentPage, setCurrentPage] = React.useState<PageType>("home")
  const [isAuthenticated, setIsAuthenticated] = React.useState(true)
  const [showWelcome, setShowWelcome] = React.useState(true)

  if (!isAuthenticated) {
    return (
      <WelcomePage
        onStart={() => {
          setIsAuthenticated(true)
          setShowWelcome(false)
          setCurrentPage("home")
        }}
      />
    )
  }

  if (showWelcome) {
    return <WelcomePage onStart={() => setShowWelcome(false)} />
  }

  const renderPage = () => {
    switch (currentPage) {
      case "students":
        return <StudentDashboard />
      case "courses":
        return <CourseDashboard />
      case "student-courses":
        return <StudentCourseView />
      case "chatbot":
        return <ChatbotInterface />
      case "universities":
        return <UniversityPage />
      case "enrollments":
        return <EnrollmentPage />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentPage("home")
    setShowWelcome(false)
  }

  return (
    <Navigation
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Navigation>
  )
}
