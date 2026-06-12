'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import type { Application } from '@prisma/client'
import { ApplicationStatus, statusLabels, statusColors } from '@/lib/types'
import AdminHeader from '@/components/AdminHeader'

export default function ApplicationDetail() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session && params.id) {
      fetchApplication()
    }
  }, [session, params.id])

  const fetchApplication = async () => {
    try {
      const res = await fetch(`/api/applications/${params.id}`)
      const data = await res.json()
      setApplication(data.application)
    } catch (error) {
      console.error('Error fetching application:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: ApplicationStatus) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/applications/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      setApplication(data.application)
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const deleteApplication = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      return
    }

    try {
      await fetch(`/api/applications/${params.id}`, {
        method: 'DELETE',
      })
      router.push('/admin')
    } catch (error) {
      console.error('Error deleting application:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-grayLight flex items-center justify-center">
        <div className="text-grayMedium">Chargement...</div>
      </div>
    )
  }

  if (!session || !application) {
    return null
  }

  return (
    <div className="min-h-screen bg-grayLight">
      <AdminHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin" className="text-primary hover:text-primaryDark flex items-center gap-2 mb-4">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour au tableau de bord
        </Link>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-grayDark font-serif">
                {application.firstName} {application.lastName}
              </h2>
              <p className="text-grayMedium">{application.email}</p>
            </div>
            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${statusColors[application.status]}`}>
              {statusLabels[application.status]}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-medium text-grayMedium uppercase mb-2">Informations personnelles</h3>
              <div className="space-y-2 text-grayDark">
                <div><span className="font-medium">Téléphone :</span> {application.phone}</div>
                <div><span className="font-medium">Date de naissance :</span> {new Date(application.birthDate).toLocaleDateString('fr-FR')}</div>
                <div><span className="font-medium">Pays :</span> {application.country}</div>
                <div><span className="font-medium">Ville :</span> {application.city}</div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-grayMedium uppercase mb-2">Candidature</h3>
              <div className="space-y-2 text-grayDark">
                <div><span className="font-medium">Formation souhaitée :</span> {application.desiredProgram}</div>
                <div><span className="font-medium">Niveau d'études :</span> {application.studyLevel}</div>
                <div><span className="font-medium">Date de candidature :</span> {new Date(application.createdAt).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
          </div>

          {application.message && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-grayMedium uppercase mb-2">Message / Motivation</h3>
              <p className="text-grayDark">{application.message}</p>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-sm font-medium text-grayMedium uppercase mb-2">Documents</h3>
            <div className="space-y-2">
              {application.cvUrl && (
                <a
                  href={application.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primaryDark flex items-center gap-2"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Télécharger le CV
                </a>
              )}
              {application.diplomaUrl && (
                <a
                  href={application.diplomaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primaryDark flex items-center gap-2"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Télécharger le diplôme / relevé
                </a>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-grayMedium uppercase mb-4">Changer le statut</h3>
            <div className="flex flex-wrap gap-3">
              {(['NEW', 'IN_PROGRESS', 'ACCEPTED', 'REJECTED'] as ApplicationStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  disabled={updating || application.status === status}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    application.status === status
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primaryDark'
                  }`}
                >
                  {statusLabels[status]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <button
              onClick={deleteApplication}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Supprimer la candidature
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
