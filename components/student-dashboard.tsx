"use client"

import { useEffect, useState } from "react"
import { Users, Search, Plus, Edit2, Trash2, Mail, BookOpen, TrendingUp, Eye, X, Locate, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import axios from "axios"
import { id } from "date-fns/locale"
import { Items } from "./ui/dropdown"
import { DocumentNode, gql, } from "@apollo/client";

interface Student {
  id: string
  name: string
  address: string
  university: University
}
interface StudentEdit {
  id: string
  name: string
  address: string
  university: {
    id: string
  }
}
interface Student {
  id: string
  name: string
  address: string
  university: University
}

interface University {
  id: string,
  name: string
}



export function StudentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [university, setUniversity] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", address: "", univ: 0 })
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        // Encode the query for URL
        const query = encodeURIComponent(`
          query {
            universities {
              id
              name
            }
          }
        `);

        const res = await fetch(`http://localhost:8001/api/graphql/?query=${query}`);
        const json = await res.json();

        setUniversities(json.data.universities);
      } catch (err: any) {
        setError(err.message || "Error fetching universities");
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);




  useEffect(() => {
    axios.get("http://localhost:8001/api/student/all", { timeout: 5000 })
      .then(res => {

        const response = Array.isArray(res.data) ? res.data : res.data.results || [];
        const students: Student[] = response[0].map((item: any) => ({
          id: item.id?.toString() || '',
          name: item.name ?? item.name ?? '',
          address: item.address ?? item.address ?? '',
          university: {
            id: item.university?.id ?? '',
            name: item.university?.name ?? '',
          }
        }));
        setStudents(students);
      })
      .catch(err => {
        if (err.response) {
          console.error("Server responded with error:", err.response);
        } else if (err.request) {
          console.error("No response received:", err.request);
        } else {
          console.error("Axios error:", err.message);
        }
      });

  }, []);





  const filteredStudents = Array.isArray(students)
    ? students.filter((student) => {
      const search = searchTerm.toLowerCase();

      const id = student.id?.toLowerCase().includes(search);
      const name = student.name?.toLowerCase().includes(search);
      const address = student.address?.toLowerCase().includes(search);
      const nameUiniv = student.university?.name?.toLowerCase().includes(search);

      return id || name || address || nameUiniv;
    })
    : [];



  const filteredUniversity = Array.isArray(university)
    ? university.filter(
      (university) =>
        university.name
    )
    : [];


  const handleAddStudent = async () => {

    if (formData.univ && formData.name && formData.address) {
      console.log(formData.name + " " + formData.address + " " + formData.univ)
      try {
        const res = await axios.post("http://127.0.0.1:8001/api/student/add", {

          name: formData.name,
          address: formData.address,
          university: {
            id: formData.univ
          }
        });
        setStudents(res.data);
        setFormData({ name: "", address: "", univ: 0 });
        // setShowError(false)
        setShowForm(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // setShowError(true)
          if (error.response) {
            alert("Error response:" + JSON.stringify(error.response.data));
            // setErrormessage(
            //   Object.entries(error.response.data)
            //     .map(([field, messages]) => {
            //       return `${field}: ${(messages as string[])}`
            //     })
            //     .join(" | ")
            // );
          } else if (error.request) {
            alert("No response received:" + error.request);
          } else {
            alert("Axios error:" + error.message);
          }
        } else {

          alert("Unexpected error:");
        }
      }
    }
  };



  const handleDeleteStudent = async (id: string) => {

    if (!id) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this student?");

    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `http://127.0.0.1:8001/api/student/delete/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );

      console.log("✅ Student deleted:", res.status, res.data);

      setStudents((prev) => prev.filter((s) => s.id !== id));

    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error(
          "❌ Delete failed:",
          err.response?.data || err.message || "Unknown error"
        );
      } else {
        console.error("❌ Unexpected error:", err);
      }
    }
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student)
    setShowDetailsModal(true)
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent({ ...student })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (editingStudent) {
      try {
        const res = await axios.put(
          `http://127.0.0.1:8001/api/student/update/${editingStudent.id}`,
          {
            name: editingStudent.name,
            address: editingStudent.address,
            university: { id: editingStudent.university.id }
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 5000,
          }
        );
      } catch (err: any) {

        if (axios.isAxiosError(err)) {
          console.error("Axios error:");
          console.log("Status:", err.response?.status);
          console.log("Headers:", err.response?.headers);
          console.log("Data:", err.response?.data);
          console.log("Request:", err.request);
        } else {
          console.error("Unexpected error:", err);
        }
      }
      setStudents(prev =>
        prev.map(s => (s.id === editingStudent.id ? { ...editingStudent } : s))
      );
      setShowEditModal(false)
      setEditingStudent(null)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Student Management
            </h2>
            <p className="text-slate-600">Add, update, and manage student records</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-50 border-slate-300 focus:border-blue-400 focus:bg-white"
          />
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/20 hover:from-blue-600 hover:to-cyan-500"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card className="mb-8 p-6 border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Student</h3>
          {/* {showError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 animate-fade-in">
              <span>{errormessage}</span>
              <button
                onClick={() => setShowError(false)}
                className="absolute top-1 right-1 text-red-700 hover:text-red-900"
              >
                <X size={16} />
              </button>
            </div>
          )} */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white border-slate-300"
            />
            <Input
              placeholder="address"
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="bg-white border-slate-300"
            />
            <Items defaultValue="" className="bg-white border-slate-300" value={formData.univ}
              onChange={(e) => setFormData({ ...formData, univ: Number(e.target.value) })}>

              <option value='0' disabled>
                Select a university
              </option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}


            </Items>


          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAddStudent}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white"
            >
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
            className="p-6 hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 bg-gradient-to-br from-white to-slate-50/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-2xl font-bold text-white">
                  {student.name[0] ?? ''}

                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-blue-100 text-blue-600"
                  onClick={() => handleEditStudent(student)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-red-100 text-red-600"
                  onClick={() => handleDeleteStudent(student.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h3 className="font-bold text-lg text-slate-900 mb-1">
              {student.name}
            </h3>
            <p className="text-sm text-slate-600 mb-4 font-medium">{student.university.name}</p>

            <div className="space-y-3 mb-4 text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-blue-500" />

                <span className="text-slate-600">{student.address}</span>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                className="w-full text-sm bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-200 text-blue-600"
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
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-muted-foreground text-lg">No students found</p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 border-blue-300/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1 font-medium">Total Students</p>
              <p className="text-4xl font-bold text-blue-600">{students.length}</p>
            </div>
            <Users className="w-10 h-10 text-blue-400/30" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-400/10 border-cyan-300/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1 font-medium">Avg Enrollment</p>
              <p className="text-4xl font-bold text-cyan-600">
                {students.length
                  ? (students.reduce((acc, s) => acc, 0) / students.length).toFixed(1)
                  : 0.0}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-cyan-400/30" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-slate-500/10 to-slate-400/10 border-slate-300/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1 font-medium">Institution</p>
              <p className="text-4xl font-bold text-slate-700">1</p>
            </div>
            <div className="w-10 h-10 bg-slate-300/20 rounded-lg" />
          </div>
        </Card>
      </div>

      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Student Details</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowDetailsModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 font-medium">Full Name</p>
                <p className="text-slate-900 font-semibold">
                  {selectedStudent.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Email</p>
                <p className="text-slate-900 font-semibold">{selectedStudent.address}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">University</p>
                <p className="text-slate-900 font-semibold">{selectedStudent.university.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Enrolled Courses</p>
                <p className="text-slate-900 font-semibold">{3}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Student ID</p>
                <p className="text-slate-900 font-semibold">{selectedStudent.id}</p>
              </div>
            </div>
            <Button
              onClick={() => setShowDetailsModal(false)}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500"
            >
              Close
            </Button>
          </Card>
        </div>
      )}

      {showEditModal && editingStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Edit Student</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowEditModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <Input
                placeholder="Full Name"
                value={editingStudent.name}
                onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                className="bg-slate-50 border-slate-300"
              />
              <Input
                placeholder="Address"
                type="text"
                value={editingStudent.address}
                onChange={(e) => {
                  setEditingStudent({ ...editingStudent, address: e.target.value })
                }}
                className="bg-slate-50 border-slate-300"
              />
              <Items
               
                className="bg-white border-slate-300"
                onChange={(e) => {
                  const selectedUniv = universities.find(
                    (u) => u.id === e.target.value
                  );

                  if (!selectedUniv) return;

                  alert(selectedUniv.id + " " + selectedUniv.name);

                  setEditingStudent({
                    ...editingStudent,
                    university: {
                      id: selectedUniv.id,
                      name: selectedUniv.name
                    }
                  });
                }}
              >
                <option value="" disabled>Select a university</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Items>


            </div>
            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleSaveEdit}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500"
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
    </section>
  )
}
function useQuery(GET_UNIVERSITIES: DocumentNode): { data: any; loading: any; error: any } {
  throw new Error("Function not implemented.")
}

