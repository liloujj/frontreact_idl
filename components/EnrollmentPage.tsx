"use client"

import { useEffect, useState } from "react"

interface Student {
  id: number
  first_name: string
  last_name: string
}

interface Course {
  id: number
  name: string
}

interface Enrollment {
  id: number
  student_id: number
  course_id: number
}

export default function EnrollmentPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [selectedStudent, setSelectedStudent] = useState<number | "">("")
  const [selectedCourse, setSelectedCourse] = useState<number | "">("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_URL = "http://localhost:8080"

  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${API_URL}/students`)
      if (!res.ok) throw new Error("Failed to fetch students")
      setStudents(await res.json())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${API_URL}/courses`)
      if (!res.ok) throw new Error("Failed to fetch courses")
      setCourses(await res.json())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchEnrollments = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${API_URL}/enrollments`)
      if (!res.ok) throw new Error("Failed to fetch enrollments")
      setEnrollments(await res.json())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addEnrollment = async () => {
    if (!selectedStudent || !selectedCourse) return alert("Select a student and a course")

    const exists = enrollments.some(
      (e) => e.student_id === selectedStudent && e.course_id === selectedCourse
    )
    if (exists) return alert("This student is already enrolled in this course.")

    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: selectedStudent,
          course_id: selectedCourse,
        }),
      })
      if (!res.ok) throw new Error("Failed to create enrollment")
      setSelectedStudent("")
      setSelectedCourse("")
      fetchEnrollments()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteEnrollment = async (id: number) => {
    if (!confirm("Are you sure you want to delete this enrollment?")) return
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/enrollments/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete enrollment")
      fetchEnrollments()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
    fetchCourses()
    fetchEnrollments()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <h1 className="text-5xl font-extrabold text-blue-900 mb-12 text-center drop-shadow-lg">
        Enrollment Management
      </h1>

      {error && <p className="text-red-500 text-center mb-6">{error}</p>}

      {/* Form */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
        <select
          className="border border-blue-300 rounded-xl px-5 py-3 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md transition"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(Number(e.target.value))}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.first_name} {s.last_name}
            </option>
          ))}
        </select>

        <select
          className="border border-blue-300 rounded-xl px-5 py-3 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md transition"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(Number(e.target.value))}
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={addEnrollment}
          disabled={loading}
          className="bg-blue-700 text-white px-7 py-3 rounded-xl shadow-lg hover:bg-blue-800 hover:scale-105 transform transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Processing..." : "+ Enroll"}
        </button>
      </div>

      {/* Enrollments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading && <p className="col-span-full text-center text-blue-500">Loading...</p>}
        {!loading && enrollments.length === 0 && (
          <p className="col-span-full text-center text-blue-400 mt-8 text-lg">
            No enrollments yet.
          </p>
        )}
        {!loading &&
          enrollments.map((e) => {
            const student = students.find((s) => s.id === e.student_id)
            const course = courses.find((c) => c.id === e.course_id)

            return (
              <div
                key={e.id}
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl p-6 hover:shadow-[0_20px_40px_rgba(30,64,175,0.3)] hover:scale-105 transition-transform duration-300 relative border border-blue-200"
              >
                <h2 className="text-2xl font-bold text-blue-900 mb-2">
                  {student ? `${student.first_name} ${student.last_name}` : "Unknown Student"}
                </h2>
                <p className="text-blue-700 mb-4">{course ? course.name : "Unknown Course"}</p>
                <button
                  onClick={() => deleteEnrollment(e.id)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-600 font-semibold transition-colors"
                  title="Delete Enrollment"
                >
                  Delete
                </button>
              </div>
            )
          })}
      </div>
    </div>
  )
}
