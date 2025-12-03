"use client"

import { useEffect, useState } from "react"
import { BookOpen, Users, Search, Trash2, PlusCircle, Edit3 } from "lucide-react"
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
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])

  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [progress, setProgress] = useState<number>(0)
  const [grade, setGrade] = useState<string>("")

  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [editingId, setEditingId] = useState<string | null>(null)

  // -------------------------
  // FETCH DATA
  // -------------------------
  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:8080/students")
      if (!res.ok) throw new Error("Failed to fetch students")
      setStudents(await res.json())
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to load students")
    }
  }

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:8080/courses")
      if (!res.ok) throw new Error("Failed to fetch courses")
      setCourses(await res.json())
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to load courses")
    }
  }

  const fetchEnrollments = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("http://localhost:8080/enrollments")
      if (!res.ok) throw new Error("Failed to fetch enrollments")
      setEnrollments(await res.json())
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to load enrollments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
    fetchCourses()
    fetchEnrollments()
  }, [])

  // -------------------------
  // ADD OR EDIT ENROLLMENT
  // -------------------------
  const saveEnrollment = async () => {
    if (!selectedStudent || !selectedCourse) return alert("Select student and course")

    const payload = {
      student_id: selectedStudent,
      course_id: selectedCourse,
      progress,
      grade,
    }

    try {
      if (editingId) {
        // EDIT
        const res = await fetch(`http://localhost:8080/enrollments/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to update enrollment")
      } else {
        // ADD
        const res = await fetch("http://localhost:8080/enrollments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to create enrollment")
      }

      // Reset form
      setSelectedStudent("")
      setSelectedCourse("")
      setProgress(0)
      setGrade("")
      setEditingId(null)
      fetchEnrollments()
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to save enrollment")
    }
  }

  // -------------------------
  // DELETE ENROLLMENT
  // -------------------------
  const deleteEnrollment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enrollment?")) return
    try {
      const res = await fetch(`http://localhost:8080/enrollments/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete enrollment")
      fetchEnrollments()
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to delete enrollment")
    }
  }

  // -------------------------
  // EDIT FORM
  // -------------------------
  const startEditing = (en: Enrollment) => {
    setEditingId(en.id)
    setSelectedStudent(en.student.id)
    setSelectedCourse(en.course.id)
    setProgress(en.progress)
    setGrade(en.grade)
  }

  // -------------------------
  // FILTER
  // -------------------------
  const filteredEnrollments = enrollments.filter(
    (en) =>
      en.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      en.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      en.course.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
          <BookOpen className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground">Student Course Enrollment</h1>
          <p className="text-muted-foreground">Manage enrollments and track progress</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <select
          className="border border-blue-300 rounded-xl px-5 py-3 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md transition"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.firstName} {s.lastName}
            </option>
          ))}
        </select>

        <select
          className="border border-blue-300 rounded-xl px-5 py-3 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md transition"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <Input
          type="number"
          placeholder="Progress %"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-32"
        />

        <Input
          placeholder="Grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-32"
        />

        <button
          onClick={saveEnrollment}
          className="bg-blue-700 text-white px-5 py-3 rounded-xl shadow-lg hover:bg-blue-800 flex items-center gap-2"
        >
          {editingId ? <Edit3 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
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
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEnrollments.length > 0 ? (
                filteredEnrollments.map((en, idx) => (
                  <tr key={en.id} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                    <td className="px-6 py-4 font-medium">
                      {en.student.firstName} {en.student.lastName}
                    </td>
                    <td className="px-6 py-4">{en.course.name}</td>
                    <td className="px-6 py-4">{en.course.instructor}</td>
                    <td className="px-6 py-4">{en.course.category}</td>
                    <td className="px-6 py-4">{en.progress}%</td>
                    <td className="px-6 py-4">{en.grade}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => startEditing(en)}
                        className="text-yellow-500 hover:text-yellow-600"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEnrollment(en.id)}
                        className="text-red-500 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    No enrollments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
