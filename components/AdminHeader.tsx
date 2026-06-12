import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function AdminHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <Link href="https://dbageneve.com" className="flex items-center gap-6">
          <img 
            src="/logo.png" 
            alt="Logo DBA Genève" 
            className="h-20 w-auto" 
          />
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold text-primary font-serif">
              DBA Genève
            </h1>
            <p className="text-base text-grayMedium">
              Espace Admin
            </p>
          </div>
        </Link>
        <button
          onClick={() => signOut()}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition"
        >
          Déconnexion
        </button>
      </div>
    </header>
  )
}
