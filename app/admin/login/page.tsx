'use client'

import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (session) {
    router.push('/admin')
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Identifiants incorrects')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-grayLight via-red-50 to-grayLight relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primaryLight rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-primaryLight/5 rounded-full animate-float"></div>
      </div>

      <Header />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/50">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary font-serif">Espace Admin</h1>
            <p className="text-grayMedium mt-2">Connectez-vous pour accéder au tableau de bord</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label htmlFor="email" className="block text-sm font-medium text-grayDark mb-2 group-focus-within:text-primary transition-colors">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50"
              />
            </div>

            <div className="group">
              <label htmlFor="password" className="block text-sm font-medium text-grayDark mb-2 group-focus-within:text-primary transition-colors">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primaryDark transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
