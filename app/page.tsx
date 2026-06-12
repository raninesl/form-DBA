'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { countries } from '@/lib/countries'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [honeypot, setHoneypot] = useState('')
  const [selectedCountryName, setSelectedCountryName] = useState('Suisse')
  const [formFilled, setFormFilled] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          setTimeout(() => {
            el.classList.add('opacity-100', 'translate-y-0');
          }, index * 100);
        }
      });
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (honeypot) {
      router.push('/confirmation')
      return
    }

    setLoading(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors(data.errors || {})
        setLoading(false)
        return
      }

      router.push('/confirmation')
    } catch (error) {
      console.error('Error submitting form:', error)
      setLoading(false)
    }
  }

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
      <div className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
            <h1 className="text-4xl font-bold text-primary mb-4 font-serif">Candidature en ligne</h1>
            <p className="text-grayMedium">Remplissez le formulaire ci-dessous pour postuler à nos formations</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/50 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="hidden">
                <label htmlFor="honeypot">Ne remplissez pas ce champ</label>
                <input
                  type="text"
                  id="honeypot"
                  name="honeypot"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
                <div className="group">
                  <label htmlFor="lastName" className="block text-sm font-medium text-grayDark mb-2 group-focus-within:text-primary transition-colors">Nom *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                </div>

                <div className="group">
                  <label htmlFor="firstName" className="block text-sm font-medium text-grayDark mb-2 group-focus-within:text-primary transition-colors">Prénom *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-grayDark mb-2 group-focus-within:text-primary transition-colors">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="group">
                  <label htmlFor="phone" className="block text-sm font-medium text-grayDark mb-2 group-focus-within:text-primary transition-colors">Téléphone *</label>
                  <div className="flex gap-2 w-full">
                    <select
                      name="phoneCode"
                      value={countries.find(c => c.name === selectedCountryName)?.dialCode}
                      onChange={(e) => {
                        const country = countries.find(c => c.dialCode === e.target.value);
                        if (country) {
                          setSelectedCountryName(country.name);
                        }
                      }}
                      className="shrink-0 w-36 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50"
                    >
                      {countries.map(country => (
                        <option key={country.code} value={country.dialCode}>
                          {country.dialCode}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className={`flex-1 min-w-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>
              </div>

              <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out group">
                <label htmlFor="birthDate" className="block text-sm font-medium text-grayDark mb-2 group-focus-within:text-primary transition-colors">Date de naissance *</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50 ${errors.birthDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.birthDate && <p className="mt-1 text-sm text-red-500">{errors.birthDate}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
                <div className="group">
                  <label htmlFor="country" className="block text-sm font-medium text-grayDark mb-2 group-focus-within:text-primary transition-colors">Pays *</label>
                  <select
                    id="country"
                    name="country"
                    value={selectedCountryName}
                    onChange={(e) => setSelectedCountryName(e.target.value)}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50 ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Sélectionnez un pays</option>
                    {countries.map(country => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
                </div>

                <div className="group">
                  <label htmlFor="city" className="block text-sm font-medium text-grayDark mb-2 group-focus-within:text-primary transition-colors">Ville *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                </div>
              </div>

              <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out group">
                <label htmlFor="studyLevel" className="block text-sm font-medium text-grayDark mb-2 group-focus-within:text-primary transition-colors">Niveau d'études *</label>
                <select
                  id="studyLevel"
                  name="studyLevel"
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50 ${errors.studyLevel ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Sélectionnez votre niveau</option>
                  <option value="BAC">Baccalauréat</option>
                  <option value="BAC+2">BAC+2 (BTS, DUT)</option>
                  <option value="BAC+3">BAC+3 (Licence)</option>
                  <option value="BAC+5">BAC+5 (Master)</option>
                  <option value="BAC+8">BAC+8 (Doctorat)</option>
                  <option value="Autre">Autre</option>
                </select>
                {errors.studyLevel && <p className="mt-1 text-sm text-red-500">{errors.studyLevel}</p>}
              </div>

              <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out group">
                <label htmlFor="desiredProgram" className="block text-sm font-medium text-grayDark mb-2 group-focus-within:text-primary transition-colors">Formation souhaitée *</label>
                <select
                  id="desiredProgram"
                  name="desiredProgram"
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50 ${errors.desiredProgram ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Sélectionnez une formation</option>
                  <option value="DBA en Management, Innovation et Transformation des Organisations">DBA en Management, Innovation et Transformation des Organisations</option>
                  <option value="DBA en Finance et Gouvernance Stratégique">DBA en Finance et Gouvernance Stratégique</option>
                  <option value="DBA en Science Politique et Diplomatie Économique">DBA en Science Politique et Diplomatie Économique</option>
                  <option value="DBA en Droit International et Droit des Affaires">DBA en Droit International et Droit des Affaires</option>
                  <option value="DBA en Ingénierie Informatique et Business IA">DBA en Ingénierie Informatique et Business IA</option>
                </select>
                {errors.desiredProgram && <p className="mt-1 text-sm text-red-500">{errors.desiredProgram}</p>}
              </div>

              <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out group">
                <label className="block text-sm font-medium text-grayDark mb-2 group-focus-within:text-primary transition-colors">Modules de perfectionnement (optionnels)</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="module-management"
                      name="trainingModules"
                      value="Outils de management"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition-all duration-300"
                    />
                    <label htmlFor="module-management" className="text-sm text-grayDark">Outils de management</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="module-data"
                      name="trainingModules"
                      value="Logiciels de data analysis (Python, SPSS, CRM, BI)"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition-all duration-300"
                    />
                    <label htmlFor="module-data" className="text-sm text-grayDark">Logiciels de data analysis (Python, SPSS, CRM, BI)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="module-english"
                      name="trainingModules"
                      value="Anglais des affaires"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition-all duration-300"
                    />
                    <label htmlFor="module-english" className="text-sm text-grayDark">Anglais des affaires</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="module-fle"
                      name="trainingModules"
                      value="FLE (Français Langue Etrangère)"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition-all duration-300"
                    />
                    <label htmlFor="module-fle" className="text-sm text-grayDark">FLE (Français Langue Etrangère)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="module-writing"
                      name="trainingModules"
                      value="Ateliers de rédaction scientifique"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition-all duration-300"
                    />
                    <label htmlFor="module-writing" className="text-sm text-grayDark">Ateliers de rédaction scientifique</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="module-bibliographic"
                      name="trainingModules"
                      value="Accompagnement bibliographique et accès aux archives universitaires"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition-all duration-300"
                    />
                    <label htmlFor="module-bibliographic" className="text-sm text-grayDark">Accompagnement bibliographique et accès aux archives universitaires</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="module-coaching"
                      name="trainingModules"
                      value="Coaching de thèse"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition-all duration-300"
                    />
                    <label htmlFor="module-coaching" className="text-sm text-grayDark">Coaching de thèse</label>
                  </div>
                </div>
              </div>

              <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out group">
                <label htmlFor="message" className="block text-sm font-medium text-grayDark mb-2 group-focus-within:text-primary transition-colors">Message / Motivation</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50"
                ></textarea>
              </div>

              <div className="space-y-4 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
                <div className="group">
                  <label htmlFor="cv" className="block text-sm font-medium text-grayDark mb-2 group-focus-within:text-primary transition-colors">CV (PDF, JPG, PNG, DOC, DOCX) *</label>
                  <div className="relative">
                    <input
                      type="file"
                      id="cv"
                      name="cv"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primaryDark file:cursor-pointer"
                    />
                  </div>
                  {errors.cv && <p className="mt-1 text-sm text-red-500">{errors.cv}</p>}
                </div>

                <div className="group">
                  <label htmlFor="diploma" className="block text-sm font-medium text-grayDark mb-2 group-focus-within:text-primary transition-colors">Diplôme / Relevé de notes (PDF, JPG, PNG, DOC, DOCX)</label>
                  <div className="relative">
                    <input
                      type="file"
                      id="diploma"
                      name="diploma"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primaryDark file:cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
                <input
                  type="checkbox"
                  id="rgpd"
                  name="rgpd"
                  required
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition-all duration-300"
                />
                <label htmlFor="rgpd" className="text-sm text-grayDark">
                  J'accepte que mes données personnelles soient collectées et traitées dans le cadre de ma candidature, conformément au RGPD. *
                </label>
              </div>
              {errors.rgpd && <p className="mt-1 text-sm text-red-500">{errors.rgpd}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold hover:bg-primaryDark transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </span>
                ) : (
                  'Envoyer ma candidature'
                )}
              </button>
            </form>
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
