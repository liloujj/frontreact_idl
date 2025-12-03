"use client"

import { useState, useEffect } from "react"
import { Users, Search, Plus, Edit2, Trash2, Mail, BookOpen, TrendingUp, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  university: string
  enrolledCourses: number
}

export default function StudentDashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", university: "" })
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const API_URL = "http://localhost:8080/api/students" // <- adapte selon ton backend / gateway

  // ⚡ Récupération des étudiants depuis le backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error("Erreur lors du chargement des étudiants")
        const data: Student[] = await res.json()
        setStudents(data)
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue")
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  const filteredStudents = students.filter(
    (student) =>
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Ajouter un étudiant
  const handleAddStudent = async () => {
    if (formData.firstName && formData.lastName && formData.email) {
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error("Erreur lors de l'ajout de l'étudiant")
        const newStudent: Student = await res.json()
        setStudents([...students, newStudent])
        setFormData({ firstName: "", lastName: "", email: "", university: "" })
        setShowForm(false)
      } catch (err: any) {
        alert(err.message)
      }
    }
  }

  // Supprimer un étudiant
  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet étudiant ?")) return
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erreur lors de la suppression")
      setStudents(students.filter((s) => s.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  // Voir détails
  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student)
    setShowDetailsModal(true)
  }

  // Editer étudiant
  const handleEditStudent = (student: Student) => {
    setEditingStudent({ ...student })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (editingStudent) {
      try {
        const res = await fetch(`${API_URL}/${editingStudent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingStudent),
        })
        if (!res.ok) throw new Error("Erreur lors de la mise à jour")
        const updated: Student = await res.json()
        setStudents(students.map((s) => (s.id === updated.id ? updated : s)))
        setShowEditModal(false)
        setEditingStudent(null)
      } catch (err: any) {
        alert(err.message)
      }
    }
  }

  if (loading) return <p className="text-center py-12">Chargement des étudiants...</p>
  if (error) return <p className="text-center py-12 text-red-500">{error}</p>

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-foreground">Student Management</h2>
            <p className="text-muted-foreground">Add, update, and manage student records</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gap-2 bg-gradient-to-r from-primary to-accent text-white"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card className="mb-8 p-6 border border-primary/10">
          <h3 className="text-lg font-bold text-foreground mb-4">Add New Student</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <Input
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              placeholder="University"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddStudent} className="bg-gradient-to-r from-primary to-accent text-white">
              Save Student
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card
            key={student.id}
            className="p-6 hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {student.firstName[0]}
                  {student.lastName[0]}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10 text-primary"
                  onClick={() => handleEditStudent(student)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 text-destructive"
                  onClick={() => handleDeleteStudent(student.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <h3 className="font-bold text-lg text-foreground mb-1">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 font-medium">{student.university}</p>
            <div className="space-y-3 mb-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="w-4 h-4 text-accent" />
                <span>{student.enrolledCourses} courses enrolled</span>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full text-sm bg-transparent"
                size="sm"
                onClick={() => handleViewDetails(student)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-lg">No students found</p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1 font-medium">Total Students</p>
              <p className="text-4xl font-bold text-primary">{students.length}</p>
            </div>
            <Users className="w-10 h-10 text-primary/30" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1 font-medium">Avg Enrollment</p>
              <p className="text-4xl font-bold text-accent">
                {(students.reduce((acc, s) => acc + s.enrolledCourses, 0) / students.length).toFixed(1)}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-accent/30" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1 font-medium">Institution</p>
              <p className="text-4xl font-bold text-secondary">1</p>
            </div>
            <div className="w-10 h-10 bg-secondary/20 rounded-lg" />
          </div>
        </Card>
      </div>

      {/* Modals */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-background max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Student Details</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowDetailsModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Full Name</p>
                <p className="text-foreground font-semibold">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Email</p>
                <p className="text-foreground font-semibold">{selectedStudent.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">University</p>
                <p className="text-foreground font-semibold">{selectedStudent.university}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Enrolled Courses</p>
                <p className="text-foreground font-semibold">{selectedStudent.enrolledCourses}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Student ID</p>
                <p className="text-foreground font-semibold">{selectedStudent.id}</p>
              </div>
            </div>
            <Button
              onClick={() => setShowDetailsModal(false)}
              className="w-full mt-6 bg-gradient-to-r from-primary to-accent text-white"
            >
              Close
            </Button>
          </Card>
        </div>
      )}

      {showEditModal && editingStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-background max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Edit Student</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowEditModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <Input
                placeholder="First Name"
                value={editingStudent.firstName}
                onChange={(e) => setEditingStudent({ ...editingStudent, firstName: e.target.value })}
              />
              <Input
                placeholder="Last Name"
                value={editingStudent.lastName}
                onChange={(e) => setEditingStudent({ ...editingStudent, lastName: e.target.value })}
              />
              <Input
                placeholder="Email"
                type="email"
                value={editingStudent.email}
                onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
              />
              <Input
                placeholder="University"
                value={editingStudent.university}
                onChange={(e) => setEditingStudent({ ...editingStudent, university: e.target.value })}
              />
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={handleSaveEdit} className="flex-1 bg-gradient-to-r from-primary to-accent text-white">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </section>
  )
}
