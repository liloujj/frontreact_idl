"use client"

import { useEffect, useState } from "react"

interface University {
  id: number
  name: string
  location: string
}

export default function UniversityPage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_URL = "http://localhost:8080/universities"

  const fetchUniversities = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error("Failed to fetch universities")
      const data: University[] = await res.json()
      setUniversities(data)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const addUniversity = async () => {
    if (!name || !location) return alert("Fill all fields")
    try {
      setLoading(true)
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location }),
      })
      if (!res.ok) throw new Error("Failed to add university")
      setName("")
      setLocation("")
      fetchUniversities()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteUniversity = async (id: number) => {
    if (!confirm("Are you sure you want to delete this university?")) return
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete university")
      fetchUniversities()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUniversities()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <h1 className="text-5xl font-extrabold text-blue-900 mb-12 text-center drop-shadow-lg">
        University Management
      </h1>

      {/* Error */}
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {/* Form */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
        <input
          className="border border-blue-300 rounded-xl px-5 py-3 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md placeholder:text-blue-300 transition"
          placeholder="University name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border border-blue-300 rounded-xl px-5 py-3 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md placeholder:text-blue-300 transition"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          onClick={addUniversity}
          disabled={loading}
          className="bg-blue-700 text-white px-7 py-3 rounded-xl shadow-lg hover:bg-blue-800 hover:scale-105 transform transition-all duration-300 disabled:opacity-50"
        >
          + Add University
        </button>
      </div>

      {/* Universities Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading && <p className="col-span-full text-center text-blue-500">Loading...</p>}
        {!loading && universities.length > 0 ? (
          universities.map((u) => (
            <div
              key={u.id}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl p-6 hover:shadow-[0_20px_40px_rgba(30,64,175,0.3)] hover:scale-105 transition-transform duration-300 relative border border-blue-200"
            >
              <h2 className="text-2xl font-bold text-blue-900 mb-2">{u.name}</h2>
              <p className="text-blue-700 mb-4">{u.location}</p>
              <button
                onClick={() => deleteUniversity(u.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-600 font-semibold transition-colors"
                title="Delete University"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          !loading && (
            <p className="col-span-full text-center text-blue-300 mt-8 text-lg">
              No universities found.
            </p>
          )
        )}
      </div>
    </div>
  )
}
