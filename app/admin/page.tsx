'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Application } from '@prisma/client'
import { ApplicationStatus, statusLabels, statusColors } from '@/lib/types'
import AdminHeader from '@/components/AdminHeader'
import * as XLSX from 'xlsx'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterProgram, setFilterProgram] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchApplications()
    }
  }, [session])

  useEffect(() => {
    let filtered = [...applications]

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(app =>
        app.firstName.toLowerCase().includes(searchLower) ||
        app.lastName.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower)
      )
    }

    if (filterProgram) {
      filtered = filtered.filter(app => app.desiredProgram === filterProgram)
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setFilteredApplications(filtered)
  }, [applications, search, filterProgram])

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications')
      const data = await res.json()
      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToExcel = () => {
    const data = filteredApplications.map(app => ({
      'Nom': app.lastName,
      'Prénom': app.firstName,
      'Email': app.email,
      'Téléphone': app.phone,
      'Date de naissance': new Date(app.birthDate).toLocaleDateString('fr-FR'),
      'Pays': app.country,
      'Ville': app.city,
      'Niveau d\'études': app.studyLevel,
      'Formation souhaitée': app.desiredProgram,
      'Message': app.message || '',
      'Statut': statusLabels[app.status],
      'Date de candidature': new Date(app.createdAt).toLocaleDateString('fr-FR'),
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidatures')
    XLSX.writeFile(workbook, 'candidatures.xlsx')
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-grayLight flex items-center justify-center">
        <div className="text-grayMedium">Chargement...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const programs = Array.from(new Set(applications.map(app => app.desiredProgram)))

  return (
    <div className="min-h-screen bg-grayLight">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="">Toutes les formations</option>
            {programs.map(program => (
              <option key={program} value={program}>{program}</option>
            ))}
          </select>
          <button
            onClick={exportToExcel}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition"
          >
            Exporter Excel
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-grayLight">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-grayMedium uppercase tracking-wider">
                    Candidat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-grayMedium uppercase tracking-wider">
                    Formation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-grayMedium uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-grayMedium uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-grayMedium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-grayLight">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-grayDark">
                        {app.firstName} {app.lastName}
                      </div>
                      <div className="text-sm text-grayMedium">{app.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-grayMedium">
                      {app.desiredProgram}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[app.status]}`}>
                        {statusLabels[app.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-grayMedium">
                      {new Date(app.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/${app.id}`}
                        className="text-primary hover:text-primaryDark mr-4"
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12 text-grayMedium">
            Aucune candidature trouvée
          </div>
        )}
      </main>
    </div>
  )
}
