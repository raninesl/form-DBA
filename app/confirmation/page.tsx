'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import { useEffect } from 'react'

export default function ConfirmationPage() {
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('opacity-100', 'translate-y-0');
      }, index * 150);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-grayLight via-red-50 to-grayLight relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primaryLight rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-primaryLight/5 rounded-full animate-float"></div>
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-gold/10 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s', animationDuration: '6s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1.5s', animationDuration: '8s' }}></div>
      </div>
      
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative z-10">
        <div className="max-w-lg w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center border border-white/50 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
          <div className="mb-6 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
            <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
              <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-4 font-serif animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">Merci pour votre candidature!</h1>
          <p className="text-grayMedium mb-8 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
            Votre candidature a été envoyée avec succès. Vous recevrez un email de confirmation dans les prochaines minutes.
          </p>
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
            <Link
              href="https://dbageneve.com"
              className="inline-block bg-primary text-white py-3 px-8 rounded-lg font-semibold hover:bg-primaryDark transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Retour au site
            </Link>
          </div>
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
