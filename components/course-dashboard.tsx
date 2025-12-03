"use client"

import { useState } from "react"
import { BookOpen, Search, Plus, Edit2, Trash2, Users, Clock, TrendingUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface Course {
  id: string
  name: string
  instructor: string
  category: string
  schedule: string
  students: number
  credits: number
}

export function CourseDashboard() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      name: "Machine Learning Basics",
      instructor: "Dr. Karim",
      category: "AI",
      schedule: "Mon-Wed 10:00 AM",
      students: 28,
      credits: 3,
    },
    {
      id: "2",
      name: "Data Science Fundamentals",
      instructor: "Prof. Sarah",
      category: "Data Science",
      schedule: "Tue-Thu 2:00 PM",
      students: 35,
      credits: 4,
    },
    {
      id: "3",
      name: "Web Development",
      instructor: "Eng. Mohamed",
      category: "Web",
      schedule: "Wed-Fri 9:00 AM",
      students: 22,
      credits: 3,
    },
    {
      id: "4",
      name: "Database Systems",
      instructor: "Prof. Amina",
      category: "Databases",
      schedule: "Mon-Wed 1:00 PM",
      students: 18,
      credits: 3,
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", instructor: "", category: "", schedule: "" })
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCourse = () => {
    if (formData.name && formData.instructor && formData.category) {
      const newCourse: Course = {
        id: Date.now().toString(),
        ...formData,
        students: 0,
        credits: 3,
      }
      setCourses([...courses, newCourse])
      setFormData({ name: "", instructor: "", category: "", schedule: "" })
      setShowForm(false)
    }
  }

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id))
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourse({ ...course })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    if (editingCourse) {
      setCourses(courses.map((c) => (c.id === editingCourse.id ? editingCourse : c)))
      setShowEditModal(false)
      setEditingCourse(null)
    }
  }

  const handleManageEnrollment = (course: Course) => {
    setSelectedCourse(course)
    setShowEnrollmentModal(true)
  }

  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    AI: { bg: "bg-blue-500/10", text: "text-blue-700", border: "border-blue-300" },
    "Data Science": { bg: "bg-purple-500/10", text: "text-purple-700", border: "border-purple-300" },
    Web: { bg: "bg-emerald-500/10", text: "text-emerald-700", border: "border-emerald-300" },
    Databases: { bg: "bg-orange-500/10", text: "text-orange-700", border: "border-orange-300" },
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Course Management
            </h2>
            <p className="text-slate-600">Add, update, and organize courses</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search courses by name, instructor, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-50 border-slate-300 focus:border-cyan-400"
          />
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-600"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card className="mb-8 p-6 border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Course</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Course Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white border-slate-300"
            />
            <Input
              placeholder="Instructor Name"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              className="bg-white border-slate-300"
            />
            <Input
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="bg-white border-slate-300"
            />
            <Input
              placeholder="Schedule"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              className="bg-white border-slate-300"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAddCourse}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              Save Course
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {filteredCourses.map((course) => {
          const colors = categoryColors[course.category] || categoryColors["AI"]
          return (
            <Card
              key={course.id}
              className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-cyan-500 bg-gradient-to-br from-white to-slate-50/50 hover:border-slate-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
                      {course.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{course.name}</h3>
                  <p className="text-sm text-slate-600">👨‍🏫 {course.instructor}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-cyan-100 text-cyan-600"
                    onClick={() => handleEditCourse(course)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-red-100 text-red-600"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Clock className="w-4 h-4 text-cyan-500" />
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>
                    {course.students} students • {course.credits} credits
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  className="w-full text-sm bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 border-cyan-200 text-cyan-600"
                  size="sm"
                  onClick={() => handleManageEnrollment(course)}
                >
                  Manage Enrollment
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-muted-foreground text-lg">No courses found</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-400/10 border-cyan-300/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1 font-medium">Total Courses</p>
              <p className="text-4xl font-bold text-cyan-600">{courses.length}</p>
            </div>
            <BookOpen className="w-10 h-10 text-cyan-400/30" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 border-blue-300/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1 font-medium">Total Enrollment</p>
              <p className="text-4xl font-bold text-blue-600">{courses.reduce((acc, c) => acc + c.students, 0)}</p>
            </div>
            <Users className="w-10 h-10 text-blue-400/30" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-slate-500/10 to-slate-400/10 border-slate-300/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1 font-medium">Avg/Course</p>
              <p className="text-4xl font-bold text-slate-700">
                {(courses.reduce((acc, c) => acc + c.students, 0) / courses.length).toFixed(1)}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-slate-400/30" />
          </div>
        </Card>
      </div>

      {showEditModal && editingCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Edit Course</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowEditModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <Input
                placeholder="Course Name"
                value={editingCourse.name}
                onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                className="bg-slate-50 border-slate-300"
              />
              <Input
                placeholder="Instructor"
                value={editingCourse.instructor}
                onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                className="bg-slate-50 border-slate-300"
              />
              <Input
                placeholder="Category"
                value={editingCourse.category}
                onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                className="bg-slate-50 border-slate-300"
              />
              <Input
                placeholder="Schedule"
                value={editingCourse.schedule}
                onChange={(e) => setEditingCourse({ ...editingCourse, schedule: e.target.value })}
                className="bg-slate-50 border-slate-300"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleSaveEdit}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
              >
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showEnrollmentModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Manage Enrollment</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowEnrollmentModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 font-medium">Course</p>
                <p className="text-slate-900 font-semibold">{selectedCourse.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Instructor</p>
                <p className="text-slate-900 font-semibold">{selectedCourse.instructor}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Current Enrollment</p>
                <p className="text-slate-900 font-semibold">{selectedCourse.students} students</p>
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">Update Enrollment Count</label>
                <Input
                  type="number"
                  defaultValue={selectedCourse.students}
                  className="mt-2 bg-slate-50 border-slate-300"
                />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Credits</p>
                <p className="text-slate-900 font-semibold">{selectedCourse.credits} credits</p>
              </div>
            </div>
            <Button
              onClick={() => setShowEnrollmentModal(false)}
              className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
            >
              Done
            </Button>
          </Card>
        </div>
      )}
    </section>
  )
}
