export type ApplicationStatus = 'NEW' | 'IN_PROGRESS' | 'ACCEPTED' | 'REJECTED'

export const statusLabels: Record<ApplicationStatus, string> = {
  NEW: 'Nouvelle',
  IN_PROGRESS: 'En cours',
  ACCEPTED: 'Acceptée',
  REJECTED: 'Refusée',
}

export const statusColors: Record<ApplicationStatus, string> = {
  NEW: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}
