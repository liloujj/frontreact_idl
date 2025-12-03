"use client"
import { useState } from "react"
import { BookOpen, Users, Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface Course {
  id: string
  name: string
  instructor: string
  category: string
  credits: number
}

interface Enrollment {
  id: string
  student: Student
  course: Course
  progress: number
  grade: string
}

export default function StudentCourseView() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([
    {
      id: "1",
      student: { id: "1", firstName: "Ahmed", lastName: "Benmessaoud", email: "ahmed@univ.edu" },
      course: { id: "1", name: "Machine Learning", instructor: "Dr. Karim", category: "AI", credits: 3 },
      progress: 85,
      grade: "A",
    },
    {
      id: "2",
      student: { id: "2", firstName: "Fatima", lastName: "Zahra", email: "fatima@univ.edu" },
      course: { id: "2", name: "Data Science", instructor: "Prof. Sarah", category: "DS", credits: 4 },
      progress: 72,
      grade: "B+",
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEnrollments = enrollments.filter(
    (en) =>
      en.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      en.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      en.course.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Student Course Enrollment</h1>
            <p className="text-muted-foreground">Track student progress and grades</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by student or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Enrollments Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-primary to-accent text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Student</th>
                <th className="px-6 py-3 text-left font-semibold">Course</th>
                <th className="px-6 py-3 text-left font-semibold">Instructor</th>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-6 py-3 text-left font-semibold">Progress</th>
                <th className="px-6 py-3 text-left font-semibold">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEnrollments.map((en, idx) => (
                <tr key={en.id} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {en.student.firstName} {en.student.lastName}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{en.course.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{en.course.instructor}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      {en.course.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-border rounded-full h-2">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          style={{ width: `${en.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{en.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-primary">{en.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredEnrollments.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No enrollments found</p>
          </div>
        )}
      </Card>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <p className="text-muted-foreground text-sm font-medium mb-1">Total Enrollments</p>
          <p className="text-4xl font-bold text-primary">{enrollments.length}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
          <p className="text-muted-foreground text-sm font-medium mb-1">Avg Progress</p>
          <p className="text-4xl font-bold text-accent">
            {Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length)}%
          </p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
          <p className="text-muted-foreground text-sm font-medium mb-1">Avg Credits</p>
          <p className="text-4xl font-bold text-secondary">
            {(enrollments.reduce((acc, e) => acc + e.course.credits, 0) / enrollments.length).toFixed(1)}
          </p>
        </Card>
      </div>
    </div>
  )
}
